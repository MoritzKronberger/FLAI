<template>
  <div class="show-word exercise-grid">
    <exercise-header header-text="Üben" />
    <SignsWithIcons
      v-if="wordSet"
      class="current-word"
      :signs="signs"
      :index="index"
      :path="pathToIcon"
    />
    <div v-else class="current-word body-medium status-generating">
      Generiere Wort...
    </div>
    <Video
      v-if="wordSet"
      :show-sign="showSign"
      :signs="signs"
      :index="index"
      :progress-warning="!progressSmallerLevelThree"
      @use-hint="showSign = true"
    />
    <p v-if="!wordComplete" class="status body-medium">{{ status }}</p>
    <webcam :borderclass="feedbackClass" />
    <div class="next-button">
      <Button
        v-if="wordComplete"
        id="next"
        label="weiter"
        btnclass="prim_medium_button_blue"
        @button-click="emit('new-word')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, watchEffect } from 'vue'
import { Sign } from '../../store/signdata'
import Video from './Video.vue'
import store from '../../store'
import Button from '../CustomButton.vue'
import { getFlaiNetResults } from '../../ressources/ts/flaiNetCheck'
import { FlaiNetResults } from '../../store/flainetdata'
import { FeedbackStatus } from '../../ressources/ts/interfaces'
import SignsWithIcons from './SignsWithIcons.vue'
import Webcam from '../Webcam.vue'
import ExerciseHeader from '../ExerciseHeader.vue'
const inputAccepted = ref(true)
const index = ref(0)

const pathToIcon = ref<string[]>([])

const feedbackClass = ref('waiting')
const progressSmallerLevelTwo = ref(true)
const progressSmallerLevelThree = ref(true)
const showSign = ref(true)
const wordComplete = ref(false)

const progressAdd = store.exercisedata.exerciseSettings.progress_add
const progressSub = store.exercisedata.exerciseSettings.progress_sub

const resultBuffer = computed(() => store.flainetdata.resultBuffer.results)
const newInputTimeout = computed(
  () => store.flainetdata.flaiNetOptions.newInputTimeout
)
const status = ref<FeedbackStatus>(FeedbackStatus.Paused)

const props =
  defineProps<{ signs: Sign[]; exerciseId: string; wordSet: boolean }>()
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
  if (progressSmallerLevelThree.value || !showSign.value) {
    console.log('update correct')
    const progress = props.signs[index.value].progress + progressAdd
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
  if (progressSmallerLevelThree.value || !showSign.value) {
    console.log('update wrong')
    const progress = props.signs[index.value].progress + progressSub
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
