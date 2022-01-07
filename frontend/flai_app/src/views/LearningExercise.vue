<template>
  <FeedbackExercise @handpose-started="setHandposeObjects" />
</template>

<script setup lang="ts">
import { Camera } from '@mediapipe/camera_utils'
import { computed, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import FeedbackExercise from '../components/FeedbackExercise/FeedbackExercise.vue'
import store from '../store'

const session = computed(() => store.exercisedata.activeExerciseSession)

const exerciseId = computed(() => store.exercisedata.exercises[0].id)

const camera = ref<Camera>()

const setHandposeObjects = (handposeCamera: Camera) => {
  camera.value = handposeCamera
}

onBeforeRouteLeave(async () => {
  if (camera.value) await camera.value.stop()
  await store.exercisedata.actions.patchExerciseSession(
    exerciseId.value,
    session.value,
    store.sessiondata.methods.updateTimer()
  )
})
</script>
