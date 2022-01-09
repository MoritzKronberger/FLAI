<script setup lang="ts">
defineProps<{
  path: string
  alt: string
  elementClass: string
}>()
</script>

<template>
  <img :src="path" :alt="alt" :class="elementClass" />
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
