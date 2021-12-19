import { readonly } from 'vue'
import { Sign } from './signdata'

export interface SignRecording {
  id: string
  video: string //for frontend purposes: url, should be BYTEA number?
  perspectiveId: string //for frontend purposes: 'front' or 'side'
}

const signRecording: SignRecording[] = []

const methods = {
  //this method exists only for frontend purposes and will be swapped with the rest request!
  createSignRecording(sign: Sign) {
    const signRecordings = []
    const signFront: SignRecording = {
      //TODO: id is not unique!
      id: '' + sign.id,
      video: '',
      perspectiveId: 'front',
    }
    signFront.video = `../ressources/${sign.name}_${signFront.perspectiveId}.mp4`
    const signSide: SignRecording = {
      id: '' + sign.id,
      video: 'putUrlHere',
      perspectiveId: 'side',
    }
    signSide.video = `../ressources/${sign.name}_${signSide.perspectiveId}.mp4`
    signRecordings.push(signFront)
    signRecordings.push(signSide)
    return signRecordings
  },
}

const signRecordingData = { signRecording: readonly(signRecording), methods }

export default signRecordingData
