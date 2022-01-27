<script setup lang="ts">
import { ref } from 'vue'
import CustomButton from './CustomButton.vue'

const props =
  defineProps<{ labels: string[]; btnclass: string; componentClass?: string }>()
const emit = defineEmits(['buttonClick'])

const activeButton = ref(0)
const hovering = ref(false)

function onclick(label: string | undefined) {
  if (label) {
    activeButton.value = props.labels.indexOf(label)
    emit('buttonClick', label)
  }
}
</script>

<template>
  <div :class="btnclass">
    <custom-button
      v-for="(label, index) of labels"
      :key="label"
      :label="label"
      :btnclass="`${
        index === activeButton && !hovering ? 'switch-button-active ' : ''
      }${
        index === 0
          ? 'switch-button-left'
          : index === labels.length - 1
          ? 'switch-button-right'
          : 'switch-button-mid'
      } ${hovering ? 'hovering' : ''}`"
      :switch="true"
      @button-click="onclick"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    />
  </div>
</template>

<style scoped lang="scss">
@import '../assets/scss/main.scss';
</style>
