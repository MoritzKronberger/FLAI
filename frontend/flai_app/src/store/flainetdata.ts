import { Results } from '@mediapipe/hands'
import { LayersModel, loadLayersModel, tensor, Tensor } from '@tensorflow/tfjs'
import { reactive, readonly } from 'vue'

export interface FlaiNetPrediction {
  label: string
  confidence: number
  uniformLabels?: boolean
}

export type FlaiNetResults = FlaiNetPrediction[]

export interface ResultBuffer {
  size: number
  results: FlaiNetResults
}

export interface FlaiNetOptions {
  path: URL
  labels: string
  bufferedResult: boolean
  newInputTimeout: number
}

export interface FlaiNet {
  model: LayersModel | undefined
}

// flaiNet cannot be reactive, otherwise this results in a tf error
const flaiNet: FlaiNet = {
  model: undefined,
}

const flaiNetOptions: FlaiNetOptions = reactive({
  path: new URL('../assets/neural_net/model.json', import.meta.url),
  labels: 'abcdefghiklmnopqrstuvwxy',
  bufferedResult: true,
  newInputTimeout: 2000,
})

const resultBuffer: ResultBuffer = reactive({
  size: 15,
  results: [],
})

const methods = {
  changePath(path: URL) {
    flaiNetOptions.path = path
  },
  changeLabels(labels: string) {
    flaiNetOptions.labels = labels
  },
  changeResultBuffer(buffered: boolean) {
    flaiNetOptions.bufferedResult = buffered
  },
  changeNewInputTimeout(timeout: number) {
    flaiNetOptions.newInputTimeout = timeout
  },
  changeResultBufferSize(size: number) {
    resultBuffer.size = size
  },
  getFlaiNet(): FlaiNet {
    return flaiNet
  },
  flaiNetPredict(handposeResults: Results) {
    const resultsTensor = this.handposeResultsToFlaiNetInput(handposeResults)
    const flaiNetResults: FlaiNetPrediction[] = []
    if (resultsTensor.size > 0) {
      const prediction = flaiNet.model?.predict(resultsTensor) as Tensor
      resultsTensor.dispose()
      const maxArg = prediction.argMax(-1).dataSync() as Int32Array
      const confidence = prediction.max(-1).dataSync() as Float32Array
      prediction.dispose()
      maxArg.forEach((arg, index) => {
        flaiNetResults.push({
          label: flaiNetOptions.labels[arg],
          confidence: confidence[index],
        })
      })
    }
    return flaiNetResults
  },
  handposeResultsToFlaiNetInput(handposeResults: Results) {
    const results = handposeResults.multiHandLandmarks
    const resultsArray = results.map((landmarks) =>
      landmarks.map((landmark) =>
        Object.values(landmark).filter((el) => el !== undefined)
      )
    )
    return tensor(resultsArray)
  },
  resultBufferUpdate(flaiNetResults: FlaiNetResults) {
    flaiNetResults[0]
      ? this.addToResultBuffer(flaiNetResults[0])
      : this.clearResultBuffer()
  },
  addToResultBuffer(prediction: FlaiNetPrediction) {
    if (resultBuffer.results.length === resultBuffer.size) {
      resultBuffer.results.shift()
    }
    resultBuffer.results.push(prediction)
  },
  clearResultBuffer() {
    resultBuffer.results = []
  },
  evaluateResultBuffer(newBufferResults: FlaiNetResults) {
    const returnBuffer = [...newBufferResults]
    return resultBuffer.results.every(
      (val) => val?.label === resultBuffer.results[0]?.label
    ) && returnBuffer.length === resultBuffer.size
      ? returnBuffer.map((res) => ({ ...res, uniformLabels: true }))
      : returnBuffer.map((res) => ({ ...res, uniformLabels: false }))
  },
}

const actions = {
  // try loading the model from the browser's indexedDB
  // if it doesn't exist load it from the frontend server and save it to the indexedDB
  // (needs to be saved to the indexedDB since the model is to big for local storage)
  async loadFlaiNet(
    callback: () => unknown,
    progressCallback: (progress: number) => unknown
  ) {
    try {
      flaiNet.model = await loadLayersModel('indexeddb://flai_net_model', {
        onProgress: progressCallback,
      })
    } catch {
      flaiNet.model = await loadLayersModel(flaiNetOptions.path.toString(), {
        onProgress: progressCallback,
      })
      await flaiNet.model.save('indexeddb://flai_net_model')
    }
    callback()
  },
}

const flainetdata = {
  flaiNetOptions: readonly(flaiNetOptions) as FlaiNetOptions,
  resultBuffer: readonly(resultBuffer) as ResultBuffer,
  methods,
  actions,
}

export default flainetdata
