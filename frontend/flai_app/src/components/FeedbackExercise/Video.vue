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
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef } from 'vue'
import { Sign } from '../../store/signdata'
import VButton from './../vbutton.vue'

const props = defineProps<{ signs: Sign[] }>()

const perspective = ref('front')
const index = ref(0)

function getSource() {
  const rec = props.signs[index.value].recordings.find(
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
    index.value < props.signs.length - 1
      ? index.value + 1
      : props.signs.length - 1
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div:focus {
  outline: none;
}
h3 {
  margin: 40px 0 0;
}
video {
  width: 40%;
}
.controls {
  background: lightblue;
}
.waiting {
  color: grey;
}
.right {
  color: green;
}
.wrong {
  color: red;
}
</style>
