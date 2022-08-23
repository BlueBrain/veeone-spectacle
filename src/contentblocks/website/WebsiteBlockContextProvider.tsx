import React, { useMemo } from "react"
import WebsiteBlockContext from "./WebsiteBlockContext"
import { WebsiteBlockContentData } from "./types"

interface WebsiteBlockContextProviderProps {
  contentData: WebsiteBlockContentData
}

const WebsiteBlockContextProvider: React.FC<WebsiteBlockContextProviderProps> = ({
  contentData,
  children,
}) => {
  const { websiteUrl } = contentData

  const providerValue = useMemo(
    () => ({
      websiteUrl,
    }),
    [websiteUrl]
  )

  return (
    <WebsiteBlockContext.Provider value={providerValue}>
      {children}
    </WebsiteBlockContext.Provider>
  )
}

export default WebsiteBlockContextProvider
