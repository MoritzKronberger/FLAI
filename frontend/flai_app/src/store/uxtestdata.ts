import { reactive, readonly } from 'vue'

export enum SelectedTest {
  TestOne = 'Test 1',
  TestTwo = 'Test 2',
}

export interface UxTest {
  testSelected: boolean
  testRounds: number
  roundsComplete: number
  completedTests: SelectedTest[]
  currentTest: SelectedTest | undefined
}

export interface WordsCompleted {
  maxWords: number
  currentValue: number
}

const uxTest: UxTest = reactive({
  testSelected: false,
  testRounds: 2,
  roundsComplete: 0,
  completedTests: [],
  currentTest: undefined,
})

const wordsCompleted: WordsCompleted = reactive({
  maxWords: 3,
  currentValue: 0,
})

const methods = {
  changeTestSelected(selected: boolean) {
    uxTest.testSelected = selected
  },
  changeRoundsComplete(rounds: number) {
    uxTest.roundsComplete = rounds
  },
  addCompletedTest(test: SelectedTest) {
    uxTest.completedTests.push(test)
  },
  changeCurrentTest(test: SelectedTest | undefined) {
    uxTest.currentTest = test
  },
  changeMaxWords(newMax: number) {
    wordsCompleted.maxWords = newMax
  },
  changeCurrentWords(newValue: number) {
    wordsCompleted.currentValue = newValue
  },
}

const uxtestdata = {
  uxTest: readonly(uxTest) as UxTest,
  wordsCompleted: readonly(wordsCompleted) as WordsCompleted,
  methods,
}

export default uxtestdata
