<template>
  <div class="watch-word exercise-grid">
    <exercise-header header-text="Einprägen" />
    <SignControls :signs="signs" @new-index="onNewIndex" />
    <Video :signs="signs" :index="index" :show-sign="true" />
    <p
      :class="`status body-medium ${
        feedbackClass !== 'waiting' ? 'compensate-border' : ''
      }`"
    >
      {{ status }}
    </p>
    <Webcam :borderclass="feedbackClass" />
    <div class="next-button">
      <CustomButton
        id="next"
        label="weiter"
        btnclass="prim_medium_button_blue"
        @click="emit('next')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed, onBeforeMount } from 'vue'
import { Sign } from '../../store/signdata'
import CustomButton from '../CustomButton.vue'
import Video from './Video.vue'
import Webcam from '../Webcam.vue'
import SignControls from './SignControls.vue'
import ExerciseHeader from '../ExerciseHeader.vue'
import store from '../../store'
import { getFlaiNetResults } from '../../ressources/ts/flaiNetCheck'

const isCorrect = ref(false)
const feedbackClass = ref('waiting')
const index = ref(0)

const resultBuffer = computed(() => store.flainetdata.resultBuffer.results)
const status = ref('Loading')

const props = defineProps<{ signs: Sign[]; exerciseId: string }>()

const emit = defineEmits(['next', 'correct', 'wrong', 'waiting', 'rendered'])

function correct() {
  isCorrect.value = true
  feedbackClass.value = 'correct'
  emit('correct')
}
function wrong() {
  isCorrect.value = false
  feedbackClass.value = 'wrong'
  emit('wrong')
}
function reset() {
  feedbackClass.value = 'waiting'
  emit('waiting')
}

async function onNewIndex(newIndex: number) {
  index.value = newIndex
  store.flainetdata.methods.clearResultBuffer()
  await store.signdata.actions.patchProgress(
    props.exerciseId,
    props.signs[index.value].id,
    props.signs[index.value].progress,
    true
  )
}

async function checkProgress(sign: Sign) {
  await store.signdata.actions.patchProgress(
    props.exerciseId,
    sign.id,
    sign.progress,
    true
  )
}
watchEffect(() => checkProgress(props.signs[index.value]))

watchEffect(
  () =>
    (status.value = getFlaiNetResults(
      resultBuffer.value,
      props.signs[index.value].name,
      correct,
      wrong,
      reset
    ))
)

onBeforeMount(() => emit('rendered'))
</script>
