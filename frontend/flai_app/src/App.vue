<script setup lang="ts">
import store from './store'
import SidebarMenu from './components/Sidebar/SidebarMenu.vue'
import IconLoader from './components/IconLoader.vue'
import customButton from './components/CustomButton.vue'
import { computed, provide } from 'vue'

provide('store', store)

const logoutUser = store.authdata.methods.logoutUser
const isAuth = computed(() => store.authdata.auth.isAuth)
</script>

<template>
  <header>
    <router-link :to="{ name: 'HomePage' }">
      <IconLoader
        path="../assets/flai_logo"
        mimetype="jpg"
        alt="FLAI Icon"
        element-class="flai-header-icon"
      />
    </router-link>
  </header>
  <main>
    <router-view />
  </main>
  <aside v-if="isAuth">
    <SidebarMenu />
    <custom-button
      label="Logout"
      btnclass="button-primary"
      @button-click="logoutUser"
    />
  </aside>
</template>

<style>
main {
  margin-left: 20%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
a {
  margin: 1%;
  text-decoration: none;
}
</style>
