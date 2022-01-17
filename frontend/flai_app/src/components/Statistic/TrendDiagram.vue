<script setup lang="ts">
import CardSmall from './CardSmall.vue'
const date = new Date(Date.now())
</script>

<template>
  <div>
    <div id="month">
      <span class="heading-small month">{{
        date.toLocaleString('default', { month: 'long' }) + ' '
      }}</span>
      <span class="heading-small">{{
        date.toLocaleString('default', { year: 'numeric' })
      }}</span>
    </div>
    <CardSmall
      placeholder-path="/assets/statisticPlaceholders/diagram.svg"
      link-target="ComingSoon"
      alt-text="Lernzeit Trend Diagramm"
    />
  </div>
</template>

<style scoped>
/** here place for import scss */
</style>
