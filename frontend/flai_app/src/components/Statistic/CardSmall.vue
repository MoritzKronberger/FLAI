<script setup lang="ts">
defineProps<{
  placeholderPath: string
  linkTarget: string
  altText: string
}>()
</script>

<template>
  <router-link :to="{ name: linkTarget }">
    <img :src="placeholderPath" :alt="altText" />
  </router-link>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
