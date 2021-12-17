<script setup lang="ts">
import { ref, inject, computed } from 'vue'
const store: any = inject('store')

const email = ref('')
const username = ref('')
const righthanded = ref(true)
const targetLearningTime = ref(10)

const user = computed(() => store.userdata.user)

function changeEmail() {
  store.userdata.methods.changeEmail(email.value)
}
function changeUsername() {
  store.userdata.methods.changeUsername(username.value)
}
function changeRightHanded() {
  store.userdata.methods.changeRightHanded(righthanded.value)
}
function changeTargetLearningTime() {
  store.userdata.methods.changeTargetLearningTime(targetLearningTime.value)
}
</script>

<template>
  <h2>Userdata</h2>
  <p v-for="(value, name) in user" :key="value">{{ name }}: {{ value }}</p>
  <label>Change Email:</label
  ><input v-model="email" type="text" @keyup.enter="changeEmail()" />
  <label>Change Username:</label
  ><input v-model="username" type="text" @keyup.enter="changeUsername" />
  <label>Change righthanded:</label
  ><input v-model="righthanded" type="checkbox" /><Button
    @click="changeRightHanded"
    >Submit</Button
  >
  <label>Change targetLearningTime:</label
  ><input
    v-model="targetLearningTime"
    type="text"
    @keyup.enter="changeTargetLearningTime"
  />
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
