import { reactive, readonly } from 'vue'
import { Hands, Options, Results } from '@mediapipe/hands'
import { Camera } from '@mediapipe/camera_utils'

export interface MediapipeSolutions {
  hands: Hands | undefined
  camera: Camera | undefined
}

// hands or camera cannot be reactive, otherwise this results in a mediapipe error
const mediapipeSolutions: MediapipeSolutions = {
  hands: undefined,
  camera: undefined,
}

const handposeOptions: Options = reactive({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.7,
})

const methods = {
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
  loadMediapipeHands(onResultsCallback: (handposeResults: Results) => void) {
    const mp = window
    // eslint-disable-next-line
    // @ts-ignore
    mediapipeSolutions.hands = new mp.Hands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      },
    })
    mediapipeSolutions.hands?.setOptions(handposeOptions)
    mediapipeSolutions.hands?.onResults(onResultsCallback)
  },
  startMediapipeCamera(webcamFeed: HTMLVideoElement) {
    if (mediapipeSolutions.hands) {
      const mp = window
      // eslint-disable-next-line
      // @ts-ignore
      mediapipeSolutions.camera = new mp.Camera(webcamFeed, {
        onFrame: async () => {
          await mediapipeSolutions.hands?.send({ image: webcamFeed })
        },
      })

      mediapipeSolutions.camera?.start()
    } else {
      throw { name: 'HandsExecption', message: 'hands is undefined' }
    }
  },
  // TODO set Options properties in cleaner way or define setters for individual properties
  changeOptions(options: Options) {
    handposeOptions.maxNumHands = options.maxNumHands
    handposeOptions.modelComplexity = options.modelComplexity
    handposeOptions.minDetectionConfidence = options.minDetectionConfidence
    handposeOptions.minTrackingConfidence = options.minTrackingConfidence
  },
}

const handposedata = {
  mediapipeSolutions: readonly(mediapipeSolutions) as MediapipeSolutions,
  handposeOptions: readonly(handposeOptions) as Options,
  methods,
}

export default handposedata
