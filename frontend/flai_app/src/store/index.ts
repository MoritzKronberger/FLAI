import { reactive, readonly } from 'vue'
import userdata from './userdata'

export interface Sessiondata {
  token: string
  startTime: number
  timer: number
}

const sessiondata: Sessiondata = reactive({
  token: '',
  startTime: 0,
  timer: 0,
})

export interface SignVideo {
  id: string
  video: string //for frontend purposes: url, should be BYTEA number?
  perspectiveId: string //for frontend purposes: 'front' or 'side'
  signId: string //for frontend purposes: letter
}

const signVideo: SignVideo[] = []

export interface Sign {
  id: string
  name: string
  motionCategoryId: string
  progress: number
}

const signs: Sign[] = []

const methods = {
  startTimer() {
    sessiondata.startTime = Date.now()
  },
  updateTimer() {
    sessiondata.timer = Date.now() - sessiondata.startTime
  },
  //this method exists only for frontend purposes and will be swapped with the rest request!
  getSignVideosAll() {
    for (let i = 0; i < 26; i++) {
      const signFront: SignVideo = {
        id: '' + i,
        video: '',
        perspectiveId: 'front',
        signId: String.fromCharCode(97 + i),
      }
      signFront.video = `../ressources/${signFront.signId}_${signFront.perspectiveId}.mp4`
      const signSide: SignVideo = {
        id: '' + i,
        video: 'putUrlHere',
        perspectiveId: 'side',
        signId: String.fromCharCode(97 + i),
      }
      signSide.video = `../ressources/${signSide.signId}_${signSide.perspectiveId}.mp4`
      signVideo.push(signFront)
      signVideo.push(signSide)
    }
    console.log(signVideo)
  },
  getSignVideo(letter: string, perspective: string) {
    return signVideo.filter(
      (el) => el.signId === letter && el.perspectiveId === perspective
    )
  },
}

export default {
  userdata,
  sessiondata: readonly(sessiondata),
  signVideo: readonly(signVideo),
  signs: readonly(signs),
  methods,
}
