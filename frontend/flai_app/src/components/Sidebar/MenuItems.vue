<script setup lang="ts">
import IconLoader from '../IconLoader.vue'

defineProps<{
  viewName: string
  iconPath: string
  flyoutText: string
  iconAltText: string
}>()
</script>

<template>
  <div>
    <router-link :to="{ name: viewName }">
      <icon-loader
        :path="iconPath"
        :alt="iconAltText"
        element-class="sidebar-icon"
      />
      <span class="sidebar-flyout">{{ flyoutText }}</span>
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
