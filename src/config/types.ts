export enum RunningEnvironment {
  // Use "DEV" for local development.
  // Place SPECTACLE_RUNNING_ENVIRONMENT=DEV entry in your .env file
  DEV = "DEV",
  // Client is used for users' browsers when they open Spectacle "web client"
  CLIENT = "CLIENT",
  // These are "real-world" installations where Spectacle is deployed with full touch experience
  SIXTH_FLOOR_DISPLAY_WALL = "SIXTH_FLOOR_DISPLAY_WALL",
  FIFTH_FLOOR_DISPLAY_WALL = "FIFTH_FLOOR_DISPLAY_WALL",
  THIRD_FLOOR_LEFT_DISPLAY = "THIRD_FLOOR_LEFT_DISPLAY",
  THIRD_FLOOR_RIGHT_DISPLAY = "THIRD_FLOOR_RIGHT_DISPLAY",
  OPENDECK = "OPENDECK",
}

export interface ApplicationConfig {
  CLIENT_ID: string
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
  FILE_BROWSER_SEARCH_QUERY_CHARS_MIN: number
  FRAME_CONTROLS_ALWAYS_VISIBLE: boolean
  TOUCH_HOLD_DURATION_MS: number
  BASE_FONT_SIZE: number
  VIEWPORT_WIDTH: number
  VIEWPORT_HEIGHT: number
  MINIMUM_FRAME_LONG_SIDE: number
  MAXIMUM_FRAME_LONG_SIDE: number
  DIALOG_SAFETY_MARGIN_HORIZONTAL_PX: number
  DIALOG_SAFETY_MARGIN_VERTICAL_PX: number
  ALLOW_SCALE_WITH_MOUSEWHEEL: boolean
  ALLOW_MAX_LAUNCHER_MENUS: number
  DISPLAY_MOUSE_CURSOR: boolean
  DEFAULT_NEW_FRAME_WIDTH: number
  DEFAULT_NEW_FRAME_HEIGHT: number
  FULLSCREEN_TRANSITION_MS: number
  LAUNCHER_MENU_SIZE_REM: number
  SENTRY_DSN: string
  SENTRY_EXCLUDE_ENVIRONMENTS: RunningEnvironment[]
  IS_SENTRY_ENABLED: boolean
  RUNNING_ENVIRONMENT: RunningEnvironment
  IMAGE_KEEPER_AS_SINGLE_WORKER: boolean
  LOAD_IMAGES_AS_CSS_BACKGROUND: boolean
  IMAGE_BLUR_BACKGROUND_OPACITY: number | string
  SYNEC_CHECKIN_ENABLED: boolean
  SYNEC_CHECKIN_WS_PATH: string
  SYNEC_CONTROLLER_WS_PATH: string
  SYNEC_STATUS_UPDATE_INTERVAL_MS: number
  LAUNCHER_SUBWEDGE_ANGLE: number
  LAUNCHER_MENU_SAFETY_MARGIN_REM: number
  WEBSITE_BLOCK_MIN_ZOOM: number
  WEBSITE_BLOCK_MAX_ZOOM: number
  WEBSITE_BLOCK_ZOOM_STEP: number
  WEBSITE_BLOCK_DEFAULT_ZOOM: number
  WEBSITE_BLOCK_HOME_URL: string
  WEBSITE_BLOCK_ALLOW_CHANGING_URL: boolean
  WEBSITE_BLOCK_DEFAULT_WIDTH: number
  WEBSITE_BLOCK_DEFAULT_HEIGHT: number
  STORE_STATE_KEEP_MAX_COUNT: number
  INFINITE_RELOAD_PROTECTION_PERIOD_SECONDS: number
  INFINITE_RELOAD_PROTECTION_MAX_ATTEMPTS: number
  STATE_STORE_INDEXEDDB_NAME: string
}
