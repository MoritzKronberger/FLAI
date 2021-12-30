<template>
  <div vFocus tabindex="0" @keydown.c="correct">
    <div vFocus tabindex="0" @keydown.w="wrong">
      <Video :signs="signs" />
      <p :class="feedbackClass">TODO: Add webcam component</p>
      <VButton label="Fertig" btnclass="controls" @click="emit('next')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onBeforeMount, ComputedRef } from 'vue'
import { Sign } from '../../store/signdata'
import VButton from './../vbutton.vue'
import Video from './Video.vue'

const store: any = inject('store')
const signs: ComputedRef<Sign[]> = computed(
  () => store.exercisedata.exercises.at(-1).signs
)

const isCorrect = ref(false)
const feedbackClass = ref('waiting')

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

const emit = defineEmits(['next'])

onBeforeMount(() => {
  store.exercisedata.methods.startNewExercise('name', 'desc')
})
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
