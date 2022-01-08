<template>
  <div vFocus tabindex="0" @keydown.c="correct">
    <div vFocus tabindex="0" @keydown.w="wrong">
      <p v-for="letter in signs" :key="letter.name">{{ letter.name }}</p>
      <Video
        :show-sign="showSign"
        :signs="signs"
        :index="index"
        @use-hint="showSign = true"
      />
      <p :class="feedbackClass">TODO: Add webcam component</p>
      <Button
        v-if="index === signs.length - 1"
        label="weiter"
        btnclass="controls"
        @button-click="emit('new-word')"
      />
      <p>{{ status }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  ComputedRef,
  onBeforeMount,
  watchEffect,
  watch,
} from 'vue'
import { Progress } from '../../store/exercisedata'
import { Sign } from '../../store/signdata'
import Video from './Video.vue'
import store from '../../store'
import Button from '../CustomButton.vue'
import { getFlaiNetResults } from '../../ressources/ts/flaiNetCheck'
import { useRouter } from 'vue-router'
import { FlaiNetResults } from '../../store/flainetdata'

const router = useRouter()

const inputAccepted = ref(true)
const index = ref(0)
const feedbackClass = ref('waiting')
const progressSmallerLevelTwo = ref(true)
const progressSmallerLevelThree = ref(true)
const showSign = ref(true)

const progressStep: ComputedRef<Progress> = computed(
  () => store.exercisedata.progressStep
)

const resultBuffer = computed(() => store.flainetdata.resultBuffer.results)
const status = ref('Loading')

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

    console.log('--- ShowWord correct is clearing the Buffer ---')
    store.flainetdata.methods.clearResultBuffer()
    inputAccepted.value = true
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

    console.log('--- ShowWord wrong is clearing the Buffer ---')
    store.flainetdata.methods.clearResultBuffer()
    inputAccepted.value = true
  }
}

// TODO: Add adjustable timeout to inputAccepted reenable?
const onBufferUpdate = (buffer: FlaiNetResults) => {
  console.log(inputAccepted.value)
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
.right {
  color: green;
}
.wrong {
  color: red;
}
</style>
