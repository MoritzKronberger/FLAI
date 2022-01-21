<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import store from '../store'

const webcamFeed = computed(() => store.webcamdata.webcam.webcamFeed)
const webcamContainer = ref<HTMLDivElement>()

const initWebcam = () => {
  if (webcamFeed.value) {
    webcamFeed.value.autoplay = true
    webcamFeed.value.id = 'webcam-feed'
    webcamContainer.value?.appendChild(webcamFeed.value)
  }
}

onMounted(() => initWebcam())

// only nedded in case the webcamFeed changes after mounting the component
watch(webcamFeed, () => initWebcam())
</script>

<template>
  <div ref="webcamContainer" class="webcam-container"></div>
</template>

<style lang="css">
#webcam-feed {
  transform: rotateY(180deg);
}
</style>
