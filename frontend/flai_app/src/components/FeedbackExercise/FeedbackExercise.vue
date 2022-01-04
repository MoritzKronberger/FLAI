<template>
  <h1>Feedback Learning Exercise</h1>
  <WatchWord
    v-if="stepOneWatch && newSigns.length > 0"
    :signs="newSigns"
    @next="onNextStep"
  />
  <ShowWord v-else :signs="signs" :exercise-id="exerciseId" />
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, inject, ComputedRef } from 'vue'
import { Sign } from '../../store/signdata'
import WatchWord from './WatchWord.vue'
import ShowWord from './ShowWord.vue'
import { ExerciseSession } from '../../store/exercisedata'

const store: any = inject('store')
const signs: ComputedRef<Sign[]> = computed(
  () => store.exercisedata.exerciseSessions.at(-1).signs
)
const newSigns: Sign[] = []
const stepOneWatch = ref(true)
const exerciseId: ComputedRef<string> = computed(
  () => store.exercisedata.exercises[0].id
)

function getNewSigns(signs: Sign[]) {
  for (const sign of signs) {
    if (sign.intro_done === false) {
      newSigns.push(sign)
    }
  }
  console.log('new', newSigns)
}

onBeforeMount(async () => {
  await store.exercisedata.actions.postNewExerciseSession(exerciseId.value)
  getNewSigns(signs.value)
})

function onNextStep() {
  stepOneWatch.value = false
  console.log('nextStep')
}
</script>
