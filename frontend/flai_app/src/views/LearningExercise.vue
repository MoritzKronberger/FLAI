<template>
  <div class="learning-exercise">
    <FeedbackExercise
      v-if="started"
      :key="signIds"
      @watch-word="currentlyWatchWord = true"
      @show-word="currentlyWatchWord = false"
    />
    <div v-else class="loading-screen exercise-grid">
      <exercise-header header-text="Lektion - Buchstabieren" />
      <div class="loading-screen-wrapper">
        <div class="loading-screen-container">
          <p class="body-large">
            Lerne das Alphabet der deutschen Gebärdensprache mithilfe unserer
            Zwei-Phasen-Lernmethodik:
          </p>
          <br />
          <ol class="body-large">
            <li>Phase: Einprägen</li>
            <li>Phase: Üben</li>
          </ol>
          <p class="body-emphasised camera-notif">
            Ab hier benötigst du deine Kamera.
          </p>
          <CustomButton
            v-if="flaiNetReady && handposeReady"
            label="Start"
            btnclass="start prim_medium_button_blue"
            @button-click="started = true"
          />
          <div v-else class="loading">
            <div class="loading-status body-medium">
              {{
                !webcamReady
                  ? 'Warte auf Webcam'
                  : !flaiNetReady
                  ? `Lade FLAI-KI ${flaiNetLoadingProgress * 100}%`
                  : 'Starte KI-Feedback'
              }}
            </div>
            <div class="loading-circle" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import FeedbackExercise from '../components/FeedbackExercise/FeedbackExercise.vue'
import CustomButton from '../components/CustomButton.vue'
import ExerciseHeader from '../components/ExerciseHeader.vue'
import store from '../store'
import { Results } from '@mediapipe/hands'

const session = computed(() => store.exercisedata.activeExerciseSession)
const signIds = computed(() => {
  return store.exercisedata.word.signs.join()
})

const exerciseId = computed(() => store.exercisedata.exercises[0].id)
const currentlyWatchWord = ref(true)

const started = ref(false)

const webcamFeed = computed(() => store.webcamdata.webcam.webcamFeed)
//FLAI-NET
const flaiNetOptions = computed(() => store.flainetdata.flaiNetOptions)
const flaiNetReady = ref(false)
const handposeReady = ref(false)
const webcamReady = ref(false)
const flaiNetLoadingProgress = ref(0)

const setflaiNetReady = (): void => {
  flaiNetReady.value = true
}

onBeforeRouteLeave(async () => {
  console.log('stopSession')
  await store.exercisedata.actions.patchExerciseSession(
    exerciseId.value,
    session.value
  )
})

// TODO: move functions below to FeedbackExercise component?

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
  store.webcamdata.methods.setWebcamFeed(document.createElement('video'))
  webcamReady.value = true
  await store.flainetdata.actions.loadFlaiNet(
    setflaiNetReady,
    (p) => (flaiNetLoadingProgress.value = p)
  )
  store.handposedata.methods.loadMediapipeHands(onResults)
  if (webcamFeed.value)
    store.handposedata.methods.startMediapipeCamera(webcamFeed.value)
}

onMounted(async () => {
  try {
    await store.webcamdata.actions.startWebcam(webcamStarted)
  } catch (error) {
    console.log(error)
    window.alert(
      'Es steht keine Webcam zur Verfügung. Bitte schließe ein Gerät an und versuche es erneut.'
    )
  }
})
</script>

<style lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/components/video.scss';
</style>
