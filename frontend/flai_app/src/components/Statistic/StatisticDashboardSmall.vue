<template>
  <div class="statistic-dashboard-small">
    <div class="grid-cards">
      <div class="child-card">
        <card-small
          :statistic-value="`${Math.round(
            moment.duration(timeLearnt).asMinutes()
          )} min`"
          link-target="ComingSoon"
          statistic-text="heute gelernt"
          :progress="
            Math.min(
              Math.round(moment.duration(timeLearnt).asMinutes()) /
                Math.round(moment.duration(targetTime).asMinutes()),
              1
            )
          "
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
          :progress="exerciseCompletion ? +exerciseCompletion.toFixed(2) : 0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import store from '../../store'
import CardSmall from './CardSmall.vue'
import moment from 'moment'

const timeLearnt = computed(
  () => store.statisticdata.userStatistic.timeLearntToday
)
const currentExercise = computed(() => store.exercisedata.exercises?.[0]?.name)
const bestSign = computed(
  () => store.statisticdata.userStatistic.bestExerciseSign
)
const exerciseCompletion = computed(
  () => store.statisticdata.userStatistic.exerciseCompletion
)
const targetTime = computed(() => store.userdata.user.target_learning_time)
</script>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
</style>
