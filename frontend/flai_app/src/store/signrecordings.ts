import { readonly } from 'vue'
export interface SignRecording {
  id: string
  path: string
  mimetype: string
  sign_id: string
  perspective: string
}

const signRecording: SignRecording[] = []

const signRecordingData = {
  signRecording: readonly(signRecording) as SignRecording[],
}

export default signRecordingData
