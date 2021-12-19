<script setup lang="ts">
import MenuItems from './MenuItems.vue'

const menuItems = [
  {
    link: '#home',
    icon: 'H',
    description: 'Home',
    state: true,
  },
  {
    link: '#training',
    icon: 'T',
    description: 'Training',
    state: false,
  },
  {
    link: '#profile',
    icon: 'P',
    description: 'Profil',
    state: false,
  },
  {
    link: '#stats',
    icon: 'S',
    description: 'Lernstatistik',
    state: false,
  },
  {
    link: '#tutorial',
    icon: 'T',
    description: 'Tutorial',
    state: false,
  },
]
</script>

<template>
  <nav>
    <span v-for="(menuItem, index) in menuItems" :key="index">
      <MenuItems
        :link="menuItem.link"
        :icon="menuItem.icon"
        :description="menuItem.description"
        :state="menuItem.state"
      />
    </span>
  </nav>
</template>

<style scoped></style>
