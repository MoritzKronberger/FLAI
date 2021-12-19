<script setup lang="ts">
import { provide, onMounted } from 'vue'
import store from './store'

provide('store', store)

onMounted(store.signdata.methods.createNewSigns)
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/store">ShowStore</router-link>
  </div>
  <router-view />
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
