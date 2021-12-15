import { readonly } from 'vue'

export interface SignRecording {
  id: string
  video: string //for frontend purposes: url, should be BYTEA number?
  perspectiveId: string //for frontend purposes: 'front' or 'side'
  signId: string //for frontend purposes: letter
}

const signRecording: SignRecording[] = []

const methods = {
  //this method exists only for frontend purposes and will be swapped with the rest request!
  getSignRecordingsAll() {
    for (let i = 0; i < 26; i++) {
      const signFront: SignRecording = {
        id: '' + i,
        video: '',
        perspectiveId: 'front',
        signId: String.fromCharCode(97 + i),
      }
      signFront.video = `../ressources/${signFront.signId}_${signFront.perspectiveId}.mp4`
      const signSide: SignRecording = {
        id: '' + i,
        video: 'putUrlHere',
        perspectiveId: 'side',
        signId: String.fromCharCode(97 + i),
      }
      signSide.video = `../ressources/${signSide.signId}_${signSide.perspectiveId}.mp4`
      signRecording.push(signFront)
      signRecording.push(signSide)
    }
    console.log(signRecording)
  },
  getSignRecording(letter: string, perspective: string) {
    return signRecording.filter(
      (el) => el.signId === letter && el.perspectiveId === perspective
    )
  },
}

export default { signRecording: readonly(signRecording), methods }
