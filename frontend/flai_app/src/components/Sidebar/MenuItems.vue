<script setup lang="ts">
import { ref } from 'vue'
import IconLoader from '../IconLoader.vue'

defineProps<{
  viewName: string
  iconPath: string
  iconMimetype: string
  flyoutText: string
  iconAltText: string
}>()
const show = ref(false)
const setShow = (newShow: boolean): void => {
  show.value = newShow
}
</script>

<template>
  <div @mouseover="setShow(true)" @mouseleave="setShow(false)">
    <router-link :to="{ name: viewName }">
      <icon-loader
        :path="iconPath"
        :mimetype="iconMimetype"
        :alt="iconAltText"
        element-class="sidebar-icon"
      />
      <span v-if="show" class="sidebar-flyout">{{ flyoutText }}</span>
    </router-link>
  </div>
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
