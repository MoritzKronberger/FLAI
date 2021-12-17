<script setup lang="ts">
import { provide } from 'vue'
import store from './store'
import HelloWorld from './components/HelloWorld.vue'
import ShowStore from './components/ShowStore.vue'

provide('store', store)
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hallo, wir sind FLAI!" />
  <ShowStore />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
