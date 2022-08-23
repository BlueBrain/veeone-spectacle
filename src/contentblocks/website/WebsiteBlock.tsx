import React, { useContext, useEffect, useState } from "react"
import { ContentBlockProps } from "../types"
import { FrameContext } from "../../frames"
import WebsiteBlockContextProvider from "./WebsiteBlockContextProvider"
import WebsiteBlockContent from "./WebsiteBlockContent"
import { WebsiteBlockContentData } from "./types"

const WebsiteBlock: React.FC<ContentBlockProps> = ({ contentData }) => {
  const frameContext = useContext(FrameContext)
  useEffect(() => {
    frameContext.preventFullscreen()
  }, [frameContext])

  return (
    <WebsiteBlockContextProvider
      contentData={contentData as WebsiteBlockContentData}
    >
      <WebsiteBlockContent />
    </WebsiteBlockContextProvider>
  )
}

export default WebsiteBlock
