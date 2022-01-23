<script setup lang="ts">
import customButton from '../../components/CustomButton.vue'
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
  TooltipItem,
  ChartType,
} from 'chart.js'
import { DurationInputArg1, DurationInputArg2 } from 'moment'
import moment from 'moment'

Chart.register(BarController, CategoryScale, LinearScale, BarElement)

const trends = computed(() => store.statisticdata.trends)
const dailyTarget = computed(() => store.userdata.user.target_learning_time)
const date = computed(() => store.statisticdata.trends.end_day)
const barChart = ref()

const changeDay = store.statisticdata.methods.changeTrendsEndDayByInterval

const changeWeek = async (
  method: string,
  interval: DurationInputArg1,
  intervaltype: DurationInputArg2
) => {
  changeDay(method, interval, intervaltype)
  await store.statisticdata.actions.updateTrendsData()
}

const timeAsMinutes = () => {
  return moment.duration(dailyTarget.value).asMinutes()
}

const data = computed(() => ({
  labels: trends.value.dataset?.labels,
  datasets: [
    {
      data: trends.value.dataset?.values ?? [0],
      backgroundColor: ['rgb(74, 123, 264)'],
      hoverBackgroundColor: ['rgb(74, 123, 264)'],
      borderWidth: 1,
      borderRadius: 5,
    },
  ],
}))

const options = computed(() => ({
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
        callback: function (value: number) {
          return value + ' min'
        },
        font: {
          size: 10,
          family: 'Gotham SSm',
        },
      },
    },
  },
  plugins: {
    autocolors: false,
    tooltip: {
      callbacks: {
        label(tooltipItems: TooltipItem<ChartType>) {
          const value = parseFloat(tooltipItems.formattedValue)
          return `${Math.floor(value)} min`
        },
      },
      title: ' min',
      titleAlign: 'right',
    },
    annotation: {
      annotations: {
        daily_target: {
          type: 'line',
          yMin: timeAsMinutes(),
          yMax: timeAsMinutes(),
          borderColor: 'rgb(74, 123, 264)',
          borderWidth: 2,
          borderDash: [5, 5],
        },
      },
    },
  },
  responsive: true,
}))
</script>

<template>
  <div>
    <div id="week">
      <custom-button
        label="<"
        btnclass="week_trends_button"
        @button-click="changeWeek('subtract', 1, 'weeks')"
      />
      <span class="body-medium month"
        >{{
          moment(date)
            .clone()
            .subtract(trends.days - 1, 'days')
            .format('DD.MM.YYYY') + ' bis '
        }}
      </span>
      <span class="body-medium">{{ moment(date).format('DD.MM.YYYY') }}</span>
      <custom-button
        label=">"
        btnclass="week_trends_button"
        @button-click="changeWeek('add', 1, 'weeks')"
      />
    </div>
    <BarChart
      ref="barChart"
      :chart-data="data"
      :options="options"
      css-classes="chart-container"
    />
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';
@import '../../assets/scss/components/buttonMixins';
@import '../../assets/scss/components/statistic/trend_diagram';
</style>
