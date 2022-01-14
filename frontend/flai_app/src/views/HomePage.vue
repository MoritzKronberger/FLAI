<script setup lang="ts">
import { computed, ref } from 'vue'
import StatisticDashboardSmall from '../components/Statistic/StatisticDashboardSmall.vue'
import StatisticDashboardLarge from '../components/Statistic/StatisticDashboardLarge.vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import { useRouter } from 'vue-router'
import store from '../store'
import Register from './RegisterPage.vue'
import LoginPage from './LoginPage.vue'
const router = useRouter()

const user = computed(() => store.userdata.user)
const auth = computed(() => store.authdata.auth)

const redirect = (viewName: string) => router.push({ name: viewName })
const level = ref(1)

const showRegister = ref(false)
const showLogin = ref(false)
</script>

<template>
  <div v-if="!auth.isAuth" class="landing-page">
    <div class="main">
      <div class="heading-large">Wilkommen bei FLAI!</div>
      <div class="heading-medium">
        Lerne mithilfe unserer AI die Grundlagen deutscher Gebärdensprache.
      </div>
      <!--<div class="register">
        <custom-button
          label="Konto erstellen"
          btnclass="prim_small_button_blue"
          @button-click="redirect('RegisterPage')"
        />
      </div>-->
      <div class="register">
        <custom-button
          label="Konto erstellen"
          btnclass="prim_small_button_blue"
          @button-click="showRegister = true"
        />
      </div>
      <div v-show="showRegister" class="modal" @click="showRegister = false">
        <Register @click.stop />
      </div>
      <div class="login">
        Du hast bereits ein Konto?
        <span id="login" @click="showLogin = true">Login</span>
      </div>
      <div v-show="showLogin" class="modal" @click="showLogin = false">
        <LoginPage @click.stop />
      </div>
    </div>
  </div>
  <div v-if="auth.isAuth" class="home-page">
    <div class="dashboard">
      <div class="start-panel">
        <h2 class="heading-medium">Hallo, {{ user.username }}!</h2>
        <div class="start-panel-text">
          <div class="body-small">Willkommen zurück!</div>
          <div class="body-small">
            Bereit für die heutige <br />
            Aufgabe?
          </div>
        </div>
        <custom-button
          label="Start"
          btnclass="prim_small_button_blue"
          @button-click="redirect('ComingSoon')"
        />
        <IconLoader
          path="/assets/logos/hand.svg"
          alt="Start Panel Background Image"
          element-class="flai-startpanel-icon"
        />
      </div>
      <div class="level-panel">
        <IconLoader
          :path="`/assets/icons/levels/level_${level}.svg`"
          alt="Level Icon"
          element-class="level-icon"
        />
        <div class="heading-small level-text">Level {{ level }}</div>
      </div>
      <div class="stats-small-panel">
        <StatisticDashboardSmall />
      </div>
      <div class="stats-large-panel">
        <StatisticDashboardLarge />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/scss/main.scss';
@import '../assets/scss/components/startpanel';

#login {
  cursor: pointer;
  color: $main-blue;
}
</style>
