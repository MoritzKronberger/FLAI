<script setup lang="ts">
import DayStreak from './DayStreak.vue'
import CardSmall from './CardSmall.vue'
import TrendDiagram from './TrendDiagram.vue'
import ProgressBar from './ProgressBar.vue'
</script>

<template>
  <div class="statistic-dashboard-large">
    <div class="flex-cards">
      <DayStreak />
      <hr />
      <div>
        <ProgressBar />
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
