import React, { useCallback, useMemo, useState } from "react"
import WebsiteBlockContext, {
  WebsiteBlockContextProps,
} from "./WebsiteBlockContext"
import { WebsiteBlockContentData } from "./types"
import { useDispatch } from "react-redux"
import { updateFrameData } from "../../redux/actions"
import { useFrame } from "../../frames/FrameContext"
import { FrameData } from "../../types"

interface WebsiteBlockContextProviderProps {
  contentData: WebsiteBlockContentData
}

const WebsiteBlockContextProvider: React.FC<WebsiteBlockContextProviderProps> = ({
  contentData,
  children,
}) => {
  const dispatch = useDispatch()
  const { frameId } = useFrame()
  const { websiteUrl } = contentData
  const [isInteractiveMode, setIsInteractiveMode] = useState(false)

  const activateInteractiveMode = useCallback(
    () => setIsInteractiveMode(true),
    []
  )

  const deactivateInteractiveMode = useCallback(
    () => setIsInteractiveMode(false),
    []
  )

  const navigateUrl = useCallback(
    (newUrl: string) => {
      const frameData: WebsiteBlockContentData = {
        websiteUrl: newUrl,
      }
      console.debug("Navigate to", newUrl)
      dispatch(updateFrameData(frameId, frameData))
    },
    [dispatch, frameId]
  )

  const navigateHome = useCallback(() => {
    navigateUrl("https://epfl.ch")
  }, [navigateUrl])

  const navigateBack = useCallback(() => {
    console.error("not implemented")
  }, [])

  const navigateForward = useCallback(() => {
    console.error("not implemented")
  }, [])

  const providerValue: WebsiteBlockContextProps = useMemo(
    () => ({
      websiteUrl,
      activateInteractiveMode,
      deactivateInteractiveMode,
      isInteractiveMode,
      navigateForward,
      navigateBack,
      navigateHome,
      navigateUrl,
    }),
    [
      activateInteractiveMode,
      deactivateInteractiveMode,
      isInteractiveMode,
      navigateBack,
      navigateForward,
      navigateHome,
      navigateUrl,
      websiteUrl,
    ]
  )

  return (
    <WebsiteBlockContext.Provider value={providerValue}>
      {children}
    </WebsiteBlockContext.Provider>
  )
}

export default WebsiteBlockContextProvider
