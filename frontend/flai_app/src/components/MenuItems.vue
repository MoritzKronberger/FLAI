<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  link: String,
  icon: String,
  description: String,
  state: Boolean,
})
const show = ref(props.state)
</script>

<template>
  <li @mouseover="show = true" @mouseleave="show = false">
    <hr v-if="state" class="active" />
    <a :href="link">
      <span class="icon">{{ icon }}</span>
      <span v-if="show">{{ description }}</span>
    </a>
  </li>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
}

li {
  padding-left: 20px;
  padding-bottom: 50px;
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

.active {
  border: 2px solid black;
}
</style>
