import { reactive, readonly } from 'vue'

export interface UxTest {
  testSelected: boolean
  testRounds: number
  roundsComplete: number
}

const uxTest = reactive({
  testSelected: false,
  testRounds: 2,
  roundsComplete: 0,
})

const methods = {
  changeTestSelected(selected: boolean) {
    uxTest.testSelected = selected
  },
  changeRoundsComplete(rounds: number) {
    uxTest.roundsComplete = rounds
  },
}

const uxtestdata = {
  uxTest: readonly(uxTest) as UxTest,
  methods,
}

export default uxtestdata
