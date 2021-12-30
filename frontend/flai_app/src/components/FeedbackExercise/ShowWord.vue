<template>
  <div vFocus tabindex="0" @keydown.c="correct">
    <div vFocus tabindex="0" @keydown.w="wrong">
      <p v-for="letter in props.signs" :key="letter.name">{{ letter.name }}</p>
      <Video v-if="showSign" :signs="signs" :index="index" />
      <Vbutton v-else label="Hinweis" btnclass="" @click="showSign = true" />
      <p :class="feedbackClass">TODO: Add webcam component</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watchEffect } from 'vue'
import router from '../../router'
import { Sign } from '../../store/signdata'
import Video from './Video.vue'
import Vbutton from '../vbutton.vue'

const store: any = inject('store')

const index = ref(0)
const feedbackClass = ref('waiting')

const props = defineProps<{ signs: Sign[] }>()

function correct() {
  store.signdata.methods.updateProgress(props.signs[index.value].name, 10)
  feedbackClass.value = 'right'
  if (index.value < props.signs.length - 1) {
    index.value++
  } else {
    //TODO: view is not reloading
    router.push({ name: 'HomePage' })
  }
}
function wrong() {
  store.signdata.methods.updateProgress(props.signs[index.value].name, -10)
  feedbackClass.value = 'wrong'
  if (index.value < props.signs.length - 1) {
    index.value++
  } else {
    //TODO: view is not reloading
    router.push({ name: 'HomePage' })
  }
}

const showSign = ref(true)
function checkProgress(sign: Sign) {
  console.log('progress', sign.progress)
  if (sign.progress >= store.exercisedata.exerciseSettings.level1) {
    showSign.value = false
  } else {
    showSign.value = true
  }
}
watchEffect(() => checkProgress(props.signs[index.value]))
</script>

<style>
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
