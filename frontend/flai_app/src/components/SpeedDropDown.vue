<template>
  <div @click="isOpen = !isOpen">
    <button>
      {{ title }}
    </button>
    <div v-if="isOpen">
      <div v-for="(item, i) in items" :key="i">
        <button v-if="i === 0" @click="$emit('first')">{{ item }}</button>
        <button v-if="i === 1" @click="$emit('second')">{{ item }}</button>
        <button v-if="i === 2" @click="$emit('third')">{{ item }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'SpeedDropdown',
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },

  emits: ['first', 'second', 'third'],

  data() {
    return {
      isOpen: false,
    }
  },
})
</script>

<style></style>
