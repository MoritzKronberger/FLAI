<template>
  <button type="button" :class="btnclass" @click="onclick()">
    {{ label }}
    <IconLoader
      v-if="iconpath !== undefined"
      :path="iconpath"
      alt="Button Icon"
      element-class=""
    />
  </button>
</template>

<script setup lang="ts">
import IconLoader from './IconLoader.vue'

const props = defineProps<{
  label: string
  btnclass: string
  iconpath?: string
  switch?: boolean
}>()
const emit = defineEmits(['buttonClick'])

function onclick() {
  const emitLabel = props.switch ? props.label : undefined
  // emit is placed in method so that validation for input value can be added
  emit('buttonClick', emitLabel)
}
</script>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/abstracts/buttonMixins.scss';
</style>
