<template>
    <div id="app">
        <el-container>
            <el-main>
                <element-calc v-if="true"/>
                <calculating v-else/>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Calculating from '@/components/Calculating'
    import ElementCalc from '@/components/ElementCalc'

    export default {
        name: 'App',
        components: {
            ElementCalc,
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
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    * {
      box-sizing: border-box;
      outline: none;
    }
  }
</style>
