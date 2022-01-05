<script setup lang="ts">
import MenuItems from './MenuItems.vue'

declare interface MenuItem {
  viewName: string
  iconPath: string
  flyoutText: string
  iconAltText: string
}
const menuItems: MenuItem[] = [
  {
    viewName: 'HomePage',
    iconPath: '../assets/icons/home',
    flyoutText: 'Home',
    iconAltText: 'Home icon',
  },
  {
    viewName: 'LearningExercise',
    iconPath: '../assets/icons/lections',
    flyoutText: 'Lektionen',
    iconAltText: 'Lektionen Icon',
  },
  {
    viewName: 'ProfilePage',
    iconPath: '../assets/icons/profile',
    flyoutText: 'Konto',
    iconAltText: 'Konto Icon',
  },
]
</script>

<template>
  <nav>
    <MenuItems
      v-for="(menuItem, index) in menuItems"
      :key="index"
      :view-name="menuItem.viewName"
      :icon-path="menuItem.iconPath"
      icon-mimetype="svg"
      :flyout-text="menuItem.flyoutText"
      :icon-alt-text="menuItem.iconAltText"
    />
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
