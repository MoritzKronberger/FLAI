<script setup lang="ts">
import { computed } from 'vue'
import store from '../../store'
import IconLoader from '../IconLoader.vue'

const streak = computed(() => store.statisticdata.userStatistic.activeStreak)
const longestStreak = computed(
  () => store.statisticdata.userStatistic.longestStreak?.streak
)
</script>

<template>
  <div class="hot-streak">
    <div class="hot-streak-item">
      <IconLoader
        :path="`/assets/icons/FLAI_Flamme${!streak ? '_BW' : ''}.svg`"
        alt="Streak Icon"
        element-class="streak-icon"
      />
    </div>
    <div class="hot-streak-item">
      <span
        :class="[streak ?? 0 ? 'orange' : '', 'day-counter', 'heading-small']"
        >{{ streak ? streak : '0' }}</span
      >
    </div>
    <div class="hot-streak-item">
      <span class="day-text heading-small">{{
        `Tag${(streak ?? 0) === 1 ? '' : 'e'} in Folge`
      }}</span>
    </div>
  </div>
  <div v-if="longestStreak" class="body-medium counter">
    Längste Folge am Stück:
    <div class="days body-emphasised">
      {{ `${longestStreak} Tag${(longestStreak ?? 0) === 1 ? '' : 'e'}` }}
    </div>
  </div>
</template>

<style scoped>
/** here place for import scss */
</style>
