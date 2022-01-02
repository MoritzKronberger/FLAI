<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { FlaiNetResults } from '../store/flainetdata'
import flaiNet from '../components/FlaiNet.vue'
import customCheckbox from '../components/CustomCheckbox.vue'
import textInputField from '../components/TextInputField.vue'

const store: any = inject('store')
const flaiNetMethods = computed(() => store.flainetdata.methods)
const bufferedResult = ref(true)
const bufferSize = ref('15')

const setBufferedResult = (): void => {
  flaiNetMethods.value.changeResultBuffer(bufferedResult.value)
}
const setBufferSize = (): void => {
  flaiNetMethods.value.changeResultBufferSize(parseInt(bufferSize.value))
}

const flaiNetResults = ref<FlaiNetResults>()
const flaiNetReady = ref(false)

const setFlaiNetResults = (result: FlaiNetResults): void => {
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
      flaiNetResults?.[0]
        ? !flaiNetResults[0].uniformLabels && bufferedResult
          ? 'Detecting... Please hold.'
          : `${flaiNetResults[0].label} [${flaiNetResults[0].confidence}]`
        : 'No hand detected.'
    }}
  </div>
  <br />
  <br />
  <br />
  <div>
    <custom-checkbox
      v-model="bufferedResult"
      label-name="Use Result Buffer"
      element-class="checkbox-primary"
      @input="setBufferedResult"
    />
  </div>
  <br />
  <div>
    <text-input-field
      v-model="bufferSize"
      label-name="Buffer Size"
      placeholder="buffersize"
      element-class="input-primary"
      @keyup.enter="setBufferSize"
    />
  </div>
</template>
