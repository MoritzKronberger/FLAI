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

const switchClass = () => {
  const path = router.currentRoute.value.path
  if ((path === '/' || path === '/profile') && isAuth.value === true) {
    return { aside: 'display-aside', main: 'main-home-profile' }
  } else {
    return { aside: 'hidden', main: 'main-login-register-lection' }
  }
}

const classState = computed(() => switchClass())
</script>

<template>
  <div v-if="isAuth">
    <aside :class="classState.aside">
      <router-link :to="{ name: 'HomePage' }">
        <IconLoader
          path="/assets/logos/logo.svg"
          alt="FLAI Icon"
          element-class="flai-header-icon"
        />
      </router-link>
      <SidebarMenu />
      <custom-button
        label="Logout"
        btnclass="sec_small_button_orange logout"
        @button-click="logoutUser"
      />
    </aside>
  </div>
  <main :class="classState.main">
    <router-view />
  </main>
</template>

<style scoped lang="scss">
@import './assets/scss/main.scss';
</style>
