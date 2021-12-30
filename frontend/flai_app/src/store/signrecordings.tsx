import { readonly } from 'vue'
import { Sign } from './signdata'
export interface SignRecording {
  id: string
  path: string //for frontend purposes: url, should be BYTEA number?
  mimetypeId: string
  signId: string
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
      path: '',
      mimetypeId: '',
      signId: '',
      perspectiveId: 'front',
    }
    const name = sign.name.toUpperCase()
    signFront.path = `@/assets/signs/vid/${signFront.perspectiveId}/${name} - ${signFront.perspectiveId}Video.webm`
    const signSide: SignRecording = {
      id: '' + sign.id,
      path: 'putUrlHere',
      mimetypeId: '',
      signId: '',
      perspectiveId: 'side',
    }
    signSide.path = `@/assets/signs/vid/${signSide.perspectiveId}/${name} - ${signSide.perspectiveId}Video.webm`
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
