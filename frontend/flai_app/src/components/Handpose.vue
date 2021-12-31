<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import webcam from '../components/Webcam.vue'
import { Hands, Results } from '@mediapipe/hands'
import { Camera } from '@mediapipe/camera_utils'

const handposeReady = ref(false)
let hands: Hands

const emit = defineEmits(['newResult', 'statusChange'])
const onResults = (results: Results) => {
  handposeReady.value = true
  emit('statusChange', handposeReady.value as boolean)
  emit('newResult', results)
}

// setup from https://google.github.io/mediapipe/solutions/hands.html#javascript-solution-api
const loadMediapipeHands = (): void => {
  hands = new Hands({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    },
  })
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.8,
  })
  hands.onResults(onResults)
}

onMounted(() => {
  emit('statusChange', handposeReady.value)
  loadMediapipeHands()
})

// setup from https://google.github.io/mediapipe/solutions/hands.html#javascript-solution-api
const startMediapipeCamera = (webcamFeed: Ref<HTMLVideoElement>): void => {
  const camera = new Camera(webcamFeed.value as HTMLVideoElement, {
    onFrame: async () => {
      await hands.send({ image: webcamFeed.value as HTMLVideoElement })
    },
  })

  camera.start()
}
</script>

<template>
  <webcam @webcam-ready="startMediapipeCamera" />
</template>
