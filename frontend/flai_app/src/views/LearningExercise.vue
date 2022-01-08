<template>
  <h1>Feedback Learning Exercise</h1>
  <!-- hiding must be done via css and not v-if so that components still render -->
  <div :class="flaiNetReady && handposeReady ? '' : 'hidden'">
    <FeedbackExercise :key="signIds" />
    <flai-net
      @status-change="setflaiNetReady"
      @handpose-ready="setHandposeReady"
      @webcam-ready="setWebcamFeed"
    />
  </div>
  <!-- TODO: replace text with or add loading icon/ animation -->
  <div :class="flaiNetReady && handposeReady ? 'hidden' : ''">
    {{ !flaiNetReady ? 'FLAI_Net loading...' : 'Handpose loading...' }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import FeedbackExercise from '../components/FeedbackExercise/FeedbackExercise.vue'
import FlaiNet from '../components/FlaiNet.vue'
import store from '../store'

const session = computed(() => store.exercisedata.activeExerciseSession)
const signIds = computed(() => {
  return store.exercisedata.word.signs.join()
})

const exerciseId = computed(() => store.exercisedata.exercises[0].id)

const camera = ref<HTMLVideoElement>()

const setWebcamFeed = (webcamObject: HTMLVideoElement) => {
  camera.value = webcamObject
}

onBeforeRouteLeave(async () => {
  // TODO: Remove stopping the MediaStream?
  // This properly stops the webcam MediaStream and removes it from the video object,
  // however the 'webcam-active'-status does not seem to get re-evaluated without a page refresh
  const webcam = camera.value
  if (webcam) {
    const stream = webcam.srcObject as MediaStream
    stream.getTracks().forEach((track) => {
      track.stop()
    })
    console.log(stream)
    webcam.srcObject = null
  }
  console.log(camera.value)

  await store.exercisedata.actions.patchExerciseSession(
    exerciseId.value,
    session.value,
    store.sessiondata.methods.updateTimer()
  )
})

//FLAI-NET
const flaiNetReady = ref(false)
const handposeReady = ref(false)

const setflaiNetReady = (result: boolean): void => {
  flaiNetReady.value = result
}
const setHandposeReady = (result: boolean): void => {
  handposeReady.value = result
}
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
