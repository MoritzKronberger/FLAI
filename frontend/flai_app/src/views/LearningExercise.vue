<template>
  <div class="learning-exercise">
    <CustomButton
      label="x"
      btnclass="exit"
      @click="router.push({ name: 'HomePage' })"
    />
    <h1>Feedback Learning Exercise</h1>
    <div class="exercise-card">
      <!-- hiding must be done via css and not v-if so that components still render -->
      <div
        :class="[
          hidden ? 'hidden' : '',
          currentlyWatchWord ? 'watch-word' : 'show-word',
        ]"
      >
        <div class="column1">
          <FeedbackExercise
            :key="signIds"
            @watch-word="watchWord()"
            @show-word="showWord()"
            @correct="feedbackClass = 'correct'"
            @wrong="feedbackClass = 'wrong'"
          />
        </div>

        <div class="column2" :class="feedbackClass">
          <webcam />
        </div>
        <!-- TODO: replace text with or add loading icon/ animation -->
      </div>
      <div :class="[hidden ? '' : 'hidden', 'loading-screen']">
        <p>
          Lerne neue Buchstaben in deutscher Gebärdensprache kennen und übe Sie!
        </p>
        <CustomButton
          v-if="flaiNetReady && handposeReady"
          label="Start"
          btnclass="start"
          @button-click="hidden = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import FeedbackExercise from '../components/FeedbackExercise/FeedbackExercise.vue'
import webcam from '../components/Webcam.vue'
import CustomButton from '../components/CustomButton.vue'
import store from '../store'
import { Results } from '@mediapipe/hands'

const router = useRouter()

const session = computed(() => store.exercisedata.activeExerciseSession)
const signIds = computed(() => {
  return store.exercisedata.word.signs.join()
})

const exerciseId = computed(() => store.exercisedata.exercises[0].id)
const currentlyWatchWord = ref(true)
const feedbackClass = ref('waiting')
const hidden = ref(true)

const webcamFeed = computed(() => store.webcamdata.webcam.webcamFeed)
//FLAI-NET
const flaiNetOptions = computed(() => store.flainetdata.flaiNetOptions)
const flaiNetReady = ref(false)
const handposeReady = ref(false)
const webcamReady = ref(false)

const setflaiNetReady = (): void => {
  flaiNetReady.value = true
}

function watchWord() {
  console.log('watchWord')
  currentlyWatchWord.value = true
}

function showWord() {
  console.log('showWord')
  currentlyWatchWord.value = false
}

onBeforeRouteLeave(async () => {
  console.log('stopSession')
  await store.exercisedata.actions.patchExerciseSession(
    exerciseId.value,
    session.value
  )
})

function onResults(handposeResults: Results) {
  handposeReady.value = true
  if (store.flainetdata.methods.getFlaiNet().model) {
    const flaiNetResults =
      store.flainetdata.methods.flaiNetPredict(handposeResults)
    if (flaiNetOptions.value.bufferedResult) {
      store.flainetdata.methods.resultBufferUpdate(flaiNetResults)
    }
  }
}

async function webcamStarted() {
  store.handposedata.methods.loadMediapipeHands(onResults)
  await store.flainetdata.actions.loadFlaiNet(setflaiNetReady)
  store.webcamdata.methods.setWebcamFeed(document.createElement('video'))
  if (webcamFeed.value) {
    store.handposedata.methods.startMediapipeCamera(webcamFeed.value)
    webcamReady.value = true
  }
}

onMounted(async () => {
  try {
    await store.webcamdata.actions.startWebcam(webcamStarted)
  } catch (error) {
    console.log(error)
    window.alert(
      'Es steht keine Webcam zur Verfügung. Bitte schließen Sie ein Gerät an und versuchen Sie es erneut.'
    )
  }
})
</script>

<style lang="scss">
@import '../assets/scss/main.scss';
</style>
