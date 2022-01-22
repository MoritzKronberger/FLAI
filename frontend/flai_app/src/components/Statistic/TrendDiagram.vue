<script setup lang="ts">
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
    <img src="/assets/statisticPlaceholders/diagram.svg" alt="Trend Diagram" />
  </div>
</template>

<style scoped>
/** here place for import scss */
</style>
