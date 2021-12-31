import { reactive, readonly } from 'vue'

export interface FlaiNetOptions {
  labels: string
}

const flaiNetOptions: FlaiNetOptions = reactive({
  labels: 'abcdefghiklmnopqrstuvwxy',
})

const methods = {
  // TODO set Options properties in cleaner way or define setters for individual properties
  changeLabels(labels: string) {
    flaiNetOptions.labels = labels
  },
}

const flainetdata = {
  flaiNetOptions: readonly(flaiNetOptions) as FlaiNetOptions,
  methods,
}

export default flainetdata
