<template>
  <video :src="videoSource" type="video/webm" autoplay loop />
  <br />
  <VButton
    label="Perspektive wechseln"
    btnclass="controls"
    @click="switchPerspective()"
  />
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, watchEffect } from 'vue'
import { Sign } from '../../store/signdata'
import VButton from './../vbutton.vue'

const props = defineProps<{ signs: Sign[]; index: number }>()

const perspective = ref('front')

function getSource() {
  const rec = props.signs[props.index].recordings.find(
    (el) => el.perspectiveId === perspective.value
  )
  console.log('el', JSON.stringify(rec))
  if (rec === undefined) {
    return 'src/assets/error.webm'
  }
  return rec.video
}
const videoSource: ComputedRef<string> = computed(() => getSource())
watchEffect(() => console.log('newIndex', props.index))

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
