<template>
  <div id="app">
    <app-root></app-root>    
  </div>
</template>

<script>

import RootView from './components/root';

export default {
  name: 'App',
  components: {
    'app-root': RootView
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
