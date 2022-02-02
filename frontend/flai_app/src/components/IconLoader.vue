<template>
  <img :src="path" :alt="alt" :class="elementClass" />
</template>

<script setup lang="ts">
defineProps<{
  path: string
  alt: string
  elementClass: string
}>()
</script>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
