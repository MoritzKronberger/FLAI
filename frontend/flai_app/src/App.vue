<template>
  <aside v-if="isAuth && router.currentRoute.value.name !== 'LearningExercise'">
    <div class="sidebar-container">
      <div class="sidebar-top">
        <router-link :to="{ name: 'HomePage' }">
          <IconLoader
            path="/assets/logos/logo.svg"
            alt="FLAI Icon"
            element-class="flai-header-icon"
          />
        </router-link>
        <SidebarMenu />
      </div>
      <custom-button
        label="Logout"
        btnclass="sec_medium_button_orange logout"
        @button-click="logoutUser"
      />
    </div>
  </aside>
  <main class="main-content">
    <router-view />
  </main>
</template>

<script setup lang="ts">
import store from './store'
import SidebarMenu from './components/Sidebar/SidebarMenu.vue'
import IconLoader from './components/IconLoader.vue'
import customButton from './components/CustomButton.vue'
import { computed, provide } from 'vue'
import { useRouter } from 'vue-router'

provide('store', store)
const router = useRouter()

const logoutUser = () => {
  store.authdata.methods.logoutUser()
  router.push({ name: 'HomePage' })
}
const isAuth = computed(() => store.authdata.auth.isAuth)
</script>

<style scoped lang="scss">
@import './assets/scss/main.scss';
</style>
