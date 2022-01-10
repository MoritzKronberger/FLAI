<script setup lang="ts">
defineProps<{
  labelName?: string
  placeholder: string
  elementClass: string
  componentClass?: string
  customType?: string
  timeStep?: number
  modelValue: string | number | undefined
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
        :type="customType ? customType : 'text'"
        :name="labelName"
        :placeholder="placeholder"
        :class="elementClass"
        :step="timeStep"
        @input="onInput"
      />
    </label>
  </div>
</template>
<style scoped lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/components/_inputField.scss';
.email {
  width: 300px;
}
.input {
  margin-bottom: 10px;
}
</style>
