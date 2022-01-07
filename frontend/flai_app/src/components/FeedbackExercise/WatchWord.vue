<template>
  <div vFocus tabindex="0" @keydown.c="correct">
    <div vFocus tabindex="0" @keydown.w="wrong">
      <SignControls :signs="signs" @new-index="onNewIndex" />
      <Video
        :signs="signs"
        :index="index"
        :show-sign="showSign"
        @use-hint="showSign = true"
      />
      <p :class="feedbackClass">TODO: Add webcam component</p>
      <CustomButton label="Fertig" btnclass="controls" @click="emit('next')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Sign } from '../../store/signdata'
import CustomButton from '../CustomButton.vue'
import Video from './Video.vue'
import SignControls from './SignControls.vue'
import store from '../../store'

const isCorrect = ref(false)
const feedbackClass = ref('waiting')
const index = ref(0)
const showSign = ref(true)

const props = defineProps<{ signs: Sign[]; exerciseId: string }>()

const vFocus = {
  inserted: (el: any) => {
    el.focus()
  },
}

function correct() {
  console.log('correct')
  isCorrect.value = true
  feedbackClass.value = 'right'
}
function wrong() {
  console.log('wrong')
  isCorrect.value = false
  feedbackClass.value = 'wrong'
}

function onNewIndex(newIndex: number) {
  index.value = newIndex
  store.signdata.actions.patchProgress(
    props.exerciseId,
    props.signs[index.value].id,
    props.signs[index.value].progress,
    true
  )
  console.log(index.value)
}

function checkProgress(sign: Sign) {
  if (sign.progress >= store.exercisedata.exerciseSettings.level_1) {
    showSign.value = false
  } else {
    showSign.value = true
  }
}
watchEffect(() => checkProgress(props.signs[index.value]))
const emit = defineEmits(['next'])
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
