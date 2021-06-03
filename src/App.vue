<template>
    <div id="app">
        <element-calc/>
    </div>
</template>

<script>
    import ElementCalc from '@/components/ElementCalc'

    export default {
        name: 'App',
        components: {
            ElementCalc,
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

        * {
            box-sizing: border-box;
            outline: none;
        }
    }

    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2c3e50;
        width: 100%;
        min-height: 100%;
        padding: 16px 0;
    }
</style>
