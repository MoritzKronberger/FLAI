<script setup lang="ts">
const date = new Date(Date.now())
</script>

<template>
  <div>
    <div>
      <span>{{ date.toLocaleString('default', { month: 'long' }) + ' ' }}</span>
      <span>{{ date.toLocaleString('default', { year: 'numeric' }) }}</span>
    </div>
    <img
      src="../../assets/statisticPlaceholders/diagram.svg"
      alt="Lernzeit Trend Diagramm"
    />
  </div>
</template>

<style scoped>
/** here place for import scss */
</style>
