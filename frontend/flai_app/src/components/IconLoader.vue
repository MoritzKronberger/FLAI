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

<style scoped>
/* Replace with real scss styling based on classes */
img {
  width: 50px;
}
</style>
