<template>
  <header :class="headerClass">
    <slot></slot>
  </header>
</template>

<script setup lang="ts">
defineProps<{ headerClass: string }>()
</script>
