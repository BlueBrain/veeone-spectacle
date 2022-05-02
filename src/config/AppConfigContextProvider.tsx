import AppConfigContext from "./AppConfigContext"
import React, { useEffect, useMemo } from "react"
import getConfig from "./get-config"

const AppConfigContextProvider: React.FC = ({ children }) => {
  const config = useMemo(() => getConfig(), [])

  useEffect(() => {
    console.info(`Spectacle ${config.VERSION} (revision: ${config.REVISION})`)
    console.info(`Running Environment = ${config.RUNNING_ENVIRONMENT}`)
  }, [config.REVISION, config.RUNNING_ENVIRONMENT, config.VERSION])

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  )
}

export default AppConfigContextProvider
