<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import store from '../store'
import webcam from '../components/Webcam.vue'
import { Hands, Results } from '@mediapipe/hands'

/*
--- MEDIAPIPE TYPESCRIPT BUNDLING WORKAROUND ---

Importing any mediapipe solution via npm and running it in dev-mode works fine,
but if the dependency is bundeled for production Rollup compilation fails to instantiate the main
solution class (i.e. Hands, Camera, etc.).
This produces the 'foo.Hands is not a constructor' error on runtime.
The issue seems to be relatively new and I can't find any clean solutions to it:
https://github.com/google/mediapipe/issues/2883

As a workaround using the CDN version of the mediapipe solutions by implementing the scripts in index.js
is a working, but ugly workaround used by mediapipe's own codepen (https://codepen.io/mediapipe/pen/RwGWYJw)
and requires both eslint and ts-errors to be disabled in multiple places.

If this issue is fixed Hands and Camera should be imported from npm again, however, this seems to be
the simplest working solution for now.
*/

const handposeReady = ref(false)
const mpHands = window
const mpCamera = window
let hands: Hands
const handposeOptions = computed(() => store.handposedata.handposeOptions)

const emit = defineEmits(['newResult', 'statusChange'])
const onResults = (results: Results) => {
  handposeReady.value = true
  emit('statusChange', handposeReady.value as boolean)
  emit('newResult', results)
}

const loadMediapipeHands = (): void => {
  // eslint-disable-next-line
  /* @ts-ignore */
  hands = new mpHands.Hands({
    locateFile: (file: string) => {
      const retFile = `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      console.log(retFile)
      return retFile
    },
  })
  hands.setOptions(handposeOptions.value)
  hands.onResults(onResults)
}

onMounted(() => {
  emit('statusChange', handposeReady.value)
  loadMediapipeHands()
})

// setup from https://google.github.io/mediapipe/solutions/hands.html#javascript-solution-api
const startMediapipeCamera = (webcamFeed: HTMLVideoElement): void => {
  // eslint-disable-next-line
  /* @ts-ignore */
  const camera = new mpCamera.Camera(webcamFeed as HTMLVideoElement, {
    onFrame: async () => {
      await hands.send({ image: webcamFeed as HTMLVideoElement })
    },
  })

  camera.start()
}
</script>

<template>
  <webcam @webcam-ready="startMediapipeCamera" />
</template>
