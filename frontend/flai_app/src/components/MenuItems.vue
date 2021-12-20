<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  link: String,
  icon: String,
  description: String,
  state: Boolean,
})
const show = ref()
</script>

<template>
  <ul>
    <li @mouseover="show = true" @mouseleave="show = false">
      <span v-if="state" class="active"></span>
      <a :href="link">
        <span class="icon">{{ icon }}</span>
        <span v-if="show">{{ description }}</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
li {
  padding-left: 15px;
  text-align: left;
  list-style-type: none;
}

a {
  color: black;
  text-decoration: none;
}

.icon {
  margin-right: 25px;
}

span.active {
  border: 2px solid #4a7bf6;
  margin-right: 5px;
}
</style>
