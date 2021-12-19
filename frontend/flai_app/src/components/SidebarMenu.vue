<template>
  <nav>
    <span v-for="(menuItem, index) in menuItems" :key="index">
      <li @mouseover="show = true" @mouseleave="show = false">
        <a :href="menuItem.link">
          <span class="icon">{{ menuItem.icon }}</span>
          <span v-if="show">{{ menuItem.description }}</span>
        </a>
      </li>
    </span>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SidebarMenu',

  data() {
    return {
      menuItems: [
        {
          link: '#home',
          icon: 'H',
          description: 'Home',
        },
        {
          link: '#training',
          icon: 'T',
          description: 'Training',
        },
        {
          link: '#profile',
          icon: 'P',
          description: 'Profil',
        },
        {
          link: '#stats',
          icon: 'S',
          description: 'Lernstatistik',
        },
        {
          link: '#tutorial',
          icon: 'T',
          description: 'Tutorial',
        },
      ],
      show: false,
    }
  },
})
</script>

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
</style>
