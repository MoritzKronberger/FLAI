<script setup lang="ts">
import IconLoader from '../IconLoader.vue'

defineProps<{
  days: number
}>()
</script>

<template>
  <div>
    <IconLoader
      path="/assets/statisticPlaceholders/streak.svg"
      alt="Streak Icon"
      element-class="streak-icon"
    />
    <span class="day-counter">{{ days }}</span>
    <span> Tage in Folge</span>
  </div>
</template>

<style scoped>
/** here place for import scss */
</style>
