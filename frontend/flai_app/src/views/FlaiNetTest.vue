<script setup lang="ts">
import { ref } from 'vue'
import { FlaiNetResult } from '../components/FlaiNet.vue'
import flaiNet from '../components/FlaiNet.vue'

const flaiNetResults = ref<FlaiNetResult>()
const flaiNetReady = ref(false)

const setFlaiNetResults = (result: FlaiNetResult): void => {
  flaiNetResults.value = result
}
const setflaiNetReady = (result: boolean): void => {
  flaiNetReady.value = result
}
</script>

<template>
  <h1>FLAI_NET</h1>
  <flai-net @new-result="setFlaiNetResults" @status-change="setflaiNetReady" />
  <div>FLAI_NET Status: {{ flaiNetReady ? 'ready' : 'loading' }}</div>
  <br />
  <div>
    Prediction:
    {{
      flaiNetResults
        ? `${flaiNetResults.label} [${flaiNetResults.confidence}]`
        : 'No hand detected'
    }}
  </div>
</template>
