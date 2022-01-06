<script setup lang="ts">
import { inject, computed, ref } from 'vue'
import StatisticDashboardSmall from '../components/Statistic/StatisticDashboardSmall.vue'
import StatisticDashboardLarge from '../components/Statistic/StatisticDashboardLarge.vue'
import customButton from '../components/CustomButton.vue'
import IconLoader from '../components/IconLoader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const store: any = inject('store')
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
    <div>
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
    <div>
      <IconLoader
        :path="`/assets/icons/levels/level_${level}`"
        mimetype="svg"
        alt="Level Icon"
        element-class="level-icon"
      />
      <div>Level {{ level }}</div>
    </div>
    <StatisticDashboardSmall />
    <StatisticDashboardLarge />
  </div>
</template>

<style>
h2 {
  font-weight: 200;
}
p {
  margin: 0;
}
.row {
  display: flex;
}
.row img {
  margin: 0 1vw;
  height: 30vh;
  border-radius: 3vw;
}
.statistic {
  margin: 1vw;
  padding: 3vh 1vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: lightblue;
  border-radius: 2vw;
  text-align: center;
}
.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: yellow;
  margin: auto;
  margin-bottom: 2vh;
  height: 10vh;
  width: 10vh;
  border-radius: 50%;
}
.number {
  margin: auto;
  width: 100%;
  font-size: 5vh;
}
</style>
