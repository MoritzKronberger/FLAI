import moment, { Moment } from 'moment'
import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'
import exerciseData from './exercisedata'
import userdata from './userdata'

export interface UserStatistic {
  activeStreak: number | undefined
  longestStreak:
    | {
        streak: number
        start_day: string
        end_day: string
        user_id: string
      }
    | undefined
  exerciseCompletion: number | undefined
  bestExerciseSign: string | undefined
  timeLearntToday: string | undefined
}

export interface TrendsEntry {
  x: string
  y: number
}

export interface TrendsRow {
  day: string
  time_learnt: object
}

export type TrendsDataset = TrendsEntry[]

export interface Trends {
  end_day: Moment | undefined
  days: number
  dataset: TrendsDataset | undefined
}

const userStatistic: UserStatistic = reactive({
  activeStreak: undefined,
  longestStreak: undefined,
  exerciseCompletion: undefined,
  bestExerciseSign: undefined,
  timeLearntToday: undefined,
})

const trends: Trends = {
  end_day: undefined,
  days: 7,
  dataset: undefined,
}

const methods = {
  changeUserStatistic(newStatistic: UserStatistic) {
    Object.assign(userStatistic, newStatistic)
    console.log(userStatistic)
  },
  changeTrends(
    trendsData: { status: number; data: any },
    endDay: string,
    dateFormat = 'YYYY-MM-DD'
  ) {
    // create a datset with trends.days days ending on endDay as x and an initial y (time_learnt) of 0
    const endDate = moment(endDay)
    const baseDataset: TrendsDataset = []
    for (let i = 0; i < trends.days; i++) {
      const x = endDate.subtract(1, 'days').format(dateFormat).toString()
      baseDataset.push({ x: x, y: 0 })
    }

    // convert the fetched rows into the TrendsDataset type and match the date formatting
    if (trendsData.data.rows) {
      const trendsDataDataset: TrendsDataset = (
        trendsData.data.rows as TrendsRow[]
      ).map((entry) => {
        return {
          x: moment(entry.day).format(dateFormat).toString(),
          y: moment.duration(entry.time_learnt).asMinutes(),
        } as TrendsEntry
      })

      // find the entries where the day matches the database row and replace them with the row
      // from https://stackoverflow.com/a/37585362/14906871
      const dataset = baseDataset.map(
        (entry) => trendsDataDataset.find((e) => e.x === entry.x) || entry
      )

      trends.dataset = dataset
      console.log(trends.dataset)
    }
  },
  changeTrendsEndDay(endDay: Moment) {
    trends.end_day = endDay
  },
}

const actions = {
  async getUserStatistic() {
    const userId = userdata.user.id
    const exerciseId = exerciseData.exercises[0].id
    const today = moment().format('YYYY-MM-DD')

    const activeStreakData = await jsonAction({
      method: 'get',
      url: 'statistic/active_streak',
      data: { user_id: userId },
    })
    const longestStreakData = await jsonAction({
      method: 'get',
      url: 'statistic/longest_streak',
      data: { user_id: userId },
    })
    const exerciseCompletionData = await jsonAction({
      method: 'get',
      url: 'statistic/exercise_completion',
      data: { user_id: userId, exercise_id: exerciseId },
    })
    const bestExerciseSignData = await jsonAction({
      method: 'get',
      url: 'statistic/best_exercise_sign',
      data: { user_id: userId, exercise_id: exerciseId },
    })
    const timeLearntTodayData = await jsonAction({
      method: 'get',
      url: 'statistic/time_learnt_by_day',
      data: { user_id: userId, day: today.toString() },
    })
    const trendsData = await jsonAction({
      method: 'get',
      url: 'statistic/trends',
      data: {
        user_id: userId,
        end_day: trends.end_day ?? today.toString(),
        days: trends.days,
      },
    })

    const newUserStatistic: UserStatistic = {
      activeStreak: activeStreakData.data.rows?.[0].streak,
      longestStreak: { ...longestStreakData.data.rows?.[0] },
      exerciseCompletion:
        exerciseCompletionData.data.rows?.[0].progress_completion,
      bestExerciseSign: bestExerciseSignData.data.rows?.[0].sign_name,
      timeLearntToday: timeLearntTodayData.data.rows?.[0].time_learnt,
    }

    methods.changeUserStatistic(newUserStatistic)
    methods.changeTrends(trendsData, today)
  },
}

const statisticdata = {
  userStatistic: readonly(userStatistic) as UserStatistic,
  methods,
  actions,
}

export default statisticdata
