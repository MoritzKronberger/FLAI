<template>
  <div vFocus tabindex="0" @keydown.c="correct">
    <div vFocus tabindex="0" @keydown.w="wrong">
      <p v-for="letter in props.signs" :key="letter.name">{{ letter.name }}</p>
      <Video
        :show-sign="showSign"
        :signs="signs"
        :index="index"
        @use-hint="showSign = true"
      />
      <p :class="feedbackClass">TODO: Add webcam component</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watchEffect } from 'vue'
import router from '../../router'
import { Sign } from '../../store/signdata'
import Video from './Video.vue'

const store: any = inject('store')

const index = ref(0)
const feedbackClass = ref('waiting')
const progressSmallerLevelOne = ref(true)
const showSign = ref(true)

const props = defineProps<{ signs: Sign[]; exerciseId: string }>()

function correct() {
  if (progressSmallerLevelOne.value || !showSign.value) {
    store.exercisedata.methods.updateProgress(
      props.exerciseId,
      props.signs[index.value].name,
      10
    )
  }
  feedbackClass.value = 'right'
  if (index.value < props.signs.length - 1) {
    index.value++
  } else {
    router.push({ name: 'HomePage' })
  }
}
function wrong() {
  if (progressSmallerLevelOne.value || !showSign.value) {
    store.exercisedata.methods.updateProgress(
      props.exerciseId,
      props.signs[index.value].name,
      -10
    )
  }
  feedbackClass.value = 'wrong'
  if (index.value < props.signs.length - 1) {
    index.value++
  } else {
    //TODO: view is not reloading
    router.push({ name: 'HomePage' })
  }
}

function checkProgress(sign: Sign) {
  console.log('progress', sign.progress)
  if (sign.progress >= store.exercisedata.exerciseSettings.level1) {
    progressSmallerLevelOne.value = false
    showSign.value = false
  } else {
    progressSmallerLevelOne.value = true
    showSign.value = true
  }
}
watchEffect(() => checkProgress(props.signs[index.value]))
</script>

<style>
div:focus {
  outline: none;
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
