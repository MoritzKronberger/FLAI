<template>
  <base-header header-class="exercise-header">
    <h2 class="heading-large align-left">{{ headerText }}</h2>
    <custom-button
      label="Home"
      btnclass="exit sec_medium_button_blue"
      @click="router.push({ name: 'HomePage' })"
    />
  </base-header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import CustomButton from './CustomButton.vue'
import BaseHeader from './BaseHeader.vue'

const router = useRouter()

defineProps<{ headerText: string }>()
</script>
