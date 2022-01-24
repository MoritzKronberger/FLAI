<template>
  <div class="sign-controls">
    <CustomButton
      label="<"
      :btnclass="[
        'back-button',
        'prim_small_button_blue',
        index > 0 ? '' : 'inactive-button',
      ]"
      @click="decreaseIndex"
    />
    <span class="letter lastLetter">{{
      index > 0 ? signs[index - 1].name.toUpperCase() : ''
    }}</span>
    <span class="letter currentLetter">{{
      signs[index].name.toUpperCase()
    }}</span>
    <span class="letter nextLetter">{{
      index + 1 < signs.length ? signs[index + 1].name.toUpperCase() : ''
    }}</span>
    <CustomButton
      label=">"
      :btnclass="[
        'next-button',
        'prim_small_button_blue',
        index + 1 < signs.length ? '' : 'inactive-button',
      ]"
      @click="increaseIndex"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sign } from '../../store/signdata'
import CustomButton from '../CustomButton.vue'

const props = defineProps<{ signs: Sign[] }>()

const index = ref(0)

const emit = defineEmits(['new-index'])

function decreaseIndex() {
  index.value = index.value > 1 ? index.value - 1 : 0
  emit('new-index', index.value)
}
function increaseIndex() {
  index.value =
    index.value < props.signs.length - 1
      ? index.value + 1
      : props.signs.length - 1
  emit('new-index', index.value)
}
</script>

<style lang="scss">
@import '../../assets/scss/main.scss';
</style>
