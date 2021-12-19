<template>
  <nav>
    <span v-for="(menuItem, index) in menuItems" :key="index">
      <li>
        <a :href="menuItem.link">
          <span class="icon">{{ menuItem.icon }}</span>
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
          link: '#',
          icon: 'H',
          description: 'Home',
        },
        {
          link: '#',
          icon: 'T',
          description: 'Training',
        },
        {
          link: '#',
          icon: 'P',
          description: 'Profil',
        },
        {
          link: '#',
          icon: 'S',
          description: 'Lernstatistik',
        },
        {
          link: '#',
          icon: 'T',
          description: 'Tutorial',
        },
      ],
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
</style>
