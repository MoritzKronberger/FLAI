<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  placeholderPath: string
  linkTarget: string
  altText: string
}>()

const { placeholderPath } = toRefs(props)

const dynamicPath: URL = new URL(placeholderPath.value, import.meta.url)
</script>

<template>
  <router-link :to="{ name: linkTarget }">
    <img :src="dynamicPath.toString()" :alt="altText" />
  </router-link>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
