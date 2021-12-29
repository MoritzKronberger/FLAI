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
    const name = sign.name.toUpperCase()
    signFront.video = `src/assets/signs/vid/${signFront.perspectiveId}/${name} - ${signFront.perspectiveId}Video.webm`
    const signSide: SignRecording = {
      id: '' + sign.id,
      video: 'putUrlHere',
      perspectiveId: 'side',
    }
    signSide.video = `src/assets/signs/vid/${signSide.perspectiveId}/${name} - ${signSide.perspectiveId}Video.webm`
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
