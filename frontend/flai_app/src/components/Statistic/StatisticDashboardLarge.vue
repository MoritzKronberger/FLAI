<template>
  <div class="statistic-dashboard-large">
    <div class="flex-cards">
      <DayStreak />
    </div>
    <TrendDiagram />
  </div>
</template>

<script setup lang="ts">
import DayStreak from './DayStreak.vue'
import TrendDiagram from './TrendDiagram.vue'
</script>

<style lang="scss">
@import '@/assets/scss/components/statistic/statistic_dashboard_large';
</style>
