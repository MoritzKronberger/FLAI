<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import store from '../store'
import webcam from '../components/Webcam.vue'
import { Hands, Results } from '@mediapipe/hands'
import { Camera } from '@mediapipe/camera_utils'

const handposeReady = ref(false)
let hands: Hands
const handposeOptions = computed(() => store.handposedata.handposeOptions)

const emit = defineEmits(['newResult', 'statusChange', 'webcamReady'])
const onResults = (results: Results) => {
  handposeReady.value = true
  emit('statusChange', handposeReady.value as boolean)
  emit('newResult', results)
}

// setup from https://google.github.io/mediapipe/solutions/hands.html#javascript-solution-api
const loadMediapipeHands = (): void => {
  hands = new Hands({
    locateFile: (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    },
  })
  hands.setOptions(handposeOptions.value)
  hands.onResults(onResults)
}

onMounted(() => {
  emit('statusChange', handposeReady.value)
  loadMediapipeHands()
})

// setup from https://google.github.io/mediapipe/solutions/hands.html#javascript-solution-api
const startMediapipeCamera = async (
  webcamObject: HTMLVideoElement
): Promise<void> => {
  emit('webcamReady', webcamObject)
  const camera = new Camera(webcamObject, {
    onFrame: async () => {
      await hands.send({
        image: webcamObject,
      })
    },
  })

  await camera.start()
}
</script>

<template>
  <webcam @webcam-ready="startMediapipeCamera" />
</template>
