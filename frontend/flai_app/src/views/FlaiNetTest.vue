<script setup lang="ts">
import { ref } from 'vue'
import { FlaiNetResults } from '../store/flainetdata'
import flaiNet from '../components/FlaiNet.vue'

const flaiNetResults = ref<FlaiNetResults>()
const flaiNetReady = ref(false)

const setFlaiNetResults = (result: FlaiNetResults): void => {
  flaiNetResults.value = result
}
const setflaiNetReady = (result: boolean): void => {
  flaiNetReady.value = result
}
/*       flaiNetResults?.[0]
        ? flaiNetResults?.[0].inconclusive
          ? 'Detecting ... please hold.'
          : `${flaiNetResults[0].label} [${flaiNetResults[0].confidence}]`
        : 'No hand detected.'*/
</script>

<template>
  <h1>FLAI_NET</h1>
  <flai-net @new-result="setFlaiNetResults" @status-change="setflaiNetReady" />
  <div>FLAI_NET Status: {{ flaiNetReady ? 'ready' : 'loading' }}</div>
  <br />
  <div>
    Prediction:
    {{ flaiNetResults }}
  </div>
</template>
