<template>
  <div vFocus tabindex="0" @keydown.c="correct">
    <div vFocus tabindex="0" @keydown.w="wrong">
      <p v-for="letter in props.signs" :key="letter.name">{{ letter.name }}</p>
      <Video :signs="signs" :index="index" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import router from '../../router'
import { Sign } from '../../store/signdata'
import Video from './Video.vue'

const store: any = inject('store')

const index = ref(0)

const props = defineProps<{ signs: Sign[] }>()

function correct() {
  store.signdata.methods.updateProgress(props.signs[index.value].name, 10)
  if (index.value < props.signs.length - 1) {
    index.value++
  } else {
    router.push('HomePage')
  }
}
function wrong() {
  store.signdata.methods.updateProgress(props.signs[index.value].name, -10)
  if (index.value < props.signs.length - 1) {
    index.value++
  } else {
    router.push('HomePage')
  }
}
</script>
