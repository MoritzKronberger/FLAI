<template>
  <h1>Feedback Learning Exercise</h1>
  <WatchWord v-if="stepOneWatch" :signs="signs" @next="onNextStep" />
  <ShowWord v-else :signs="signs" :exercise-id="exerciseId" />
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, inject, ComputedRef } from 'vue'
import { Sign } from '../../store/signdata'
import WatchWord from './WatchWord.vue'
import ShowWord from './ShowWord.vue'

const store: any = inject('store')
const signs: ComputedRef<Sign[]> = computed(
  () => store.exercisedata.exerciseSessions.at(-1).signs
)
const stepOneWatch = ref(true)
const exerciseId: ComputedRef<string> = computed(
  () => store.exercisedata.exercises.at(-1).id
)

onBeforeMount(() => {
  store.exercisedata.methods.startNewExerciseSession()
})

function onNextStep() {
  stepOneWatch.value = false
  console.log('nextStep')
}
</script>
