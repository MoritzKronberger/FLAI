<template>
  <div v-if="word !== undefined && word.length > 0" :key="startSession">
    <h1>Feedback Learning Exercise</h1>
    <WatchWord
      v-if="stepOneWatch && newSigns.length > 0"
      :signs="newSigns"
      :exercise-id="exerciseId"
      @next="onNextStep"
    />
    <ShowWord v-else :signs="signsFromWord" :exercise-id="exerciseId" />
  </div>
  <div v-else>
    //TODO: Add loading animation
    <p>Loading</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, ComputedRef } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import store from '../../store/index'
import { Sign } from '../../store/signdata'
import { ExerciseSession } from '../../store/exercisedata'
import WatchWord from './WatchWord.vue'
import ShowWord from './ShowWord.vue'

const allSigns: ComputedRef<Sign[]> = computed(() => store.signdata.signs)
const session: ComputedRef<ExerciseSession> = computed(
  () => store.exercisedata.activeExerciseSession
)
const word: ComputedRef<string[]> = computed(
  () => store.exercisedata.activeExerciseSession.signs
)
const signsFromWord: ComputedRef<Sign[]> = computed(() => {
  const wordArray: Sign[] = []
  for (const signId of word.value) {
    const sign = allSigns.value?.find((el) => el.id === signId)
    if (sign) wordArray.push(sign)
  }
  return wordArray
})
const startSession = ref('false') // forces the div to rerender via the key: must be string/number
const newSigns: Sign[] = []
const stepOneWatch = ref(true)
const exerciseId: ComputedRef<string> = computed(
  () => store.exercisedata.exercises[0].id
)

function getNewSigns() {
  newSigns.length = 0
  for (const signId of word.value) {
    const sign = allSigns.value?.find((el) => el.id === signId)
    if (sign?.intro_done === false) {
      newSigns.push(sign)
    }
  }
  console.log('newSigns', JSON.stringify(newSigns))
}

function onNextStep() {
  stepOneWatch.value = false
  console.log('nextStep')
}

onBeforeMount(() => {
  store.sessiondata.methods.startTimer()
  startSession.value = 'true'
  getNewSigns()
})

onBeforeRouteLeave(async () => {
  await store.exercisedata.actions.patchExerciseSession(
    exerciseId.value,
    session.value,
    store.sessiondata.methods.updateTimer()
  )
})
</script>
