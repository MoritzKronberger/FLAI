<template>
  <div class="learning-exercise">
    <!-- hiding must be done via css and not v-if so that components still render -->
    <h2 :class="[hidden ? '' : 'hidden', 'heading-large']">Übung</h2>
    <FeedbackExercise
      :key="signIds"
      :started="hidden ? false : true"
      :class="[hidden ? 'hidden' : '']"
      @watch-word="currentlyWatchWord = true"
      @show-word="currentlyWatchWord = false"
    />
    <div :class="[hidden ? '' : 'hidden', 'loading-screen']">
      <p class="body-large">
        Lerne neue Buchstaben der deutschen Gebärdensprache mithilfe unserer 2
        Phasen Lernmethodik.
      </p>
      <br />
      <ol class="body-large">
        <li>Phase: Einprägen</li>
        <li>Phase: Üben</li>
      </ol>
      <p class="body-medium">Ab hier verwenden wir deine Kamera.</p>
      <CustomButton
        v-if="flaiNetReady && handposeReady"
        label="Start"
        btnclass="start prim_small_button_blue"
        @button-click="hidden = false"
      />
      <div v-else>
        <div class="loading-status">
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
      <CustomButton
        label="Home"
        btnclass="exit sec_small_button_blue"
        @click="router.push({ name: 'HomePage' })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import FeedbackExercise from '../components/FeedbackExercise/FeedbackExercise.vue'
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

const hidden = ref(true)

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
      'Es steht keine Webcam zur Verfügung. Bitte schließen Sie ein Gerät an und versuchen Sie es erneut.'
    )
  }
})
</script>

<style lang="scss">
@import '../assets/scss/main.scss';
</style>
