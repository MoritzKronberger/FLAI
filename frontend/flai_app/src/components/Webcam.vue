<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits(['webcamReady'])
const emitFeed = (webcamFeed: object): void => {
  emit('webcamReady', webcamFeed)
}

const webcamLoading = ref(true)
const webcamFeed = ref<HTMLVideoElement>()
const stream = ref<MediaStream>()
const constraints = {
  video: {
    facingMode: 'user',
  },
  audio: false,
}

const start = async (): Promise<void> => {
  stream.value = await navigator.mediaDevices.getUserMedia(constraints)
  // sometimes the video element seems to be undefined when this function is called,
  // but it's basically not reproducable and might be an issue with the vite hot reload, that won't exist in production
  if (!webcamFeed.value) throw new Error('Video reference is null')
  webcamFeed.value.srcObject = stream.value
}
onMounted(async () => {
  if (!navigator.mediaDevices) {
    window.alert(
      'Es steht keine Webcam zur Verfügung. Bitte schließen Sie ein Gerät an und versuchen Sie es erneut.'
    )
    throw new Error('Webcam is not available')
  } else {
    await start()
    emitFeed(webcamFeed)
    webcamLoading.value = false
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
