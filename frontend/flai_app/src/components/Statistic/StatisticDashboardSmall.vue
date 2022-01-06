<script setup lang="ts">
import CardSmall from './CardSmall.vue'
</script>

<template>
  <div class="statistic-dashboard-small">
    <h2>Statistiken</h2>
    <div class="flex-cards">
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
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
