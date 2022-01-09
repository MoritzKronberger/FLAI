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

const _class = 'custom-aside'
</script>

<template>
  <div v-if="isAuth">
    <aside :class="_class">
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
  <main>
    <router-view />
  </main>
</template>

<style scoped lang="scss">
.flex-view {
  display: inline;
}
.custom-aside {
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
