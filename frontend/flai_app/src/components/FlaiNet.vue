<script setup lang="ts">
import { inject, onMounted, ref, computed } from 'vue'
import { Results } from '@mediapipe/hands'
import { FlaiNetPrediction, FlaiNetResults } from '../store/flainetdata'
import handpose from '../components/Handpose.vue'
import * as tf from '@tensorflow/tfjs'

const store: any = inject('store')

const emit = defineEmits(['newResult', 'statusChange'])

const flaiNetPath = new URL('../assets/neural_net/model.json', import.meta.url)
let flaiNet: tf.LayersModel
const flaiNetOptions = computed(() => store.flainetdata.flaiNetOptions)
const flaiNetMethods = computed(() => store.flainetdata.methods)
const labels = flaiNetOptions.value.labels
const bufferedResult = flaiNetOptions.value.bufferedResult

const flaiNetReady = ref(false)
const handposeReady = ref(false)

const setHandposeReady = (result: boolean): void => {
  handposeReady.value = result
}
const clearResultBuffer = () => {
  flaiNetMethods.value.clearResultBuffer()
}
const addToResultBuffer = (prediction: FlaiNetPrediction) => {
  flaiNetMethods.value.addToResultBuffer(prediction)
}
const evaluateResultBuffer = () => {
  return flaiNetMethods.value.evaluateResultBuffer()
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
const resultBufferUpdate = (flaiNetResults: FlaiNetResults): void => {
  flaiNetResults[0] ? addToResultBuffer(flaiNetResults[0]) : clearResultBuffer()
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
        label: labels[arg],
        confidence: confidence[index],
      })
    })
  }

  return flaiNetResults
}

const emitResults = (handposeResults: Results): void => {
  const flaiNetResults = flaiNetPredict(handposeResults)
  if (bufferedResult) {
    resultBufferUpdate(flaiNetResults)
    // this emit is only used for demo purposes, since evaluateResultBuffer() is always available through the store
    emit('newResult', evaluateResultBuffer())
  } else {
    emit('newResult', flaiNetResults)
  }
}
</script>

<template>
  <handpose @new-result="emitResults" @status-change="setHandposeReady" />
  <div>Handpose Status: {{ handposeReady ? 'ready' : 'loading' }}</div>
</template>
