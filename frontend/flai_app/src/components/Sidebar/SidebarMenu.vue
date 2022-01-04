<script setup lang="ts">
import MenuItems from './MenuItems.vue'

declare interface MenuItem {
  viewName: string
  iconPath: string
  description: string
}
const menuItems: MenuItem[] = [
  {
    viewName: 'HomePage',
    iconPath: '../assets/icons/home',
    description: 'Home',
  },
  {
    viewName: 'LearningExercise',
    iconPath: '../assets/icons/lections',
    description: 'Training',
  },
  {
    viewName: 'ShowStore',
    iconPath: '../assets/icons/profile',
    description: 'Profil',
  },
]
</script>

<template>
  <nav>
    <span v-for="(menuItem, index) in menuItems" :key="index">
      <MenuItems
        :view-name="menuItem.viewName"
        :icon-path="menuItem.iconPath"
        icon-mimetype="svg"
        :description="menuItem.description"
      />
    </span>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
}
</style>
