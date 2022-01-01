<script lang="ts">
export interface FlaiNetPrediction {
  label: string
  confidence: number
  uniformLabels?: boolean
}
export type FlaiNetResults = FlaiNetPrediction[]
</script>

<script setup lang="ts">
import { inject, onMounted, ref, computed } from 'vue'
import { Results } from '@mediapipe/hands'
import handpose from '../components/Handpose.vue'
import * as tf from '@tensorflow/tfjs'

const store: any = inject('store')

const emit = defineEmits(['newResult', 'statusChange'])

const flaiNetPath = new URL('../assets/neural_net/model.json', import.meta.url)
let flaiNet: tf.LayersModel
const flaiNetOptions = computed(() => store.flainetdata.flaiNetOptions)
const flaiNetReady = ref(false)

// TODO: Move buffer vars into store
const bufferedResult = true
const resultBufferSize = 15
let resultBuffer: FlaiNetResults = []

const handposeReady = ref(false)
const setHandposeReady = (result: boolean): void => {
  handposeReady.value = result
}

// The python tenforflowjs coverter falsely names the 'LeCunNormal' initializer 'LecunNormal'.
// This means the name has to be changed by hand in the /assets/neural_net/model.json,
// whenever model.jon is updated
const loadFlaiNet = async (): Promise<void> => {
  flaiNet = await tf.loadLayersModel(flaiNetPath.toString())
  flaiNetReady.value = true
  emit('statusChange', flaiNetReady.value as boolean)
}

const handposeResultsToFlaiNetInput = (handposeResults: Results): tf.Tensor => {
  const results = handposeResults.multiHandLandmarks
  const resultsArray = results.map((landmarks) =>
    landmarks.map((landmark) =>
      Object.values(landmark).filter((el) => el !== undefined)
    )
  )
  return tf.tensor(resultsArray)
}

onMounted(() => {
  emit('statusChange', flaiNetReady.value)
  loadFlaiNet()
})

// if no hand is detected the buffer is cleared
const resultBufferAdd = (flaiNetResults: FlaiNetResults): void => {
  if (flaiNetResults[0]) {
    if (resultBuffer.length === resultBufferSize) {
      resultBuffer.shift()
    }
    resultBuffer.push(flaiNetResults[0])
  } else {
    resultBuffer = []
  }
}

const resultBufferEvaluate = (): FlaiNetResults => {
  const returnBuffer = [...resultBuffer]
  return resultBuffer.every((val) => val?.label === resultBuffer[0]?.label) &&
    returnBuffer.length === resultBufferSize
    ? returnBuffer.map((res) => ({ ...res, uniformLabels: true }))
    : returnBuffer.map((res) => ({ ...res, uniformLabels: false }))
}

/* if bufferedResult is true: returns array containing predictions (empty if no hand was detected):
     - with no 'uniformLabels' property if the whole buffer is filled and all buffered predictions are of the same label
     - with 'uniformLabels': true if not the whole buffer is filled or not all buffered predictions are of the same label

   else: returns array containing predictions (empty if no hand was detected) with no 'uniformLabels' property
*/
const flaiNetPredict = (handposeResults: Results): FlaiNetResults => {
  const resultsTensor = handposeResultsToFlaiNetInput(handposeResults)
  const flaiNetResults: FlaiNetPrediction[] = []
  if (resultsTensor.size > 0) {
    const prediction = flaiNet.predict(resultsTensor) as tf.Tensor
    resultsTensor.dispose()
    const maxArg = prediction.argMax(-1).dataSync() as Int32Array
    const confidence = prediction.max(-1).dataSync() as Float32Array
    prediction.dispose()
    // TODO: update to be strictly functional?
    maxArg.forEach((arg, index) => {
      flaiNetResults.push({
        label: flaiNetOptions.value.labels[arg],
        confidence: confidence[index],
      })
    })
  }

  return flaiNetResults
}

const emitResults = (handposeResults: Results): void => {
  const flaiNetResults = flaiNetPredict(handposeResults)
  if (bufferedResult) {
    resultBufferAdd(flaiNetResults)
    emit('newResult', resultBufferEvaluate())
  } else {
    emit('newResult', flaiNetResults)
  }
}
</script>

<template>
  <handpose @new-result="emitResults" @status-change="setHandposeReady" />
  <div>Handpose Status: {{ handposeReady ? 'ready' : 'loading' }}</div>
</template>
