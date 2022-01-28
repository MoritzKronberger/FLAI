<script setup lang="ts">
defineProps<{
  labelName?: string
  elementClass: string
  modelValue: boolean | undefined
  componentClass?: string
  checkmarkClass?: string
  disabled: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const onInput = (e: Event): void => {
  // emit is placed in method so that validation for input value can be added
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}
</script>

<template>
  <div :class="componentClass">
    <label :for="labelName">
      <div>
        <input
          :checked="modelValue"
          type="checkbox"
          :name="labelName"
          :class="elementClass"
          :disabled="disabled"
          @input="onInput"
        />
        <span :class="checkmarkClass"></span>
      </div>
      {{ labelName }}
    </label>
  </div>
</template>
<style scoped lang="scss">
@import '../assets/scss/components/_customCheckbox.scss';
.input {
  margin-bottom: 10px;
}
</style>
