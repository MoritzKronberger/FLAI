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
    <div>
      <flai-net
        @status-change="setflaiNetReady"
        @handpose-started="handposeStarted"
      />
    </div>
  </div>
  <div v-else>
    //TODO: Add loading animation
    <p>Loading</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, ComputedRef } from 'vue'
import { Sign } from '../../store/signdata'
import WatchWord from './WatchWord.vue'
import ShowWord from './ShowWord.vue'
import flaiNet from '../../components/FlaiNet.vue'
import store from '../../store'
import { Camera } from '@mediapipe/camera_utils'

const emit = defineEmits(['handposeStarted'])

const allSigns: ComputedRef<Sign[]> = computed(() => store.signdata.signs)

const word: ComputedRef<string[]> = computed(
  () => store.exercisedata.word.signs
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

const handposeStarted = (handposeCamera: Camera) => {
  emit('handposeStarted', handposeCamera)
}

onBeforeMount(() => {
  store.sessiondata.methods.startTimer()
  startSession.value = 'true'
  getNewSigns()
})

//FLAI-NET
const flaiNetReady = ref(false)

const setflaiNetReady = (result: boolean): void => {
  flaiNetReady.value = result
}
</script>
