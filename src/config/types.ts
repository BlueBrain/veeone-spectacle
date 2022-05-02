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
  LAUNCHER_MENU_SIZE: string
}
