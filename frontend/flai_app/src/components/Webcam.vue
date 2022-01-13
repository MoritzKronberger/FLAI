<script setup lang="ts">
import { ref, onMounted } from 'vue'
import store from '../store'

const webcamLoading = ref(true)
const webcamFeed = ref<HTMLVideoElement>()
const emit = defineEmits(['webcamReady'])

const emitFeed = (): void => {
  emit('webcamReady', webcamFeed.value)
}

const startWebcam = () => {
  if (!webcamFeed.value) throw new Error('Video reference is null')
  console.log(webcamFeed.value)
  store.webcamdata.methods.setWebcamFeed(webcamFeed.value)
  console.log(webcamFeed.value)
  emitFeed()
  webcamLoading.value = false
}

// could be moved to FeedbackExercise
onMounted(async () => {
  try {
    await store.webcamdata.actions.startWebcam(startWebcam)
  } catch (error) {
    console.log(error)
    window.alert(
      'Es steht keine Webcam zur Verfügung. Bitte schließen Sie ein Gerät an und versuchen Sie es erneut.'
    )
  }
})
</script>

<template>
  <video id="webcam-feed" ref="webcamFeed" autoplay="true"></video>
  <div v-if="webcamLoading" class="webcam-loading">
    <!--TODO: replace text with icon-->
    <p>Webcam is loading ...</p>
  </div>
</template>

<style lang="css" scoped>
#webcam-feed {
  transform: rotateY(180deg);
}
</style>
