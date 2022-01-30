<script setup lang="ts">
import customButton from '../components/CustomButton.vue'
import { toRefs } from 'vue'
const props = defineProps<{
  errorMessage: string[]
  submitName: string
  buttonContainer?: string
}>()

const { buttonContainer } = toRefs(props)
const buttonContainerClass = buttonContainer?.value
  ? buttonContainer.value
  : 'button-container-forms'

const emit = defineEmits(['submit'])
</script>

<template>
  <div class="error-message body-small">
    <div v-for="err in errorMessage" :key="err">
      {{ err }}
    </div>
  </div>
  <form>
    <slot name="inputs"></slot>
    <div :class="buttonContainerClass">
      <custom-button
        :label="submitName"
        btnclass="prim_small_button_blue"
        @button-click="emit('submit')"
      />
      <slot name="additional-buttons"></slot>
    </div>
  </form>
</template>
<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
