<script setup lang="ts">
defineProps<{
  labelName: string
  elementClass: string
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const onInput = (e: Event): void => {
  // emit is placed in method so that validation for input value can be added
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}
</script>

<template>
  <label :for="labelName">
    {{ labelName }}
    <input
      :checked="modelValue"
      type="checkbox"
      :name="labelName"
      :class="elementClass"
      @input="onInput"
    />
  </label>
</template>
