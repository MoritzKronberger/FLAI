<script setup lang="ts">
import IconLoader from '../IconLoader.vue'

defineProps<{
  days: number
}>()
</script>

<template>
  <div class="hot-streak">
    <div class="hot-streak-item">
      <IconLoader
        path="/assets/statisticPlaceholders/streak.svg"
        alt="Streak Icon"
        element-class="streak-icon"
      />
    </div>
    <div class="hot-streak-item">
      <span class="day-counter heading-medium">{{ days }}</span>
    </div>
    <div class="hot-streak-item">
      <span class="day-text body-normal"> Tage in Folge</span>
    </div>
  </div>
</template>

<style scoped>
/** here place for import scss */
</style>
