<template>
  <VButton label="zurück" btnclass="controls" @click="decreaseIndex" />
  <span>{{ signs[index].name.toUpperCase() }}</span>
  <VButton label="weiter" btnclass="controls" @click="increaseIndex" />
  <br />
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef } from 'vue'
import { Sign } from '../../store/signdata'
import VButton from './../vbutton.vue'

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
