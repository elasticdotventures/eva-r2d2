<template>
  <div id="app">
    <img alt="R2d2 logo" width=100 src="./assets/r2d2.png">
    <HelloWorld msg="Welcome to R2d2 demo App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'




export default {
  name: 'app',
  components: {
    HelloWorld
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
