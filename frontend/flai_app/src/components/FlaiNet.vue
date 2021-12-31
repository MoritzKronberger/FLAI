<script lang="ts">
export interface FlaiNetResult {
  label: string
  confidence: number
}
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Results } from '@mediapipe/hands'
import handpose from '../components/Handpose.vue'
import * as tf from '@tensorflow/tfjs'

const emit = defineEmits(['newResult', 'statusChange'])

// TODO: load labels from store
const labels = 'abcdefghiklmnopqrstuvwxy'
const flaiNetPath = new URL('../assets/neural_net/model.json', import.meta.url)
let flaiNet: tf.LayersModel
const flaiNetReady = ref(false)

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

// currently only returns prediction for first frame
// could be updated to return an array of all predictions for batch processing
const flaiNetPredict = (handposeResults: Results): void => {
  const resultsTensor = handposeResultsToFlaiNetInput(handposeResults)
  if (resultsTensor.size > 0) {
    const prediction = flaiNet.predict(resultsTensor) as tf.Tensor
    const maxArg = prediction.argMax(-1).dataSync() as Int32Array
    const confidence = prediction.max(-1).dataSync() as Float32Array
    const flaiNetResult: FlaiNetResult = {
      label: labels[maxArg[0]],
      confidence: confidence[0],
    }
    emit('newResult', flaiNetResult)
  }
}
</script>

<template>
  <handpose @new-result="flaiNetPredict" @status-change="setHandposeReady" />
  <div>Handpose Status: {{ handposeReady ? 'ready' : 'loading' }}</div>
</template>
