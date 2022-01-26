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
  color: '#4a7bf6',
  strokeWidth: 3.04 * 1.5,
  duration: 300,
}
const progressCircle = ref()
const { progress } = toRefs(props)

const renderProgress = (pg: number) => {
  if (!progressCircle.value && progressBarElement.value) {
    progressCircle.value = new progressbar.Circle(
      progressBarElement.value,
      progressBarOptions
    )
  }
  if (progressCircle.value) progressCircle.value.animate(pg)
}

watchEffect(() => renderProgress(progress?.value ?? 0))
</script>

<template>
  <router-link :to="{ name: linkTarget }">
    <div class="card-container">
      <div class="statistic-circle">
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

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
