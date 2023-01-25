import AppConfigContext from "./AppConfigContext"
import React, { useEffect, useMemo } from "react"
import getConfig from "./get-config"

const AppConfigContextProvider: React.FC = ({ children }) => {
  const config = useMemo(() => getConfig(), [])

  useEffect(() => {}, [
    config.REVISION,
    config.RUNNING_ENVIRONMENT,
    config.VERSION,
  ])

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  )
}

export default AppConfigContextProvider
