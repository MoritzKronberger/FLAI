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
      <span v-if="streak" class="day-counter heading-medium">{{ streak }}</span>
    </div>
    <div class="hot-streak-item">
      <span class="day-text body-normal">{{
        `${!streak ? 'Keine' : ''} Tag${
          (streak ?? 0) === 1 ? '' : 'e'
        } in Folge`
      }}</span>
    </div>
  </div>
  <div v-if="longestStreak" class="streak-highscore">
    <p class="body-medium">Dein Highscore:</p>
    <p class="body-medium">
      {{
        `${longestStreak} Tag${(longestStreak ?? 0) === 1 ? '' : 'e'} in Folge`
      }}
    </p>
  </div>
</template>

<style scoped>
/** here place for import scss */
</style>
