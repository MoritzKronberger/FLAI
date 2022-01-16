<script setup lang="ts">
defineProps<{
  statisticValue: string
  linkTarget: string
  statisticText: string
}>()
</script>

<template>
  <router-link :to="{ name: linkTarget }">
    <div class="card-container">
      <div class="statistic-circle">
        <div class="body-large statistic-value">{{ statisticValue }}</div>
      </div>
      <div class="body-small statistic-text">{{ statisticText }}</div>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
