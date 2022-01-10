<script setup lang="ts">
import DayStreak from './DayStreak.vue'
import CardSmall from './CardSmall.vue'
import TrendDiagram from './TrendDiagram.vue'
const days = 15
</script>

<template>
  <div class="statistic-dashboard-large">
    <div class="flex-cards">
      <DayStreak :days="days" />
      <hr />
      <div>
        <card-small
          placeholder-path="/assets/statisticPlaceholders/cardSmallProgress.svg"
          link-target="ComingSoon"
          alt-text="Aufgaben Fortschritt Statistik"
        />
      </div>
      <hr />
      <TrendDiagram />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
