<script setup lang="ts">
import { ref } from 'vue'
import IconLoader from '../IconLoader.vue'

defineProps<{
  viewName: string
  iconPath: string
  iconMimetype: string
  description: string
}>()
const show = ref(false)
const setShow = (newShow: boolean): void => {
  show.value = newShow
}
</script>

<template>
  <ul>
    <li @mouseover="setShow(true)" @mouseleave="setShow(false)">
      <router-link :to="{ name: viewName }">
        <span v-if="show">{{ description }}</span>
        <icon-loader
          :path="iconPath"
          :mimetype="iconMimetype"
          :alt="description"
          element-class="sidebar-icon"
        />
      </router-link>
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

.router-link-exact-active {
  border-left: 3px solid #4a7bf6;
  margin-right: 5px;
}
</style>
