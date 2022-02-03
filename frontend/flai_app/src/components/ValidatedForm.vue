<template>
  <div
    :class="`${
      errorMessageClass
        ? errorMessageClass
        : 'error-message-right-align body-small'
    }`"
  >
    <div v-for="err in errorMessage" :key="err">
      {{ err }}
    </div>
  </div>
  <form>
    <slot name="inputs"></slot>
    <div
      :class="`${
        buttonContainer ? buttonContainer : 'button-container-forms body-small'
      }`"
    >
      <custom-button
        :label="submitName"
        btnclass="prim_small_button_blue"
        @button-click="emit('submit')"
      />
      <slot name="additional-buttons"></slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import customButton from '../components/CustomButton.vue'

defineProps<{
  errorMessage: string[]
  submitName: string
  buttonContainer?: string
  errorMessageClass?: string
}>()

const emit = defineEmits(['submit'])
</script>
