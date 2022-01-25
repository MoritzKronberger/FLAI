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
  <div :class="componentClass ?? 'default-labeled-input'">
    <label v-if="labelName" :for="labelName" class="body-medium">
      <div class="label">{{ labelName }}</div>
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
</style>
