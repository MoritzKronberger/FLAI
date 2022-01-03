<script setup lang="ts">
import { Results } from '@mediapipe/hands'
import { ref } from 'vue'
import handpose from '../components/Handpose.vue'

const handposeReady = ref(false)
const handposeResult = ref<Results>()

const setHandposeResult = (result: Results): void => {
  handposeResult.value = result
}

const setHandposeReady = (result: boolean): void => {
  handposeReady.value = result
}
</script>

<template>
  <h1>Handpose</h1>
  <handpose @new-result="setHandposeResult" @status-change="setHandposeReady" />
  <div>
    Result:
    {{
      handposeResult?.multiHandLandmarks[0]
        ? handposeResult?.multiHandLandmarks[0]
        : 'No hand detected'
    }}
  </div>
  <div>Status: {{ handposeReady ? 'ready' : 'loading' }}</div>
</template>
