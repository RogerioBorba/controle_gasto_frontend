<template>
  <v-app dark id="inspire" >
    <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>
      <v-list dense>
        <v-list-tile v-for="item in item_components_drawer()" :key="item.title" @click="selectedItem(item)">
          <v-list-tile-action>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="blue-grey darken-3" dense fixed clipped-left app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <div v-if="this.$store.state.user" class="blue--text"> {{this.$store.state.user.nome}} </div>
      <v-menu :nudge-width="100">
          <v-toolbar-title slot="activator">
            <v-btn icon>
                <v-icon>account_circle</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-list>
            <v-list-tile v-for="user_action in user_actions_menu()"  :key="user_action.title" @click="selectedAction(user_action)">
              <v-list-tile-title v-text="user_action.title"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
    </v-toolbar>
    <main>
      <v-content>
      <v-container class="containerFullWidth" fill-height>
        <v-layout justify-center>
           <keep-alive>
              <component :is="this.$store.state.current_component_name"></component>
            </keep-alive>
        </v-layout>
      </v-container>
    </v-content>
    </main>
    <v-footer app fixed>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  //import {config} from './config';
  import Home from './home';
  import Login from './login';
  import Register from './register';
  import TipoGasto from './tipogasto';
  import Gasto from './gasto';
  export default {
    name: 'Main',
    components: {
      'home': Home,
      'login': Login,
      'register': Register,
      'tipo_gasto': TipoGasto,
      'gasto': Gasto
    },
    data() {
      return {
        drawer: true,
        has_token: false,
        user_actions: [],
        item_components:[]
      }
    },
    methods: {
      selectedAction(user_action) {
        if (user_action.enabled)
          return this.execute_action(user_action.action);
      },
      selectedItem(an_user_action) {
        console.log(this.$store.state.token);
          if (this.$store.state.token == false)
              this.$store.commit('set_current_component_name', 'login')
          else
            this.$store.commit('set_current_component_name', an_user_action.component_name)

      },
      item_components_drawer() {
        return this.item_components.filter(an_item => ['home', 'tipo_gasto', 'gasto', 'pessoa' ].includes(an_item.component_name) );
      },
      user_actions_menu() {
        //return  this.user_actions.filter(an_user_action => an_user_action.enabled && ['login', 'logout', 'register'].includes(an_user_action.component_name) );
        return  this.user_actions; //.filter(an_user_action => an_user_action.enabled );
      },
      logout() {
        this.$store.commit('set_token', null);
        this.$store.commit('set_user', null);
        console.log(this.$store.getters.has_token);
      },
      register() {
          //console.log(this.showRegister);
          //this.showLoginOrRegister = false;
          this.$store.commit('set_current_component_name', 'register')
      },
      login(value) {
        this.$store.commit('set_current_component_name', 'login')
      },
      dinamic_method_for_action() {
        return  {'login': this.login, 'register': this.register, 'logout': this.logout}
      },
      execute_action(an_action_name) {
        let din_methods = this.dinamic_method_for_action();
        for (const [key, value] of Object.entries(din_methods))
          if (key == an_action_name )
            return value();
        return null;
      }
    },
    created: function() {
      //console.log(this.has_token());

      this.item_components = [
        { title: 'Controle de gasto', icon: 'home', color: 'white', component_name: 'home', enabled: this.$store.getters.has_token},
        { title: 'Tipos de gasto', icon: 'attach_money', color: 'blue', component_name: 'tipo_gasto', enabled: this.$store.getters.has_token},
        { title: 'Gastos', icon: 'money', color: 'green', component_name: 'gasto', enabled: this.$store.getters.has_token},
        { title: 'Pessoas', icon: 'people', color: 'yellow',  component_name: 'pessoa', enabled: this.$store.getters.has_token},


      ],
      this.user_actions = [
        {title: 'Login', icon: 'account_box', color: 'white', action: 'login', enabled: this.$store.state.token == null},
        {title: 'Logout', icon: 'not_interested', color: 'gray', action: 'logout', enabled: this.$store.state.token != null},
        {title: 'Registrar', icon: 'face', color: 'gray', action: 'register', enabled: this.$store.getters.token == null}
      ]},
  }
</script>
<style>
  .containerFullWidth {
    max-width: 100% !important
  }
</style>
