<template>
  <div class="menu" @click="isOpen = !isOpen">
    <div class="dropDownMenu">
      {{ title }}
    </div>
    <div v-if="isOpen">
      <div v-for="(item, i) in items" :key="i">
        <div v-if="i === 0" class="dropDownMenu" @click="emit('first')">
          {{ item }}
        </div>
        <div v-if="i === 1" class="dropDownMenu" @click="emit('second')">
          {{ item }}
        </div>
        <div v-if="i === 2" class="dropDownMenu" @click="emit('third')">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ title: string; items: string[] }>()

const isOpen = ref(false)

const emit = defineEmits(['first', 'second', 'third'])
</script>

<style>
.menu {
  border: 1px solid black;
  min-width: 5%;
}
.dropDownMenu {
  cursor: pointer;
}
</style>
