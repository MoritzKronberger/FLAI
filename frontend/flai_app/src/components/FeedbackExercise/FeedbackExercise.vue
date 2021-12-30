<template>
  <WatchWord v-if="stepOneWatch" />
  <ShowWord v-else />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WatchWord from './WatchWord.vue'
import ShowWord from './ShowWord.vue'

const stepOneWatch = ref(true)
</script>
