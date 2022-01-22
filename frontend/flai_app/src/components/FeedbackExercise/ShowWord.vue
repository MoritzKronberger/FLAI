<template>
  <div class="content" vFocus tabindex="0" @keydown.c="correct">
    <div vFocus tabindex="0" @keydown.w="wrong">
      <p class="instruction">
        Zeige die Gebärde des jeweiligen Buchstabens in die Kamera
      </p>
      <SignsWithIcons :signs="signs" :index="index" :path="pathToIcon" />
      <Video
        id="video"
        :show-sign="showSign"
        :signs="signs"
        :index="index"
        @use-hint="showSign = true"
      />
      <Button
        v-if="wordComplete"
        id="next"
        label="weiter"
        btnclass="controls"
        @button-click="emit('new-word')"
      />
      <p>{{ status }}</p>
      <div class="column2">
        <webcam :borderclass="feedbackClass" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, onBeforeMount, watchEffect } from 'vue'
import { Progress } from '../../store/exercisedata'
import { Sign } from '../../store/signdata'
import Video from './Video.vue'
import store from '../../store'
import Button from '../CustomButton.vue'
import { getFlaiNetResults } from '../../ressources/ts/flaiNetCheck'
import { FlaiNetResults } from '../../store/flainetdata'
import { FeedbackStatus } from '../../ressources/ts/interfaces'
import SignsWithIcons from './SignsWithIcons.vue'
import Webcam from '../Webcam.vue'

const inputAccepted = ref(true)
const index = ref(0)

const pathToIcon = ref<string[]>([])

const feedbackClass = ref('waiting')
const progressSmallerLevelTwo = ref(true)
const progressSmallerLevelThree = ref(true)
const showSign = ref(true)
const wordComplete = ref(false)

const progressStep: ComputedRef<Progress> = computed(
  () => store.exercisedata.progressStep
)

const resultBuffer = computed(() => store.flainetdata.resultBuffer.results)
const newInputTimeout = computed(
  () => store.flainetdata.flaiNetOptions.newInputTimeout
)
const status = ref<FeedbackStatus>(FeedbackStatus.Paused)

const props = defineProps<{ signs: Sign[]; exerciseId: string }>()
const emit = defineEmits([
  'new-word',
  'correct',
  'wrong',
  'waiting',
  'rendered',
])

function checkProgress(sign: Sign) {
  if (sign.progress >= store.exercisedata.exerciseSettings.level_1) {
    progressSmallerLevelTwo.value = true
    progressSmallerLevelThree.value = true
    showSign.value = false
    if (sign.progress >= store.exercisedata.exerciseSettings.level_2) {
      progressSmallerLevelTwo.value = false
      if (sign.progress >= store.exercisedata.exerciseSettings.level_3) {
        progressSmallerLevelThree.value = false
        if (!sign.level_3_reached) {
          store.exercisedata.methods.increaseUnlockedSigns()
        }
      }
    }
  } else {
    showSign.value = true
  }
  console.log(
    'progress',
    sign.progress,
    'smaller2',
    progressSmallerLevelTwo.value,
    'smaller3',
    progressSmallerLevelThree.value,
    sign.level_3_reached
  )
}

onBeforeMount(() => {
  checkProgress(props.signs[index.value])
  emit('rendered')
})

function reEnableInput() {
  store.flainetdata.methods.clearResultBuffer()
  inputAccepted.value = true
}

function reset() {
  feedbackClass.value = 'waiting'
  emit('waiting')
}

async function correct() {
  inputAccepted.value = false
  pathToIcon.value[index.value] = '/assets/icons/FLAI_Richtig.svg'
  if (progressSmallerLevelTwo.value || !showSign.value) {
    console.log('update correct')
    const progress =
      props.signs[index.value].progress + progressStep.value.progressAdd
    await store.signdata.actions.patchProgress(
      props.exerciseId,
      props.signs[index.value].id,
      progress
    )
  }
  feedbackClass.value = 'correct'
  if (index.value < props.signs.length - 1) {
    index.value++
    console.log('index', index.value)
    checkProgress(props.signs[index.value])

    // TODO: maybe the webcam opacity could be lowered or something else to signify the disabled input?
    status.value = FeedbackStatus.Paused
    setTimeout(reEnableInput, newInputTimeout.value)
  } else {
    wordComplete.value = true
    setTimeout(reset, newInputTimeout.value)
  }
  emit('correct')
}
async function wrong() {
  inputAccepted.value = false
  pathToIcon.value[index.value] = '/assets/icons/FLAI_Fehler.svg'
  if (progressSmallerLevelTwo.value || !showSign.value) {
    console.log('update wrong')
    const progress =
      props.signs[index.value].progress + progressStep.value.progressSubtract
    await store.signdata.actions.patchProgress(
      props.exerciseId,
      props.signs[index.value].id,
      progress
    )
  }
  feedbackClass.value = 'wrong'
  if (index.value < props.signs.length - 1) {
    index.value++
    console.log('index', index.value)
    checkProgress(props.signs[index.value])

    // TODO:  maybe the webcam opacity could be lowered or something else to signify the disabled input?
    status.value = FeedbackStatus.Paused
    setTimeout(reEnableInput, newInputTimeout.value)
  } else {
    wordComplete.value = true
    setTimeout(reset, newInputTimeout.value)
  }
  emit('wrong')
}

// TODO: Add adjustable timeout to inputAccepted reenable?
const onBufferUpdate = (buffer: FlaiNetResults) => {
  if (inputAccepted.value) {
    status.value = getFlaiNetResults(
      buffer,
      props.signs[index.value].name,
      correct,
      wrong,
      reset
    )
  }
}

watchEffect(() => onBufferUpdate(resultBuffer.value))
</script>
