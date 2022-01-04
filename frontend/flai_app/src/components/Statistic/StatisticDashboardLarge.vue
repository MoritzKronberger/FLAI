<script setup lang="ts">
import DayStreak from './DayStreak.vue'
import CardSmall from './CardSmall.vue'
import TrendDiagram from './TrendDiagram.vue'
const days = 15
</script>

<template>
  <DayStreak :days="days" />
  <div>Buchstabieren lernen</div>
  <card-small
    placeholder-path="../../assets/statisticPlaceholders/cardSmallProgress.svg"
    link-target="ComingSoon"
    alt-text="Aufgaben Fortschritt Statistik"
  />
  <TrendDiagram />
</template>

<style scoped>
/** here place for import scss */
</style>
