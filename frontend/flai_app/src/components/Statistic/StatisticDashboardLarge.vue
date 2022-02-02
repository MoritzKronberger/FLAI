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

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
