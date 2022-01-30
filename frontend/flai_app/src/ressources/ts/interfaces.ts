// TODO: needed?
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

// types and interfaces for data returned by the FLAI REST server
export interface PostgresEntry {
  [key: string]: string | number | boolean | null
}

export type PostgresRow = { [key: string]: string | number | boolean | null }[]

export interface JoiContext {
  [index: string]: string
  label: string
  value: string
  key: string
}

export interface DefaultData {
  [index: string]:
    | number
    | string
    | string[]
    | PostgresRow
    | PostgresEntry
    | JoiContext
    | null
    | undefined
  message: string | null
}

export interface PostgresData extends DefaultData {
  status: number
  ids: PostgresEntry | null
  rows: PostgresRow | null
  constraint: string | null
  pgstate: string | null
  jwt?: string
}

export interface JoiEntry extends DefaultData {
  message: string
  path: string[]
  type: string[]
  context: JoiContext
}

export type JoiData = JoiEntry[]

export interface ExpressData {
  [index: string]: number | DefaultData | PostgresData | JoiData | unknown
  status: number
  data: unknown | DefaultData | PostgresData | JoiData
}
