<template>
  <v-parallax class="background" src="../../static/KanbanBoard.png">
    <v-layout column align-center justify-center>
      <h1 class="white--text"></h1>
      <h5 class="blue-grey--text">Visualize e planeje seus projetos, tarefas e atividades!<br><h6 class="text-xs-right"> Versão 1.0 </h6></h5>
    </v-layout>
  </v-parallax>
</template>

<script>

export default {
  data () {
    return {

    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .background {
    min-height: 100%;
    width: 100%;
    margin: auto;
  }
</style>
