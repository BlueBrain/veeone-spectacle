declare const ENV_VARIABLES: any

console.debug("ENV_VARIABLES", ENV_VARIABLES)

const defaults = {
  VEEDRIVE_WS_PATH: "ws://localhost:4444/ws",
}

const AppConfig = {
  VEEDRIVE_WS_PATH:
    ENV_VARIABLES.SPECTACLE_VEEDRIVE_WS_PATH ?? defaults.VEEDRIVE_WS_PATH,
}

export default AppConfig
