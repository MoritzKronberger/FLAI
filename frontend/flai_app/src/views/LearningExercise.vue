<template>
  <FeedbackExercise :key="signIds" @new-word="reload" />
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import FeedbackExercise from '../components/FeedbackExercise/FeedbackExercise.vue'
import store from '../store'

const router = useRouter()

const session = computed(() => store.exercisedata.activeExerciseSession)
const signIds = computed(() => {
  return store.exercisedata.word.signs.join()
})

const exerciseId = computed(() => store.exercisedata.exercises[0].id)

function reload() {
  store.exercisedata.methods.changeWord(store.signdata.methods.generateWord())
  router.push({
    name: 'LearningExercise',
  })
}

onBeforeRouteLeave(async () => {
  await store.exercisedata.actions.patchExerciseSession(
    exerciseId.value,
    session.value,
    store.sessiondata.methods.updateTimer()
  )
})
</script>
