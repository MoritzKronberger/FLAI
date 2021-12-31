<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <h1>Das ist ein Test</h1>
</template>

<style lang="scss" scoped>
@import './src/assets/scss/main.scss';
</style>
