<template>
  <h1>Feedback Learning Exercise</h1>
  <VButton label="zurück" btnclass="controls" @click="decreaseIndex" />
  <span>{{ signs[index].name.toUpperCase() }}</span>
  <VButton label="weiter" btnclass="controls" @click="increaseIndex" />
  <br />
  <video :src="videoSource" type="video/webm" autoplay loop />
  <br />
  <VButton
    label="Perspektive wechseln"
    btnclass="controls"
    @click="switchPerspective()"
  />
  <p>TODO: Add webcam component</p>
</template>

<script setup lang="ts">
import { inject, ref, computed, onBeforeMount, ComputedRef } from 'vue'
import { Sign } from '../store/signdata'
import VButton from './vbutton.vue'

const store: any = inject('store')
const signs: ComputedRef<Sign[]> = computed(
  () => store.exercisedata.exercises.at(-1).signs
)

const perspective = ref('front')
const index = ref(0)

function getSource() {
  const rec = signs.value[index.value].recordings.find(
    (el) => el.perspectiveId === perspective.value
  )
  console.log('el', JSON.stringify(rec))
  if (rec === undefined) {
    return 'src/assets/error.webm'
  }
  return rec.video
}
const videoSource: ComputedRef<string> = computed(() => getSource())

function decreaseIndex() {
  index.value = index.value > 1 ? index.value - 1 : 0
  getSource()
  console.log(index.value)
}
function increaseIndex() {
  index.value =
    index.value < signs.value.length - 1
      ? index.value + 1
      : signs.value.length - 1
  getSource()
  console.log(index.value)
}
function switchPerspective() {
  if (perspective.value === 'front') {
    perspective.value = 'side'
  } else {
    perspective.value = 'front'
  }
}

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
