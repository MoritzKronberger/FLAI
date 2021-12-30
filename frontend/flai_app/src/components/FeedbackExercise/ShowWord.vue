<template>
  <p>{{ props.signs }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sign } from '../../store/signdata'

const props = defineProps<{ signs: Sign[] }>()
</script>
