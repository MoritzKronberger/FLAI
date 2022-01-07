<template>
  <FeedbackExercise />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import FeedbackExercise from '../components/FeedbackExercise/FeedbackExercise.vue'
import store from '../store'

const session = computed(() => store.exercisedata.activeExerciseSession)

const exerciseId = computed(() => store.exercisedata.exercises[0].id)

onBeforeRouteLeave(async () => {
  await store.exercisedata.actions.patchExerciseSession(
    exerciseId.value,
    session.value,
    store.sessiondata.methods.updateTimer()
  )
})
</script>
