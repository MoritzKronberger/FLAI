<script setup lang="ts">
import { provide, onMounted } from 'vue'
import store from './store'

provide('store', store)

onMounted(store.signdata.methods.createNewSigns)
onMounted(store.exercisedata.actions.getAllExercises)
onMounted(store.sessiondata.methods.startTimer)

function handleInput(e: Event) {
  const target = <HTMLInputElement>e.target

  console.log('Das ist der Input:', target.value)
}
</script>

<template>
  <img id="logo" alt="flai logo" src="./assets/flai_logo.jpg" />
  <div id="nav">
    <router-link :to="{ name: 'HomePage' }">Home</router-link>
    <router-link :to="{ name: 'ShowStore' }">ShowStore</router-link>
    <router-link :to="{ name: 'LearningExercise' }">Exercise</router-link>
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
