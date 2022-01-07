import { FlaiNetResults } from '../../store/flainetdata'
import store from '../../store'

export function getFlaiNetResults(
  bufferResults: FlaiNetResults,
  currentSign: string,
  correct: () => void,
  wrong: () => void
) {
  const results = store.flainetdata.methods.evaluateResultBuffer(bufferResults)
  console.log(results)

  if (results.length > 0) {
    if (results[0].uniformLabels) {
      const handSign = results[0].label
      if (handSign === currentSign) {
        correct()
        return 'Correct'
      } else {
        wrong()
        return 'Wrong'
      }
    } else {
      return 'Detecting, please hold...'
    }
  } else {
    return 'No hand found'
  }
}
