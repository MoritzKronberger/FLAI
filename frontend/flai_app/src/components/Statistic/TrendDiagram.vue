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
      data: trends.value.dataset?.values ?? [0],
      backgroundColor: ['rgb(74, 123, 264)'],
      borderWidth: 1,
      borderRadius: 5,
    },
  ],
}))

const options = ref({
  scales: {
    x: {
      reverse: true,
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
          family: 'Gotham SSm',
        },
      },
    },
    y: {
      ticks: {
        stepSize: 30,
        font: {
          size: 10,
          family: 'Gotham SSm',
        },
      },
    },
  },
  plugins: {
    autocolors: false,
    annotation: {
      annotations: {
        estimated_learning_time: {
          type: 'line',
          yMin: 32,
          yMax: 32,
          borderColor: 'rgb(74, 123, 264)',
          borderWidth: 2,
          borderDash: [5, 5],
        },
      },
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
