<script setup lang="ts">
import { provide, onMounted, ref } from 'vue'
import store from './store'

provide('store', store)

onMounted(store.exercisedata.methods.getExercises) // fake frontend method
onMounted(store.exercisedata.actions.getAllExercises) // real backend action
onMounted(store.sessiondata.methods.startTimer)
</script>

<template>
  <img id="logo" alt="flai logo" src="./assets/flai_logo.jpg" />
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/store">ShowStore</router-link>
    <router-link to="/components">TestComponents</router-link>
    <router-link to="/handpose">TestHandpose</router-link>
  </div>
  <main>
    <router-view />
  </main>
</template>

<style>
main {
  margin-left: 20%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
a {
  margin: 1%;
  text-decoration: none;
}
#nav {
  text-align: center;
}
#logo {
  margin: 1%;
  max-width: 15%;
  left: 0;
  top: 0;
  position: absolute;
}
</style>
