<template>
  <router-link :to="{ name: linkTarget }">
    <div class="card-container">
      <div class="statistic-circle">
        <div ref="borderElement" class="circle"></div>
        <div
          v-if="progress"
          ref="progressBarElement"
          class="progress-bar"
        ></div>
        <div class="body-large statistic-value">{{ statisticValue }}</div>
      </div>
      <div class="statistic-text body-medium">{{ statisticText }}</div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import progressbar from 'progressbar.js'
import { ref, toRefs, watchEffect } from 'vue'

const props = defineProps<{
  statisticValue: string
  linkTarget: string
  statisticText: string
  progress?: number
}>()

const progressBarElement = ref<HTMLDivElement>()
const progressBarOptions: progressbar.PathDrawingOptions = {
  color: '#4a7bf6', //main-blue
  strokeWidth: 3.04 * 1.5,
  duration: 300,
}
const borderElement = ref<HTMLDivElement>()
const border: progressbar.PathDrawingOptions = {
  color: '#c5dcff', //subtle-blue
  strokeWidth: 3.04,
  duration: 1,
}
const progressCircle = ref()
const borderCircle = ref()
const { progress } = toRefs(props)

const renderProgress = (pg: number) => {
  if (!progressCircle.value && progressBarElement.value) {
    progressCircle.value = new progressbar.Circle(
      progressBarElement.value,
      progressBarOptions
    )
  }
  if (!borderCircle.value && borderElement.value) {
    borderCircle.value = new progressbar.Circle(borderElement.value, border)
  }
  if (progressCircle.value) progressCircle.value.animate(pg)
  if (borderCircle.value) borderCircle.value.animate(1)
}

watchEffect(() => renderProgress(progress?.value ?? 0))
</script>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
