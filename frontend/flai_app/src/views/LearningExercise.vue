<template>
  <h1>Feedback Learning Exercise</h1>
  <!-- hiding must be done via css and not v-if so that components still render -->
  <div :class="flaiNetReady && handposeReady ? '' : 'hidden'">
    <FeedbackExercise :key="signIds" />
    <flai-net
      @status-change="setflaiNetReady"
      @handpose-ready="setHandposeReady"
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

onBeforeRouteLeave(async () => {
  console.log('stopSession')
  await store.exercisedata.actions.patchExerciseSession(
    exerciseId.value,
    session.value
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
