<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  path: string
  mimetype: string
  alt: string
  elementClass: string
}>()

const { path, mimetype } = toRefs(props)

const dynamicPath: URL = new URL(
  `${path.value}.${mimetype.value}`,
  import.meta.url
)
</script>

<template>
  <img :src="dynamicPath.toString()" :alt="alt" :class="elementClass" />
</template>

<style scoped>
/* Replace with real scss styling based on classes */
img {
  width: 50px;
}
</style>
