<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import store from '../store'

const webcamFeed = computed(() => store.webcamdata.webcam.webcamFeed)
const webcamContainer = ref<HTMLDivElement>()

// TODO: Less hacky way to implement this?
watch(webcamFeed, () => {
  if (webcamFeed.value) {
    webcamFeed.value.autoplay = true
    webcamFeed.value.id = 'webcam-feed'
    webcamContainer.value?.appendChild(webcamFeed.value)
  }
})
</script>

<template>
  <div ref="webcamContainer" class="webcam-container"></div>
</template>

<style lang="css">
#webcam-feed {
  transform: rotateY(180deg);
}
</style>
