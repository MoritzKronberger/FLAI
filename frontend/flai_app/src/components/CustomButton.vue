<script setup lang="ts">
defineProps<{ label: string; btnclass: string }>()
const emit = defineEmits(['buttonClick'])

function onclick() {
  // emit is placed in method so that validation for input value can be added
  emit('buttonClick')
}
</script>

<template>
  <button type="button" :class="btnclass" @click="onclick()">
    {{ label }}
  </button>
</template>

<style scoped lang="scss">
.button-logout {
  width: 70%;
  margin-top: 40vh;
}
</style>
