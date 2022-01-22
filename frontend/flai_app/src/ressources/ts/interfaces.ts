export interface DropDown {
  label: string
  value: any
}

export enum FeedbackStatus {
  Correct = 'Richtig',
  Wrong = 'Falsch',
  Paused = 'Pausiert',
  NoHandDetected = 'Keine Hand erkannt',
  Detecting = 'Erkenne Gebärde, bitte halten...',
}
