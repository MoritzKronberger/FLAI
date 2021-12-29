<template>
  <h1>Feedback Learning Exercise</h1>
  <p>
    word:
    <span v-for="letter in signs" :key="letter.name">{{ letter.name }}</span>
  </p>
  <video :src="videoSource" type="video/webm" autoplay loop />
  <Vbutton
    label="Switch Perspective"
    btnclass="controls"
    @click="switchPerspective()"
  />
  <p>TODO: Add webcam component</p>
</template>

<script setup lang="ts">
import { inject, ref, computed, onBeforeMount, ComputedRef } from 'vue'
import { Sign } from '../store/signdata'

const store: any = inject('store')
const signs: ComputedRef<Sign[]> = computed(
  () => store.exercisedata.exercises.at(-1).signs
)
const index = ref(0)
const perspective = ref('front')

function getSource() {
  const rec = signs.value[0].recordings.find(
    (el) => el.perspectiveId === perspective.value
  )
  console.log('el', JSON.stringify(rec))
  if (rec === undefined) {
    return 'src/assets/error.webm'
  }
  return rec.video
}
const videoSource: ComputedRef<string> = computed(() => getSource())

onBeforeMount(() => {
  store.exercisedata.methods.startNewExercise('name', 'desc')
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
video {
  width: 40%;
}
.controls {
  background: lightblue;
}
</style>
