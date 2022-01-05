<template>
  <div v-if="signs !== undefined && signs.length > 0" :key="startSession">
    <h1>Feedback Learning Exercise</h1>
    <WatchWord
      v-if="stepOneWatch && newSigns.length > 0"
      :signs="newSigns"
      :exercise-id="exerciseId"
      @next="onNextStep"
    />
    <ShowWord v-else :signs="signs" :exercise-id="exerciseId" />
  </div>
  <div v-else>
    //TODO: Add loading animation
    <p>Loading</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, inject, ComputedRef } from 'vue'
import { Sign } from '../../store/signdata'
import WatchWord from './WatchWord.vue'
import ShowWord from './ShowWord.vue'
import { ExerciseSession } from '../../store/exercisedata'

const store: any = inject('store')
const signs: ComputedRef<Sign[] | undefined> = computed(
  () => store.exercisedata.exerciseSessions.at(-1).signs
)
const startSession = ref('false') // forces the div to rerender via the key: must be string/number
const newSigns: Sign[] = []
const stepOneWatch = ref(true)
const exerciseId: ComputedRef<string> = computed(
  () => store.exercisedata.exercises[0].id
)

function getNewSigns(signs: Sign[]) {
  newSigns.length = 0
  for (const sign of signs) {
    if (sign.intro_done === false) {
      newSigns.push(sign)
    }
  }
  console.log('newSigns', JSON.stringify(newSigns))
}

onBeforeMount(async () => {
  console.log(
    'conditions',
    stepOneWatch.value,
    newSigns.length,
    stepOneWatch.value && newSigns.length > 0,
    'key',
    signs.value?.length
  )
  await store.exercisedata.actions.postNewExerciseSession(exerciseId.value)
  startSession.value = 'true'
  console.log('signs', JSON.stringify(signs))
  if (signs.value?.length ?? 0 > 0) if (signs.value) getNewSigns(signs.value)
  console.log(
    'conditions',
    stepOneWatch.value,
    newSigns.length,
    stepOneWatch.value && newSigns.length > 0,
    'key',
    signs.value?.length
  )
})

function onNextStep() {
  stepOneWatch.value = false
  console.log('nextStep')
}
</script>
