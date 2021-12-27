<template>
  <div id="webcam-container">
    <video id="webcam-feed" ref="webcamFeed" autoplay="true"></video>
  </div>
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
        width: 500,
        height: 500,
      },
      audio: false,
    }
    const start = async (): Promise<void> => {
      stream.value = await navigator.mediaDevices.getUserMedia(constraints)
      if (!webcamFeed.value) throw new Error('Video ref is null')
      webcamFeed.value.srcObject = stream.value
    }
    onMounted(() => {
      start()
    })
    return {
      start,
      webcamFeed,
      stream,
    }
  },
})
</script>

<style lang="css" scoped>
#webcam-container {
  position: relative;
  width: 100%;
  height: 100%;
}

#webcam-feed {
  transform: rotateY(180deg);
}
</style>
