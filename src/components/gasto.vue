<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card>
        <v-toolbar class="blue-grey darken-3" dark>
          <v-btn icon color="blue darken-2" @click="plusClicked">
             <v-icon color="white">add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field  label="Valor no período" disabled v-model="valor_no_periodo"></v-text-field>
          <v-spacer></v-spacer>
          <v-flex xs12 sm6 md4>
              <v-menu ref="menu_inicio" lazy :close-on-content-click="false" v-model="menu_inicio" transition="scale-transition" offset-y  full-width :nudge-right="40" min-width="290px" :return-value.sync="data_inicio">
              <v-text-field slot="activator" label="Data de início"  v-model="data_inicio"  prepend-icon="event" readonly></v-text-field>
              <v-date-picker v-model="data_inicio" @input="$refs.menu_inicio.save(data_inicio)"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12 sm6 md4>
            <v-menu ref="menu_fim" lazy :close-on-content-click="false" v-model="menu_fim" transition="scale-transition" offset-y  full-width :nudge-right="40" min-width="290px" :return-value.sync="data_fim">
              <v-text-field slot="activator" label="Data fim"  v-model="data_fim"  prepend-icon="event" readonly></v-text-field>
              <v-date-picker v-model="data_fim" @input="$refs.menu_fim.save(data_fim)"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-btn flat icon color="blue--text mt-3" @click="search_gastos">
              <v-icon>search</v-icon>
          </v-btn>
        </v-toolbar>
        <form  v-show="showCreateOrUpdateItem">

          <v-select :items="$store.state.tipo_de_gasto_list" v-model="tipo_de_gasto_object" item-text="descricao" label="Tipo de Gasto Genérico" @change="changeSelectedTipoGastoGenerico" autocomplete></v-select>
          <v-flex xs12 sm6 md4>
            <v-menu ref="menu_gasto" lazy :close-on-content-click="false" v-model="menu_gasto" transition="scale-transition" offset-y  full-width :nudge-right="40" min-width="290px" :return-value.sync="actualItem.dataDoGasto">
              <v-text-field slot="activator" label="Data do gasto"  v-model="actualItem.dataDoGasto"  prepend-icon="event" readonly></v-text-field>
              <v-date-picker v-model="actualItem.dataDoGasto" @input="$refs.menu_gasto.save(actualItem.dataDoGasto)"></v-date-picker>
            </v-menu>

          </v-flex>
          <v-text-field  label="valor" v-model="actualItem.valor"></v-text-field>
          <v-text-field  label="Descrição" v-model="actualItem.descricao"></v-text-field>
          <v-text-field  v-if="actualItem.oid == null"  v-model="qtd" label="Repetir estes valores para meses subsequentes"></v-text-field>
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
                <v-list-tile-title v-text="item.print_string" ></v-list-tile-title>
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
  name: 'Gasto',
  data () {
    return {
      url: 'gasto-list/',
      tipo_de_gasto_list_url: 'tipo-gasto-list/',
      valor_no_periodo: 0,
      menu_inicio: null,
      data_inicio: null,
      menu_gasto: null,
      data_gasto: null,
      menu_fim: null,
      data_fim: null,
      page: 1,
      length: 0,
      total: 0,
      items: [],
      items_by_page: [],
      tipo_de_gasto_object: {},
      actualItem: {},
      qtd: 0,
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
      return this.items.sort((a, b) => { return a.print_string.toLowerCase().localeCompare(b.print_string.toLowerCase(), 'pt')})
    },
    tipos_de_gasto_sorted(arr_tipo_gasto) {
      return arr_tipo_gasto.sort((a,b) =>{ return a.descricao.toLowerCase() < b.descricao.toLowerCase() ? -1 : 1 })
    },
    update_length() {
      this.length = Math.ceil(this.items.length/10)
    },
    url_gastos_between(){
      let dt_inicio = this.date_time_as_string(new Date(this.data_inicio))
      let dt_fim = this.date_time_as_string(new Date(this.data_fim))
      console.log(dt_fim);
      return this.url + 'filter/data_do_gasto/between/' + dt_inicio + '&' + dt_fim + '/'
    },
    search_gastos() {
        this.get_gastos_between()
    },
    changeSelectedTipoGastoGenerico (obj) {
      this.actualItem.tipo_de_gasto = axios.defaults.baseURL + this.tipo_de_gasto_list_url + obj.oid + '/'
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
      this.qtd = 0
      this.actualItem.qtd_repeticao = 0
      this.actualItem = {}
      this.actualItem.qtd_repeticao = 0
      this.showCreateOrUpdateItem = true
    },
    cancel () {
      this.qtd = 0
      this.showCreateOrUpdateItem = false;
      this.actualItem.qtd_repeticao = 0;
      this.actualItem = {};
      this.tipo_de_gasto_object = {};
      this.actualItem.qtd_repeticao = 0;
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
      if (this.qtd > 0)
        this.actualItem.qtd_repeticao = this.qtd
      this.actualItem.pessoa = this.$store.state.user.iri

      axios.post(this.url, this.actualItem).then(response => {
        if (response.status === 201) {
          this.actualItem.oid = this.idFromUrl(response.headers['content-location'])
          let print_string =  (this.tipo_de_gasto_object != null)?this.tipo_de_gasto_object.descricao:' Tipo de gasto não informado '
          print_string += print_string  + (": " + this.actualItem.valor != null)?this.actualItem.valor:'0'
          console.log(print_string);
          this.actualItem.print_string = print_string
          this.items.push(this.actualItem)
          this.update_length()
          this.items = this.items_sorted()
          this.selected_page(this.page)
          this.clearFormFields()
          this.actualItem = {}
          this.showCreateOrUpdateItem = false
          this.clearFormFields()
        }
      })
      .catch(error => console.log(error))
    },
    clearFormFields () {
      this.tipo_de_gasto_object = {}
    },
    updateItem () {
      console.log(this.actualItem);
      this.actualItem.print_string = (this.get_tipo_de_gasto_object()? this.get_tipo_de_gasto_object().descricao: ' Tipo de gasto não informado: ') + this.actualItem.valor
      axios.put(this.url + this.actualItem.oid + '/', this.actualItem).then(response => {
        if (response.status === 204) {
          //this.items = this.items_sorted()
          this.clearFormFields()
        }
        this.showCreateOrUpdateItem = false
      })
      .catch(error => console.log(error))
    },
    get_tipo_de_gasto_object () {
      let genericItemList = []

      if (this.actualItem.tipo_de_gasto == null) {
        return null
      }
      let newid = this.idFromUrl(this.actualItem.tipo_de_gasto);

      genericItemList = this.$store.state.tipo_de_gasto_list.filter(anItem => anItem.oid === newid)
      if (genericItemList.length === 0) {
        return null;
      }
      return genericItemList[0];
    },

    editItem (item) {
      this.actualItem = item
      this.showCreateOrUpdateItem = true
      this.tipo_de_gasto_object = this.get_tipo_de_gasto_object()
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
    load_tipos_de_gasto() {
      axios.get(this.tipo_de_gasto_list_url).then(response => {
        this.set_tipo_de_gasto_list(this.tipos_de_gasto_sorted(response.data))
        this.update_length()
        this.selected_page(1)
      }).catch(error => console.log(error))
    },
    get_gasto_periodo() {
      let valor_total = 0
      this.items.forEach(item=> valor_total+=item.valor)
      return valor_total
    },
    get_gastos_between() {
      axios.get(this.url_gastos_between()).then(response => {
        this.items = response.data
        this.items = this.items_sorted()
        this.valor_no_periodo = this.get_gasto_periodo()
        this.update_length()
        this.selected_page(1)
      }).catch(error => console.log(error))
    },
    date_as_string(a_date) {
      return (a_date.getFullYear()) + '-' + (a_date.getMonth() + 1) + '-' + a_date.getDate()
    },
    date_time_as_string(a_date) {
      return this.date_as_string(a_date) + ' 00:00:00'
    },
    set_tipo_de_gasto_list(arr) {
      this.$store.commit('set_tipo_de_gasto_list', arr)
    }
  },

  created: function () {
    let a_date = new Date();
    this.data_inicio = this.date_as_string(new Date(a_date.getFullYear(), a_date.getMonth(), 1));
    this.data_fim = this.date_as_string(new Date(a_date.getFullYear(), a_date.getMonth() + 1, 0));
    this.get_gastos_between()
    this.load_tipos_de_gasto()
  }
}
</script>
<style scoped>
color: black
</style>
