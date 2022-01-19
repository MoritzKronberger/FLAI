<script setup lang="ts">
import { BarChart } from 'vue-chart-3'
import '../../common/plugins/chart.ts'
import { ref, computed } from 'vue'
import store from '../../store'
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'

Chart.register(BarController, CategoryScale, LinearScale, BarElement)

const trends = computed(() => store.statisticdata.trends)

const date = trends.value.end_day

const data = computed(() => ({
  labels: trends.value.dataset?.labels,
  datasets: [
    {
      label: 'Minuten gelernt',
      data: trends.value.dataset?.values ?? [0],
    },
  ],
}))
const options = ref({
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
})
</script>

<template>
  <div>
    <div id="month">
      <span class="heading-small month">{{ date.format('MMMM') + ' ' }}</span>
      <span class="heading-small">{{ date.format('YYYY') }}</span>
    </div>
    <BarChart
      :chart-data="data"
      :options="options"
      css-classes="chart-container"
    />
  </div>
</template>

<style scoped>
/** here place for import scss */
</style>
