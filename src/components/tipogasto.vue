<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card>
        <v-toolbar class="blue-grey darken-3" dark>
          <v-btn icon color="blue darken-2" @click="plusClicked">
             <v-icon color="white">add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field label="Pesquisar tipo de gasto..." class="blue--text mt-3" single-line  append-icon="search"></v-text-field>
        </v-toolbar>
        <form  v-show="showCreateOrUpdateItem">
          <v-text-field  label="Descrição" v-model="actualItem.descricao"></v-text-field>
          <v-select :items="items" v-model="tipo_generico_object" item-text="descricao" label="Tipo de Gasto Genérico" @change="changeSelectedTipoGastoGenerico" autocomplete></v-select>
          <v-btn round color="primary" @click="updateOrCreateItem">Confirmar</v-btn>
          <v-btn round color="primary" @click="cancel">Cancelar</v-btn>
        </form>
        <v-list >
            <v-list-tile v-for="(item, index) in items_by_page" :key="index" avatar @click="">
              <v-list-tile-action>
                <v-btn  purple lighten-4 icon @click.native="editItem(item)" >
                   <v-icon dark color="yellow lighten-3">edit</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn  purple lighten-4 icon @click.native="removeItem(item);">
                   <v-icon dark color="red lighten-2">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.descricao" ></v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <v-pagination :length="length" v-model="page" @input="selected_page"></v-pagination>
      </v-card>
    </v-flex>
  </v-layout>

</template>
<script>
import axios from 'axios'

export default {
  name: 'TipoGasto',
  data () {
    return {
      url: 'tipo-gasto-list/',
      tipo_generico_list_url: 'tipo-gasto-list/',
      page: 1,
      length: 0,
      total: 0,
      items: [],
      items_by_page: [],
      tipo_generico_list: [],
      tipo_generico_object: {},
      actualItem: {},
      showCreateOrUpdateItem: false
    }
  },
  methods: {
    selected_page(page_index) {
      let begin = (page_index - 1)  * 10;
      let end = (page_index - 1) * 10 + 10;
      this.items_by_page = this.items_sorted().slice(begin, end)
    },
    items_sorted() {
      //return this.items.sort((a,b) =>{ return a.descricao.toLowerCase() < b.descricao.toLowerCase() ? -1 : 1 })
      return this.items.sort((a, b) => { return a.descricao.toLowerCase().localeCompare(b.descricao.toLowerCase(), 'pt')})
    },

    update_length() {
      this.length = Math.ceil(this.items.length/10)
    },
    changeSelectedTipoGastoGenerico (obj) {
      this.actualItem.tipo_generico = axios.defaults.baseURL + this.tipo_generico_list_url + obj.oid + '/'
    },
    lastCharIsSlash (anUrl) {
      if (anUrl != null) {
        return anUrl.slice(-1) === '/'
      }
      return false
    },
    idFromUrl (anUrl) {
      if (anUrl == null) {
        return -1
      }
      // console.log(anUrl.slice(-1) === '/')
      let i = this.lastCharIsSlash(anUrl) ? 1 : 0
      return parseInt(anUrl.split('/').reverse()[i])
    },
    plusClicked () {
      this.showCreateOrUpdateItem = true
      this.actualItem = {}
    },
    cancel () {
      this.showCreateOrUpdateItem = false;
      this.actualItem = {};
      this.tipo_generico_object = {};
    },
    updateOrCreateItem () {
      //console.log(this.actualItem);
      if (this.actualItem.oid != null) {
        this.updateItem()
      } else {
        this.createItem()
      }
    },
    createItem () {
      axios.post(this.url, this.actualItem).then(response => {
        if (response.status === 201) {
          //console.log(response.headers);
          this.actualItem.oid = this.idFromUrl(response.headers['content-location'])
          this.items.push(this.actualItem)
          this.update_length()
          this.items = this.items_sorted()
          this.selected_page(this.page)
          this.clearFormFields()
          this.actualItem = {}
          this.showCreateOrUpdateItem = false
          this.clearFormFields()
          this.$store.commit('set_tipo_de_gasto_list', this.items)
        }
      })
      .catch(error => console.log(error))
    },
    clearFormFields () {
      this.tipo_generico_object = {}
    },
    updateItem () {
      axios.put(this.url + this.actualItem.oid + '/', this.actualItem).then(response => {
        if (response.status === 204) {
          //this.items = this.items_sorted()
          this.$store.commit('set_tipo_de_gasto_list', this.items)
          this.clearFormFields()
        }
        this.showCreateOrUpdateItem = false
      })
      .catch(error => console.log(error))
    },
    get_tipo_generico_object () {
      let genericItemList = []
      if (this.actualItem.tipo_generico == null) {
        return null
      }
      let newid = this.idFromUrl(this.actualItem.tipo_generico);
      genericItemList = this.items.filter(anItem => anItem.oid === newid)
      if (genericItemList.length === 0) {
        return null;
      }
      return genericItemList[0];
    },

    editItem (item) {
      this.actualItem = item
      this.showCreateOrUpdateItem = true
      this.tipo_generico_object = this.get_tipo_generico_object()
    },
    removeItem (item) {
      let index = this.items.indexOf(item)
      //let index2 = this.items_by_page.indexOf(item)
      axios.delete(this.url + item.oid + '/').then(response => {
        //console.log('Del: ' + this.url + item.oid + '/')
        if (index > -1) {
          this.items.splice(index, 1)
          this.update_length()
          this.selected_page(this.page)
        //  this.items_by_page.splice(index2, 1)
        }
      })
      .catch(error => console.log(error))
    },

  },
  created: function () {
    axios.get(this.url).then(response => {

      this.items = response.data
      this.items = this.items_sorted()
      this.$store.commit('set_tipo_de_gasto_list', this.items)
      this.update_length()
      this.selected_page(1)
    }).catch(error => console.log(error))
    //this.requestAllTipoGasto()
  }
}
</script>
<style scoped>
color: black
</style>
