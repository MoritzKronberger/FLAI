<script setup lang="ts">
import CardSmall from './CardSmall.vue'
</script>

<template>
  <h2>Statistiken</h2>
  <card-small
    placeholder-path="../../assets/statisticPlaceholders/cardSmallTimeWeek.svg"
    link-target="ComingSoon"
    alt-text="Wochen-Lernziel Statistik"
  />
  <card-small
    placeholder-path="../../assets/statisticPlaceholders/cardSmallLetter.svg"
    link-target="ComingSoon"
    alt-text="Meist-gelernter Buchstabe Statistik"
  />
  <card-small
    placeholder-path="../../assets/statisticPlaceholders/cardSmallLection.svg"
    link-target="ComingSoon"
    alt-text="Abgeschlossene Lektionen Statistik"
  />
</template>

<style scoped>
/** here place for import scss */
</style>
