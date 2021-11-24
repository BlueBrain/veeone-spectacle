export type Position = {
  left: number
  top: number
}

export type Size = {
  width: number
  height: number
}

export interface Situation extends Position, Size {}

export type Json =
  | string
  | number
  | boolean
  | null
  | undefined
  | Json[]
  | { [key: string]: Json }
