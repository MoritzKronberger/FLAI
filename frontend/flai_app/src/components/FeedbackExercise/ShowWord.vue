<template>
  <div vFocus tabindex="0" @keydown.c="correct">
    <div vFocus tabindex="0" @keydown.w="wrong">
      <div class="signs">
        <span v-for="(letter, count) of signs" :key="letter.name">
          <span v-if="count === index" class="currentLetter">
            {{ letter.name }}
          </span>
          <span v-else>{{ letter.name }}</span>
        </span>
      </div>
      <Video
        :show-sign="showSign"
        :signs="signs"
        :index="index"
        :class="feedbackClass"
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

const inputAccepted = ref(true)
const index = ref(0)
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

onBeforeMount(() => checkProgress(props.signs[index.value]))

const emit = defineEmits(['new-word'])

function reEnableInput() {
  store.flainetdata.methods.clearResultBuffer()
  inputAccepted.value = true
}

async function correct() {
  inputAccepted.value = false
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
  feedbackClass.value = 'right'
  if (index.value < props.signs.length - 1) {
    index.value++
    console.log('index', index.value)
    checkProgress(props.signs[index.value])

    // TODO: maybe the webcam opacity could be lowered or something else to signify the disabled input?
    status.value = FeedbackStatus.Paused
    setTimeout(reEnableInput, newInputTimeout.value)
  } else {
    wordComplete.value = true
  }
}
async function wrong() {
  inputAccepted.value = false
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
  }
}

// TODO: Add adjustable timeout to inputAccepted reenable?
const onBufferUpdate = (buffer: FlaiNetResults) => {
  if (inputAccepted.value) {
    status.value = getFlaiNetResults(
      buffer,
      props.signs[index.value].name,
      correct,
      wrong
    )
  }
}

watchEffect(() => onBufferUpdate(resultBuffer.value))
</script>

<style>
div:focus {
  outline: none;
}
.controls {
  color: blue;
}
.waiting {
  color: grey;
}
.currentLetter {
  font-size: 20px;
  font-weight: bold;
}
</style>
