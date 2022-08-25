import React, { useEffect } from "react"
import WebsiteBlockContextProvider from "./WebsiteBlockContextProvider"
import WebsiteBlockContent from "./WebsiteBlockContent"
import { useFrame } from "../../frames/FrameContext"

const WebsiteBlock: React.FC = () => {
  const { preventFullscreen } = useFrame()

  useEffect(() => {
    preventFullscreen()
  }, [preventFullscreen])

  return (
    <WebsiteBlockContextProvider>
      <WebsiteBlockContent />
    </WebsiteBlockContextProvider>
  )
}

export default WebsiteBlock
