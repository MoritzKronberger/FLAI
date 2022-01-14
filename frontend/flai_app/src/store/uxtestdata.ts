import { reactive, readonly } from 'vue'

export enum SelectedTest {
  TestOne = 'Test 1',
  TestTwo = 'Test 2',
}

export interface UxTest {
  testSelected: boolean
  testRounds: number
  roundsComplete: number
  firstTest: SelectedTest | undefined
}

const uxTest: UxTest = reactive({
  testSelected: false,
  testRounds: 2,
  roundsComplete: 0,
  firstTest: undefined,
})

const methods = {
  changeTestSelected(selected: boolean) {
    uxTest.testSelected = selected
  },
  changeRoundsComplete(rounds: number) {
    uxTest.roundsComplete = rounds
  },
  changeFirstTest(test: SelectedTest) {
    uxTest.firstTest = test
  },
}

const uxtestdata = {
  uxTest: readonly(uxTest) as UxTest,
  methods,
}

export default uxtestdata
