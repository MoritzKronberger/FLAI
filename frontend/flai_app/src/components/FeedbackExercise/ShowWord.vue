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
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watchEffect, computed, ComputedRef } from 'vue'
import router from '../../router'
import { Sign } from '../../store/signdata'
import Video from './Video.vue'

const store: any = inject('store')

const index = ref(0)
const feedbackClass = ref('waiting')
const progressSmallerLevelTwo = ref(true)
const progressSmallerLevelThree = ref(true)
const showSign = ref(true)

const signs: ComputedRef<Sign[]> = computed(
  () => store.exercisedata.exerciseSessions.at(-1).signs
)
const props = defineProps<{ exerciseId: string }>()

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
          console.log('increaseUnlockedSigns')
          // TODO action
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

async function correct() {
  if (progressSmallerLevelTwo.value || !showSign.value) {
    console.log('update correct')
    const progress = signs.value[index.value].progress + 10
    await store.signdata.actions.patchProgress(
      props.exerciseId,
      signs.value[index.value].id,
      progress
    )
  }
  feedbackClass.value = 'right'
  if (index.value < signs.value.length - 1) {
    console.log('index', index.value)
    index.value++
    checkProgress(signs.value[index.value])
  } else {
    router.push({ name: 'HomePage' })
  }
}
async function wrong() {
  if (progressSmallerLevelTwo.value || !showSign.value) {
    console.log('update wrong')
    const progress = signs.value[index.value].progress - 10
    await store.signdata.actions.patchProgress(
      props.exerciseId,
      signs.value[index.value].id,
      progress
    )
  }
  feedbackClass.value = 'wrong'
  if (index.value < signs.value.length - 1) {
    console.log('index', index.value)
    index.value++
    checkProgress(signs.value[index.value])
  } else {
    //TODO: view is not reloading
    router.push({ name: 'HomePage' })
  }
}

//watchEffect(() => checkProgress(signs.value[index.value]))
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
