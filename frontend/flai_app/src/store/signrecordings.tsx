import { readonly } from 'vue'
import { Sign } from './signdata'
export interface SignRecording {
  id: string
  path: string //for frontend purposes: url, should be BYTEA number?
  mimetype_id: string
  sign_id: string
  perspective_id: string //for frontend purposes: 'front' or 'side'
}

const signRecording: SignRecording[] = []

const methods = {
  //this method exists only for frontend purposes and will be swapped with the rest request!
  createSignRecording(sign: Sign) {
    const signRecordings = []
    const signFront: SignRecording = {
      id: '' + sign.id,
      path: '',
      mimetype_id: '',
      sign_id: '',
      perspective_id: 'front',
    }
    const name = sign.name.toUpperCase()
    signFront.path = `src/assets/signs/vid/${signFront.perspective_id}/${name}_vid_${signFront.perspective_id}.webm`
    const signSide: SignRecording = {
      id: '' + sign.id,
      path: 'putUrlHere',
      mimetype_id: '',
      sign_id: '',
      perspective_id: 'side',
    }
    signSide.path = `src/assets/signs/vid/${signSide.perspective_id}/${name}_vid_${signSide.perspective_id}.webm`
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
