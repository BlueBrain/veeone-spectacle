import { RunningEnvironment } from "./types"

export interface EnvironmentConfig {
  code: RunningEnvironment
  title: string
  shortTitle: string
  pxWidth: number
  pxHeight: number
  aspectRatio: number | "auto"
  place: string
  placeUrl: string
  active: boolean
  gridCols: number
  gridRows: number
}

const ENVIRONMENT_CONFIGS: Record<RunningEnvironment, EnvironmentConfig> = {
  [RunningEnvironment.DEV]: {
    code: RunningEnvironment.DEV,
    title: "Development Environment",
    shortTitle: "Dev",
    pxWidth: 1000,
    pxHeight: 600,
    aspectRatio: "auto",
    placeUrl: "",
    place: "",
    active: true,
    gridCols: 1,
    gridRows: 1,
  },
  [RunningEnvironment.CLIENT]: {
    code: RunningEnvironment.CLIENT,
    title: "Web Client",
    shortTitle: "Web",
    pxWidth: 1000,
    pxHeight: 600,
    aspectRatio: "auto",
    placeUrl: "",
    place: "",
    active: false,
    gridCols: 1,
    gridRows: 1,
  },
  [RunningEnvironment.THIRD_FLOOR_LEFT_DISPLAY]: {
    code: RunningEnvironment.THIRD_FLOOR_LEFT_DISPLAY,
    title: "3rd Floor Display Wall (left)",
    shortTitle: "3rd Floor Left",
    pxWidth: 3840,
    pxHeight: 2160,
    aspectRatio: "auto",
    placeUrl: "https://plan.epfl.ch/?room==B1%203%20254.045",
    place: "B1 3 254.045",
    active: true,
    gridCols: 1,
    gridRows: 1,
  },
  [RunningEnvironment.THIRD_FLOOR_RIGHT_DISPLAY]: {
    code: RunningEnvironment.THIRD_FLOOR_RIGHT_DISPLAY,
    title: "3rd Floor Display Wall (right)",
    shortTitle: "3rd Floor Right",
    pxWidth: 3840,
    pxHeight: 2160,
    aspectRatio: "auto",
    placeUrl: "https://plan.epfl.ch/?room==B1%203%20254.045",
    place: "B1 3 254.045",
    active: false,
    gridCols: 1,
    gridRows: 1,
  },
  [RunningEnvironment.FIFTH_FLOOR_DISPLAY_WALL]: {
    code: RunningEnvironment.FIFTH_FLOOR_DISPLAY_WALL,
    title: "5th Floor Display Wall",
    shortTitle: "5th Floor",
    pxWidth: 5785,
    pxHeight: 3265,
    aspectRatio: "auto",
    placeUrl: "https://plan.epfl.ch/?room==B1%205%20254.045",
    place: "B1 5 254.045",
    active: true,
    gridCols: 3,
    gridRows: 3,
  },
  [RunningEnvironment.SIXTH_FLOOR_DISPLAY_WALL]: {
    code: RunningEnvironment.SIXTH_FLOOR_DISPLAY_WALL,
    title: "6th Floor Display Wall",
    shortTitle: "6th Floor",
    pxWidth: 7718,
    pxHeight: 3265,
    aspectRatio: "auto",
    placeUrl: "https://plan.epfl.ch/?room==B1%206%20259.054",
    place: "B1 6 259.054",
    active: true,
    gridCols: 4,
    gridRows: 3,
  },
  [RunningEnvironment.OPENDECK]: {
    code: RunningEnvironment.OPENDECK,
    title: "Opendeck",
    shortTitle: "Opendeck",
    pxWidth: 7642,
    pxHeight: 2191,
    aspectRatio: "auto",
    placeUrl: "https://plan.epfl.ch/?room==B1%204%20265.052",
    place: "B1 4 265.052",
    active: true,
    gridCols: 1,
    gridRows: 1,
  },
}

export default ENVIRONMENT_CONFIGS
