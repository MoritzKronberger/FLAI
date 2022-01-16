<script setup lang="ts">
import { computed } from 'vue'
import store from '../../store'
import CardSmall from './CardSmall.vue'
import moment from 'moment'

const timeLearnt = computed(
  () => store.statisticdata.userStatistic.timeLearntToday
)
const currentExercise = computed(() => store.exercisedata.exercises[0].name)
const bestSign = computed(
  () => store.statisticdata.userStatistic.bestExerciseSign
)
const exerciseCompletion = computed(
  () => store.statisticdata.userStatistic.exerciseCompletion
)
</script>

<template>
  <div class="statistic-dashboard-small">
    <h4 class="heading-small">Statistiken</h4>
    <div class="grid-cards">
      <div class="child-card">
        <card-small
          :statistic-value="`${Math.round(
            moment.duration(timeLearnt).asMinutes()
          )} Min`"
          link-target="ComingSoon"
          statistic-text="heute gelernt"
        />
      </div>
      <div class="child-card">
        <card-small
          :statistic-value="bestSign ? bestSign.toUpperCase() : '-'"
          link-target="ComingSoon"
          :statistic-text="`beste Gebärde aus ${currentExercise}`"
        />
      </div>
      <div class="child-card">
        <card-small
          :statistic-value="`${
            exerciseCompletion ? Math.round(exerciseCompletion * 100) : 0
          }%`"
          link-target="ComingSoon"
          :statistic-text="`von ${currentExercise} abgeschlossen`"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
