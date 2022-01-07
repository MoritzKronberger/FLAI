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
        label="weiter"
        btnclass="controls"
        @button-click="emit('new-word')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, onBeforeMount } from 'vue'
import router from '../../router'
import { Progress } from '../../store/exercisedata'
import { Sign } from '../../store/signdata'
import Video from './Video.vue'
import store from '../../store'
import Button from '../CustomButton.vue'

const index = ref(0)
const feedbackClass = ref('waiting')
const progressSmallerLevelTwo = ref(true)
const progressSmallerLevelThree = ref(true)
const showSign = ref(true)

const progressStep: ComputedRef<Progress> = computed(
  () => store.exercisedata.progressStep
)

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

async function correct() {
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
  } else {
    router.push({ name: 'HomePage' })
  }
}
async function wrong() {
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
  } else {
    //TODO: view is not reloading
    router.push({ name: 'HomePage' })
  }
}

//watchEffect(() => checkProgress(signs.value[index.value]))
const emit = defineEmits(['new-word'])
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
