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
  console.log(e.target)
}
</script>

<template>
  <div>
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
  </div>
</template>
