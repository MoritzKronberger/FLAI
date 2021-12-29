<template>
  <div @click="isOpen = !isOpen">
    <button>
      {{ title }}
    </button>
    <div v-if="isOpen">
      <div v-for="(item, i) in items" :key="i">
        <button @click="$emit('clicked')">{{ item }}</button>
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
    method: {
      type: Function,
      default: () => [],
    },
  },

  emits: ['clicked'],

  data() {
    return {
      isOpen: false,
    }
  },
})
</script>

<style></style>
