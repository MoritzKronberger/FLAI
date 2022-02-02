import { readonly } from 'vue'
import { Sign } from './signdata'
export interface SignRecording {
  id: string
  path: string
  mimetype: string
  sign_id: string
  perspective: string
}

const signRecording: SignRecording[] = []

const methods = {
  // TODO: this method exists only for frontend purposes and will be swapped with the rest request!
  createSignRecording(sign: Sign) {
    const signRecordings = []
    const signFront: SignRecording = {
      id: '' + sign.id,
      path: '',
      mimetype: '',
      sign_id: '',
      perspective: 'front',
    }
    const name = sign.name.toUpperCase()
    signFront.path = `src/assets/signs/vid/${signFront.perspective}/${name}_vid_${signFront.perspective}.webm`
    const signSide: SignRecording = {
      id: '' + sign.id,
      path: 'putUrlHere',
      mimetype: '',
      sign_id: '',
      perspective: 'side',
    }
    signSide.path = `src/assets/signs/vid/${signSide.perspective}/${name}_vid_${signSide.perspective}.webm`
    signRecordings.push(signFront)
    signRecordings.push(signSide)
    return signRecordings
  },
}

const signRecordingData = {
  signRecording: readonly(signRecording) as SignRecording[],
  methods,
}

export default signRecordingData
