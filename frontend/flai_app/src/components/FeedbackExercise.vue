<template>
  <h1>Feedback Learning Exercise</h1>
  {{ word }}
  <!--span v-for="letter in word" :key="letter.name">{{ letter.name }}</span-->
  <video src="source" type="video/webm" />
  <p>TODO: Add webcam component</p>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted } from 'vue'

export default defineComponent({
  name: 'FeedbackExercise',
  setup() {
    const store: any = inject('store')
    onMounted(store.exercisedata.methods.startNewExercise('name', 'desc'))
    const exercises = store.exercisedata.exercises
    const word = exercises[exercises.length - 1].signs
    console.log('word', word)

    return { word }
  },
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
