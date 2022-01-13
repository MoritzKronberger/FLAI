export interface DropDown {
  label: string
  value: any
}

export enum FeedbackStatus {
  Correct = 'Correct',
  Wrong = 'Wrong',
  Paused = 'Paused',
  NoHandDetected = 'No hand detected',
  Detecting = 'Detecting, please hold...',
}
