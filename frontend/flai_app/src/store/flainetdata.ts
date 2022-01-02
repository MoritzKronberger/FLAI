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
}

const flaiNetOptions: FlaiNetOptions = reactive({
  path: new URL('../assets/neural_net/model.json', import.meta.url),
  labels: 'abcdefghiklmnopqrstuvwxy',
  bufferedResult: true,
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
  changeResultBufferSize(size: number) {
    resultBuffer.size = size
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
  evaluateResultBuffer() {
    const returnBuffer = [...resultBuffer.results]
    return resultBuffer.results.every(
      (val) => val?.label === resultBuffer.results[0]?.label
    ) && returnBuffer.length === resultBuffer.size
      ? returnBuffer.map((res) => ({ ...res, uniformLabels: true }))
      : returnBuffer.map((res) => ({ ...res, uniformLabels: false }))
  },
}

const flainetdata = {
  flaiNetOptions: readonly(flaiNetOptions) as FlaiNetOptions,
  resultBuffer: readonly(resultBuffer) as ResultBuffer,
  methods,
}

export default flainetdata
