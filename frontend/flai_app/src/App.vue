<script setup lang="ts">
import { provide, onMounted, ref } from 'vue'
import store from './store'
import textInputField from './components/TextInputField.vue'

provide('store', store)

onMounted(store.signdata.methods.createNewSigns)
onMounted(store.exercisedata.actions.getAllExercises)
onMounted(store.sessiondata.methods.startTimer)

const testInput = ref('')
</script>

<template>
  <img id="logo" alt="flai logo" src="./assets/flai_logo.jpg" />
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/store">ShowStore</router-link>
    <text-input-field
      v-model="testInput"
      label-name="Test Input"
      placeholder="your test input"
    />
  </div>
  <div>Test Input is: {{ testInput }}</div>
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
