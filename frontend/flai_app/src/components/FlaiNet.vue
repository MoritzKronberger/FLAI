<script lang="ts">
export interface FlaiNetPrediction {
  label: string
  confidence: number
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

const flaiNetPredict = (handposeResults: Results): void => {
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
  emit('newResult', flaiNetResults)
}
</script>

<template>
  <handpose @new-result="flaiNetPredict" @status-change="setHandposeReady" />
  <div>Handpose Status: {{ handposeReady ? 'ready' : 'loading' }}</div>
</template>
