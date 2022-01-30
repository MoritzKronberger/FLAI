<script setup lang="ts">
import customButton from '../components/CustomButton.vue'

defineProps<{
  errorMessage: string[]
  componentClass: string
  submitName: string
}>()

const emit = defineEmits(['submit'])
</script>

<template>
  <div :class="componentClass + ' body-small'">
    <div v-for="err in errorMessage" :key="err">
      {{ err }}
    </div>
  </div>
  <form>
    <slot name="inputs"></slot>
    <div class="button-container">
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
