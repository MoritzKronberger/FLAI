<script setup lang="ts">
defineProps<{
  labelName: string
  placeholder: string
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])

const onInput = (e: Event): void => {
  // emit is placed in method so that validation for input value can be added
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div>
    <label :for="labelName">
      {{ labelName }}
      <input
        :value="modelValue"
        type="text"
        :name="labelName"
        :placeholder="placeholder"
        @input="onInput"
      />
    </label>
  </div>
</template>
