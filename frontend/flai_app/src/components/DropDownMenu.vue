<template>
  <div class="menu" @click="isOpen = !isOpen">
    <span class="dropDownMenu">
      {{ title }}
    </span>
    <ul v-if="isOpen">
      <li
        v-for="item in items"
        :key="item"
        class="dropDownMenu"
        @click="emit('clickElement', item.value)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DropDown } from '.console./ressources/ts/interfaces'

const props = defineProps<{ title: string; items: DropDown[] }>()

const isOpen = ref(false)

const emit = defineEmits(['clickElement'])
</script>

<style>
.menu {
  border: 1px solid black;
  min-width: 5%;
}
.dropDownMenu {
  margin: 0;
  padding: 1px;
  cursor: pointer;
}
ul {
  margin: 0;
  padding: 0;
}
li {
  margin: 0;
  padding: 1px;
  list-style: none;
}
</style>
