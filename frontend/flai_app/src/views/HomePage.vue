<script setup lang="ts">
import { computed, ref } from 'vue'
import StatisticDashboardSmall from '../components/Statistic/StatisticDashboardSmall.vue'
import StatisticDashboardLarge from '../components/Statistic/StatisticDashboardLarge.vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import { useRouter } from 'vue-router'
import store from '../store'

const router = useRouter()

const user = computed(() => store.userdata.user)
const auth = computed(() => store.authdata.auth)

const redirect = (viewName: string) => router.push({ name: viewName })
const level = ref(1)
</script>

<template>
  <div v-if="!auth.isAuth" class="landing-page">
    <div>Wilkommen bei FLAI!</div>
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
@import '../assets/scss/components/startpanel';
</style>
