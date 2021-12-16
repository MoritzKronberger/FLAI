<script setup lang="ts">
import { provide } from 'vue'
import store from './store'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'

provide('store', store)

store.sessiondata.methods.startTimer()
store.signdata.methods.createNewSigns()

store.exercisedata.methods.startNewExercise('Test', 'This is a test')
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hallo, wir sind FLAI!" />
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
