<script setup lang="ts">
import { computed, ref } from 'vue'
import StatisticDashboardSmall from '../components/Statistic/StatisticDashboardSmall.vue'
import StatisticDashboardLarge from '../components/Statistic/StatisticDashboardLarge.vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import { useRouter } from 'vue-router'
import store from '../store'
import LandingPage from './LandingPage.vue'
const router = useRouter()

const auth = computed(() => store.authdata.auth)
const username = computed(() => store.userdata.user.username)

const redirect = (viewName: string) => router.push({ name: viewName })
const level = ref(1)
</script>

<template>
  <div v-if="!auth.isAuth">
    <LandingPage />
  </div>
  <div v-if="auth.isAuth" class="home-page">
    <div class="dashboard">
      <div class="start-panel">
        <p class="heading-medium">Willkommen {{ username }}!</p>
        <br />
        <p class="body-medium">
          Bereit für die heutige <br />
          Aufgabe?
        </p>
        <custom-button
          label="Start"
          btnclass="prim_medium_button_orange"
          @button-click="redirect('LearningExercise')"
        />
      </div>
      <div class="level-panel">
        <div class="heading-medium">Lernfortschritt</div>
        <IconLoader
          :path="`/assets/icons/levels/level_${level}.svg`"
          alt="Level Icon"
          element-class="level-icon"
        />
        <div class="heading-medium level-text">Level {{ level }}</div>
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
@import '../assets/scss/components/levelpanel';
</style>
