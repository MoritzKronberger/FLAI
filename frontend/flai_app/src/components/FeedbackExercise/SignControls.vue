<template>
  <CustomButton
    v-if="index > 0"
    label="<"
    btnclass="controls"
    @click="decreaseIndex"
  />
  <span v-if="index > 0">{{ signs[index - 1].name.toUpperCase() }}</span>
  <span class="currentLetter">{{ signs[index].name.toUpperCase() }}</span>
  <span v-if="index + 1 < signs.length">{{
    signs[index + 1].name.toUpperCase()
  }}</span>
  <CustomButton
    v-if="index + 1 < signs.length"
    label=">"
    btnclass="controls"
    @click="increaseIndex"
  />
  <br />
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

<style scoped>
.currentLetter {
  font-weight: 800;
  font-size: 20px;
}
</style>
