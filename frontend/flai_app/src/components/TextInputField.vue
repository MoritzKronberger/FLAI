<script setup lang="ts">
defineProps<{
  labelName: string
  placeholder: string
  elementClass: string
  componentClass: string
  modelValue: string | number
}>()
const emit = defineEmits(['update:modelValue'])

const onInput = (e: Event): void => {
  // emit is placed in method so that validation for input value can be added
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div :class="componentClass">
    <label :for="labelName">
      {{ labelName }}
      <input
        :value="modelValue"
        type="text"
        :name="labelName"
        :placeholder="placeholder"
        :class="elementClass"
        @input="onInput"
      />
    </label>
  </div>
</template>
