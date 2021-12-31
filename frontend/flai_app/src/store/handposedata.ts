import { reactive, readonly } from 'vue'
import { Options } from '@mediapipe/hands'

const handposeOptions: Options = reactive({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.7,
})

const methods = {
  // TODO set Options properties in cleaner way or define setters for individual properties
  changeOptions(options: Options) {
    handposeOptions.maxNumHands = options.maxNumHands
    handposeOptions.modelComplexity = options.modelComplexity
    handposeOptions.minDetectionConfidence = options.minDetectionConfidence
    handposeOptions.minTrackingConfidence = options.minTrackingConfidence
  },
}

const handposedata = {
  handposeOptions: readonly(handposeOptions) as Options,
  methods,
}

export default handposedata
