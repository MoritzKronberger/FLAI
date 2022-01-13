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
          <flai-net
            @status-change="setflaiNetReady"
            @handpose-ready="setHandposeReady"
          />
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
import { computed, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import FeedbackExercise from '../components/FeedbackExercise/FeedbackExercise.vue'
import FlaiNet from '../components/FlaiNet.vue'
import CustomButton from '../components/CustomButton.vue'
import store from '../store'

const router = useRouter()

const session = computed(() => store.exercisedata.activeExerciseSession)
const signIds = computed(() => {
  return store.exercisedata.word.signs.join()
})

const exerciseId = computed(() => store.exercisedata.exercises[0].id)
const currentlyWatchWord = ref(true)
const feedbackClass = ref('waiting')
const hidden = ref(true)

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

//FLAI-NET
const flaiNetReady = ref(false)
const handposeReady = ref(false)

const setflaiNetReady = (result: boolean): void => {
  flaiNetReady.value = result
}
const setHandposeReady = (result: boolean): void => {
  handposeReady.value = result
}
</script>

<style lang="scss">
@import '../assets/scss/main.scss';
</style>
