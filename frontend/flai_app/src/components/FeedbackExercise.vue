<template>
  <h1>Feedback Learning Exercise</h1>
  word: {{ word }}
  <span v-for="letter in word" :key="letter.name">{{ letter.name }}</span>
  <video src="source" type="video/webm" />
  <p>TODO: Add webcam component</p>
</template>

<script setup lang="ts">
import { inject, reactive, computed, onBeforeMount, ComputedRef } from 'vue'
import { Sign } from '../store/signdata'

const store: any = inject('store')
const word: ComputedRef<Sign[]> = computed(
  () => store.exercisedata.exercises.at(-1).signs
)
onBeforeMount(() => {
  store.exercisedata.methods.startNewExercise('name', 'desc')
  console.log('word', JSON.stringify(word))
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
