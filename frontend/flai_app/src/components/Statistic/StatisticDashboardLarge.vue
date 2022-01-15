<script setup lang="ts">
import DayStreak from './DayStreak.vue'
import TrendDiagram from './TrendDiagram.vue'

const days = 15
</script>

<template>
  <div class="statistic-dashboard-large">
    <div class="flex-cards">
      <DayStreak :days="days" />
    </div>
    <TrendDiagram />
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
