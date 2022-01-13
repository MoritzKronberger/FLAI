import { reactive, readonly } from 'vue'

export interface Webcam {
  webcamFeed: HTMLVideoElement | undefined
  stream: MediaStream | undefined
  constraints: MediaStreamConstraints
}

const webcam: Webcam = reactive({
  webcamFeed: undefined,
  stream: undefined,
  constraints: {
    video: {
      facingMode: 'user',
    },
    audio: false,
  },
})

const methods = {
  setWebcamFeed(videoElement: HTMLVideoElement) {
    webcam.webcamFeed = videoElement
    webcam.webcamFeed.srcObject = webcam.stream ?? null
  },
}

const actions = {
  async startWebcam(callback: () => unknown) {
    webcam.stream = await navigator.mediaDevices.getUserMedia(
      webcam.constraints
    )
    callback()
  },
}

const webcamdata = {
  webcam: readonly(webcam) as Webcam,
  methods,
  actions,
}

export default webcamdata
