<template>
  <div id="app">
    <Calculating/>
  </div>
</template>

<script>
import Calculating from '@/components/Calculating'

export default {
  name: 'App',
  components: {
    Calculating
  }
}
</script>

<style lang="scss">
  @import "~normalize.css/normalize.css";

  html, body {
    display: block;
    width: 100%;
    height: 100%;
    font: {
      family: 'Exo 2', sans-serif;
      weight: 500;
    };
  }

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    * {
      box-sizing: border-box;
      outline: none;
    }
  }
</style>
