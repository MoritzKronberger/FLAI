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

const userStatistic: UserStatistic = reactive({
  activeStreak: undefined,
  longestStreak: undefined,
  exerciseCompletion: undefined,
  bestExerciseSign: undefined,
  timeLearntToday: undefined,
})

const methods = {
  changeUserStatistic(newStatistic: UserStatistic) {
    Object.assign(userStatistic, newStatistic)
    console.log(userStatistic)
  },
}

const actions = {
  async getUserStatistic() {
    const userId = userdata.user.id
    const exerciseId = exerciseData.exercises[0].id
    const today = new Date().toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

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
      data: { user_id: userId, day: today },
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
  },
}

const statisticdata = {
  userStatistic: readonly(userStatistic) as UserStatistic,
  methods,
  actions,
}

export default statisticdata
