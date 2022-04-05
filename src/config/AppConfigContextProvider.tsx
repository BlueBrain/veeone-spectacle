import AppConfigContext from "./AppConfigContext"
import React, { useMemo } from "react"
import getConfig from "./get-config"

const AppConfigContextProvider: React.FC = ({ children }) => {
  const config = useMemo(() => getConfig(), [])
  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  )
}

export default AppConfigContextProvider
