import { FlaiNetResults } from '../../store/flainetdata'
import store from '../../store'
import { FeedbackStatus } from './interfaces'

export function getFlaiNetResults(
  bufferResults: FlaiNetResults,
  currentSign: string,
  correct: () => void,
  wrong: () => void
) {
  const results = store.flainetdata.methods.evaluateResultBuffer(bufferResults)

  if (results.length > 0) {
    if (results[0].uniformLabels) {
      const handSign = results[0].label
      if (handSign === currentSign) {
        correct()
        return FeedbackStatus.Correct
      } else {
        wrong()
        return FeedbackStatus.Wrong
      }
    } else {
      return FeedbackStatus.Detecting
    }
  } else {
    return FeedbackStatus.NoHandDetected
  }
}
