<template>
    <v-layout row wrap class="text-xs-center">
    <v-flex xs12 sm6 offset-sm3 justify-space-between>
      <v-card class="blue-grey darken-3">
        <v-card-title>
          <v-card-text class="title">LOGIN</v-card-text>
        </v-card-title>
        <v-card-text>
          <form @submit.prevent="login">
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  placeholder="Usuário" single-line v-model="user.nome"
                  append-icon="account_box" class="blue-grey--text mb-2" hide-details>
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  placeholder="Senha" single-line type="password" v-model="user.senha"
                  append-icon="vpn_key" class="blue-grey--text mb-5" hide-details @keyup.enter="login">
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-btn class="cyan--text" @click="login">login</v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios';
import { Base } from './config';
//const auth = store.state.auth;

export default {
  data () {
    return {
      temp_pass: '',
      user: {}
    }
  },
  methods: {
    lastCharIsBar(an_url) {
      if (an_url != null )
        return an_url.slice(-1) == '/';
      return false;
    },
    idFromUrl(an_url) {
        if (an_url == null)
          return -1;
        //console.log(an_url.slice(-1) == '/');
        let i =  this.lastCharIsBar(an_url) ? 1:0;
        return parseInt(an_url.split('/').reverse()[i]);
    },
    login(){
      let url = 'pessoa-list/login/';
          //this.user.password = Base.encode(this.user.password);
          axios.post(url, this.user).then( response => {
              if (response.status == 201) {
                this.user.iri = response.headers['content-location'];
                this.user.id = this.idFromUrl(response.headers['content-location']);
                this.$store.commit('set_user', this.user);
                this.$store.commit('set_token', response.headers['x-access-token']);
                //store.commit('setUser', this.user.user_name);
                //store.commit('setToken', response.headers['x-access-token']);
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.$store.state.token}`; // what
                //this.$router.push('/');
                this.$store.commit('set_current_component_name','home');
              }
          })
          .catch(error => {
            console.log(error);
          });
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title {
    font-family: 'Architects Daughter';
    font-size: 3em !important;
    color: #00b2cc;
  }
</style>
