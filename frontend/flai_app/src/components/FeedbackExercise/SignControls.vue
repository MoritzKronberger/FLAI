<template>
  <div class="sign-controls">
    <CustomButton
      label="<"
      :btnclass="[
        'back-button',
        'prim_extra_small_button_blue',
        index > 0 ? '' : 'inactive-button',
      ]"
      @click="decreaseIndex"
    />
    <span v-if="index > 0" class="lastLetter">{{
      signs[index - 1].name.toUpperCase()
    }}</span>
    <span class="currentLetter">{{ signs[index].name.toUpperCase() }}</span>
    <span v-if="index + 1 < signs.length" class="nextLetter">{{
      signs[index + 1].name.toUpperCase()
    }}</span>
    <CustomButton
      label=">"
      :btnclass="[
        'next-button',
        'prim_extra_small_button_blue',
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
