<template>
  <!--div vFocus tabindex="0" @keydown.c="correct">
    <div vFocus tabindex="0" @keydown.w="wrong"-->
  <div class="watch-word">
    <h2 class="heading-large align-left">Einprägen</h2>
    <SignControls :signs="signs" @new-index="onNewIndex" />
    <Video
      :signs="signs"
      :index="index"
      :show-sign="showSign"
      :class="feedbackClass"
      @use-hint="showSign = true"
    />
    <p class="status body-medium">{{ status }}</p>
    <div class="webcam-column">
      <Webcam :class="feedbackClass" />
      <div class="exercise-controls">
        <CustomButton
          label="Home"
          btnclass="exit sec_small_button_blue"
          @click="router.push({ name: 'HomePage' })"
        />
        <CustomButton
          id="next"
          label="weiter"
          btnclass="prim_small_button_blue"
          @click="emit('next')"
        />
      </div>
    </div>
  </div>
  <!--/div>
  </div-->
</template>

<script setup lang="ts">
import { ref, watchEffect, computed, onBeforeMount } from 'vue'
import { Sign } from '../../store/signdata'
import { useRouter } from 'vue-router'
import CustomButton from '../CustomButton.vue'
import Video from './Video.vue'
import Webcam from '../Webcam.vue'
import SignControls from './SignControls.vue'
import store from '../../store'
import { getFlaiNetResults } from '../../ressources/ts/flaiNetCheck'

const router = useRouter()

const isCorrect = ref(false)
const feedbackClass = ref('waiting')
const index = ref(0)
const showSign = ref(true)

const resultBuffer = computed(() => store.flainetdata.resultBuffer.results)
const status = ref('Loading')

const props = defineProps<{ signs: Sign[]; exerciseId: string }>()

const vFocus = {
  inserted: (el: any) => {
    el.focus()
  },
}

const emit = defineEmits(['next', 'correct', 'wrong', 'waiting', 'rendered'])

function correct() {
  console.log('correct')
  isCorrect.value = true
  feedbackClass.value = 'correct'
  emit('correct')
}
function wrong() {
  console.log('wrong')
  isCorrect.value = false
  feedbackClass.value = 'wrong'
  emit('wrong')
}
function reset() {
  console.log('waiting')
  emit('waiting')
}

// TODO: progress property not really needed?
async function onNewIndex(newIndex: number) {
  index.value = newIndex
  console.log('--- WatchWord onNewIndex is clearing the Buffer ---')
  store.flainetdata.methods.clearResultBuffer()
  await store.signdata.actions.patchProgress(
    props.exerciseId,
    props.signs[index.value].id,
    props.signs[index.value].progress,
    true
  )
  console.log(index.value)
}

async function checkProgress(sign: Sign) {
  if (sign.progress >= store.exercisedata.exerciseSettings.level_1) {
    showSign.value = false
  } else {
    showSign.value = true
  }
  await store.signdata.actions.patchProgress(
    props.exerciseId,
    props.signs[index.value].id,
    props.signs[index.value].progress,
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div:focus {
  outline: none;
}
h3 {
  margin: 40px 0 0;
}
video {
  width: 40%;
}
.controls {
  background: lightblue;
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
