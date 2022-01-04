<script setup lang="ts">
import MenuItems from './MenuItems.vue'

declare interface MenuItem {
  viewName: string
  iconPath: string
  description: string
  state: boolean
}
const menuItems: MenuItem[] = [
  {
    viewName: 'HomePage',
    iconPath: '../assets/icons/home',
    description: 'Home',
    state: true,
  },
  {
    viewName: 'LearningExercise',
    iconPath: '../assets/icons/lections',
    description: 'Training',
    state: false,
  },
  {
    viewName: 'ShowStore',
    iconPath: '../assets/icons/profile',
    description: 'Profil',
    state: false,
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
        :state="menuItem.state"
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
