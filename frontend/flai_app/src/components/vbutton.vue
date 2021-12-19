<script setup lang="ts">
defineProps<{ label: string; btnclass: string }>()
const emit = defineEmits(['click'])

function _click() {
  emit('click')
}
</script>

<template>
  <input type="button" :value="label" :class="btnclass" @click="_click()" />
</template>

<style lang="scss" scoped></style>
