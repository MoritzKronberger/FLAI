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
    iconPath: '/assets/icons/FLAI_Home.svg',
    flyoutText: 'Home',
    iconAltText: 'Home icon',
  },
  {
    viewName: 'LearningExercise',
    iconPath: '/assets/icons/FLAI_Lektionen.svg',
    flyoutText: 'Lektionen',
    iconAltText: 'Lektionen Icon',
  },
  {
    viewName: 'ProfilePage',
    iconPath: '/assets/icons/FLAI_Profil.svg',
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
      :flyout-text="menuItem.flyoutText"
      :icon-alt-text="menuItem.iconAltText"
    />
  </nav>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
