<script setup lang="ts">
import progressbar from 'progressbar.js'
import { onMounted, ref, toRefs, watchEffect } from 'vue'

const props = defineProps<{
  statisticValue: string
  linkTarget: string
  statisticText: string
  progress?: number
}>()

const progressBarElement = ref<HTMLDivElement>()
const progressBarOptions: progressbar.PathDrawingOptions = {
  color: '#355bbc',
  strokeWidth: 4,
  duration: 500,
}
const progressCircle = ref()
const { progress } = toRefs(props)

const renderProgress = (pg: number) => {
  if (progressCircle.value) progressCircle.value.animate(pg)
}

onMounted(() => {
  if (progressBarElement.value && progress) {
    progressCircle.value = new progressbar.Circle(
      progressBarElement.value,
      progressBarOptions
    )
    renderProgress(progress.value ?? 0)
  }
})

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
      <div class="statistic-text">{{ statisticText }}</div>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
