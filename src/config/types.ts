export enum RunningEnvironment {
  // Use "DEV" for local development.
  // Place SPECTACLE_RUNNING_ENVIRONMENT=DEV entry in your .env file
  DEV = "DEV",
  // Client is used for users' browsers when they open Spectacle "web client"
  CLIENT = "CLIENT",
  // These are "real-world" installations where Spectacle is deployed with full touch experience
  FIFTH_FLOOR_DISPLAY_WALL = "FIFTH_FLOOR_DISPLAY_WALL",
  THIRD_FLOOR_LEFT_DISPLAY = "THIRD_FLOOR_LEFT_DISPLAY",
  THIRD_FLOOR_RIGHT_DISPLAY = "THIRD_FLOOR_RIGHT_DISPLAY",
  OPENDECK = "OPENDECK",
}

export interface ApplicationConfig {
  VERSION: string
  REVISION: string
  VEEDRIVE_WS_PATH: string
  FILE_BROWSER_WIDTH: number
  FILE_BROWSER_HEIGHT: number
  FILE_BROWSER_OPEN_MEDIA_OFFSET: number
  FILE_BROWSER_OPEN_MEDIA_CASCADE_OFFSET_X: number
  FILE_BROWSER_OPEN_MEDIA_CASCADE_OFFSET_Y: number
  FILE_BROWSER_OPEN_MEDIA_CASCADE_MAX_PER_ROW: number
  FILE_BROWSER_OPEN_MEDIA_CASCADE_DELAY_MS: number
  VIEWPORT_WIDTH: number
  VIEWPORT_HEIGHT: number
  MINIMUM_FRAME_LONG_SIDE: number
  MAXIMUM_FRAME_LONG_SIDE: number
  ALLOW_SCALE_WITH_MOUSEWHEEL: boolean
  ALLOW_MAX_LAUNCHER_MENUS: number
  DISPLAY_MOUSE_CURSOR: boolean
  DEFAULT_NEW_FRAME_WIDTH: number
  DEFAULT_NEW_FRAME_HEIGHT: number
  FULLSCREEN_TRANSITION_MS: number
  LAUNCHER_MENU_SIZE: string
  SENTRY_DSN: string
  SENTRY_EXCLUDE_ENVIRONMENTS: RunningEnvironment[]
  RUNNING_ENVIRONMENT: RunningEnvironment
}
