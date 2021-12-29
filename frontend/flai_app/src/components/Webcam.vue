<template>
  <video id="webcam-feed" ref="webcamFeed" autoplay="true"></video>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'WebCam',
  setup() {
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
      if (!webcamFeed.value) throw new Error('Video reference is null')
      webcamFeed.value.srcObject = stream.value
    }
    onMounted(() => {
      if (!navigator.mediaDevices) {
        window.alert(
          'Es steht keine Webcam zur Verfügung. Bitte schließen Sie ein Gerät an und versuchen Sie es erneut.'
        )
        throw new Error('Webcam is not available')
      } else {
        start()
      }
    })
    return {
      webcamFeed,
    }
  },
})
</script>

<style lang="css" scoped>
#webcam-feed {
  transform: rotateY(180deg);
}
</style>
