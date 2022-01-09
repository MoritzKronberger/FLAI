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
          path="/assets/logos/faces"
          mimetype="svg"
          alt="FLAI Icon"
          element-class="flai-header-icon"
        />
      </router-link>
      <SidebarMenu />
      <custom-button
        label="Logout"
        btnclass="button-logout"
        @button-click="logoutUser"
      />
    </aside>
  </div>
  <main :class="classState.main">
    <router-view />
  </main>
</template>

<style scoped lang="scss">
.display-aside {
  width: 15%;
  height: 100%;
  background-color: white;
  position: fixed;
  padding-left: 2%;
  padding-right: 2%;
  @media (max-width: 768px) {
    width: 100%;
    position: relative;
  }
}

.hidden {
  display: none;
}

.main-login-register-lection {
  width: 100%;
}

.main-home-profile {
  float: right;
  width: 85%;
  @media (max-width: 768px) {
    width: 100%;
  }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
a {
  text-decoration: none;
}
</style>
