import { readonly, reactive } from 'vue'

export interface ExerciseSettings {
  id: string
  level: number
  maxProgress: number
  wordLength: number
  unlockedSigns: number
}

const exerciseSettings: ExerciseSettings = reactive({
  id: '',
  level: 0,
  maxProgress: 100,
  wordLength: 4,
  unlockedSigns: 0,
})

export interface Exercise {
  id: string
  name: string
  description: string
  firstStart: number
  lastStart: number
}

const exercises: Exercise[] = reactive([])

const methods = {
  //TODO: change methods to suit database
  changeExerciseSettingsWordLength(wordLength: number) {
    exerciseSettings.wordLength = wordLength
  },
  changeExerciseSettingsUnlockedSigns(unlockedSigns: number) {
    exerciseSettings.unlockedSigns = unlockedSigns
  },
  startNewExercise(name: string, description: string) {
    //TODO: edit lastStart
    const exercise: Exercise = {
      id: '' + exercises.length,
      name: name,
      description: description,
      firstStart: Date.now(),
      lastStart: 0,
    }
    exercises.push(exercise)
  },
  stopExercise(id: string) {
    const index = exercises.findIndex((el) => el.id === id)
    exercises[index].lastStart = Date.now()
    console.log(exercises[index])
  },
}

export default {
  exerciseSettings: readonly(exerciseSettings),
  exercises: readonly(exercises),
  methods,
}
