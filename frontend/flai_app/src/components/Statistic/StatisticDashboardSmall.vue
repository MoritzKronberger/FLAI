<script setup lang="ts">
import CardSmall from './CardSmall.vue'
</script>

<template>
  <div class="statistic-dashboard-small">
    <h4 class="heading-small">Statistiken</h4>
    <div class="grid-cards">
      <div class="child-card">
        <card-small
          statistic-value="42 Min"
          link-target="ComingSoon"
          statistic-text="heute gelernt"
        />
      </div>
      <div class="child-card">
        <card-small
          statistic-value="E"
          link-target="ComingSoon"
          statistic-text="beste Gebärde aus Buchstabieren lernen"
        />
      </div>
      <div class="child-card">
        <card-small
          statistic-value="40%"
          link-target="ComingSoon"
          statistic-text="von Buchstabieren lernen abgeschlossen"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
