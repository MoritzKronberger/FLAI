<script setup lang="ts">
import { computed, ref } from 'vue'
import StatisticDashboardSmall from '../components/Statistic/StatisticDashboardSmall.vue'
import StatisticDashboardLarge from '../components/Statistic/StatisticDashboardLarge.vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import { useRouter } from 'vue-router'
import store from '../store'
import TestFont from './TestFont.vue'

const router = useRouter()

const user = computed(() => store.userdata.user)
const auth = computed(() => store.authdata.auth)

const redirect = (viewName: string) => router.push({ name: viewName })
const level = ref(1)
</script>

<template>
  <div v-if="!auth.isAuth" class="landing-page">
    <TestFont />
    <!--<div>Wilkommen bei FLAI!</div>
    <div>
      Lerne mithilfe unserer AI die Grundlagen deutscher Gebärdensprache.
    </div>
    <custom-button
      label="Konto erstellen"
      btnclass="button-primary"
      @button-click="redirect('RegisterPage')"
    />
    <div>
      Du hast bereits ein Konto?<router-link to="/login">Login</router-link>
    </div>-->
  </div>
  <div v-if="auth.isAuth" class="home-page">
    <div class="dashboard">
      <div class="start-panel">
        <h2>
          Hallo, <b>{{ user.username }}!</b>
        </h2>
        <div>Willkommen zurück!</div>
        <div>Bereit für die heutige Aufgabe?</div>
        <custom-button
          label="Start"
          btnclass="button-primary"
          @button-click="redirect('ComingSoon')"
        />
      </div>
      <div class="level-panel">
        <IconLoader
          :path="`../assets/icons/levels/level_${level}`"
          mimetype="svg"
          alt="Level Icon"
          element-class="level-icon"
        />
        <div>Level {{ level }}</div>
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
</style>
