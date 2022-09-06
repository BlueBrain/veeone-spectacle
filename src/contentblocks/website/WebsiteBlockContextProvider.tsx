import React, { useCallback, useMemo, useState } from "react"
import WebsiteBlockContext, {
  WebsiteBlockContextProps,
} from "./WebsiteBlockContext"
import { WebsiteBlockContentData } from "./types"
import { useFrame } from "../../frames/FrameContext"
import { useConfig } from "../../config/AppConfigContext"
import { generateRandomId } from "../../common/random"
import { useSpectacle } from "../../spectacle/SpectacleStateContext"

const WebsiteBlockContextProvider: React.FC = ({ children }) => {
  const config = useConfig()
  const { updateFrameData } = useSpectacle()
  const { frameId, frameContentData } = useFrame()
  const {
    websiteUrl,
    isInteractiveModeOn,
    zoomLevel,
  } = frameContentData as WebsiteBlockContentData
  const [websiteIframeKey, setWebsiteIframeKey] = useState(websiteUrl)

  const zoomLevelValue = useMemo(
    () =>
      typeof zoomLevel !== "number"
        ? config.WEBSITE_BLOCK_DEFAULT_ZOOM
        : zoomLevel,
    [config.WEBSITE_BLOCK_DEFAULT_ZOOM, zoomLevel]
  )

  const isInteractiveModeOnValue = useMemo(
    () =>
      typeof isInteractiveModeOn !== "undefined" ? isInteractiveModeOn : false,
    [isInteractiveModeOn]
  )

  const activateInteractiveMode = useCallback(() => {
    const frameData: Partial<WebsiteBlockContentData> = {
      isInteractiveModeOn: true,
    }
    updateFrameData({ frameId, data: frameData })
  }, [frameId, updateFrameData])

  const deactivateInteractiveMode = useCallback(() => {
    const frameData: Partial<WebsiteBlockContentData> = {
      isInteractiveModeOn: false,
    }
    updateFrameData({ frameId, data: frameData })
  }, [frameId, updateFrameData])

  const navigateUrl = useCallback(
    (newUrl: string) => {
      const frameData: Partial<WebsiteBlockContentData> = {
        websiteUrl: newUrl,
      }
      setWebsiteIframeKey(`${websiteUrl}-${generateRandomId()}`)
      updateFrameData({ frameId, data: frameData })
    },
    [updateFrameData, frameId, websiteUrl]
  )

  const navigateHome = useCallback(() => {
    navigateUrl(config.WEBSITE_BLOCK_HOME_URL)
  }, [config.WEBSITE_BLOCK_HOME_URL, navigateUrl])

  const navigateBack = useCallback(() => {
    console.error("not implemented")
  }, [])

  const navigateForward = useCallback(() => {
    console.error("not implemented")
  }, [])

  const zoomPageIn = useCallback(() => {
    const data: Partial<WebsiteBlockContentData> = {
      zoomLevel:
        zoomLevelValue < config.WEBSITE_BLOCK_MAX_ZOOM
          ? zoomLevelValue + config.WEBSITE_BLOCK_ZOOM_STEP
          : zoomLevelValue,
    }
    updateFrameData({ frameId, data })
  }, [
    config.WEBSITE_BLOCK_MAX_ZOOM,
    config.WEBSITE_BLOCK_ZOOM_STEP,
    frameId,
    zoomLevelValue,
    updateFrameData,
  ])

  const zoomPageOut = useCallback(() => {
    const data: Partial<WebsiteBlockContentData> = {
      zoomLevel:
        zoomLevelValue > config.WEBSITE_BLOCK_MIN_ZOOM
          ? zoomLevelValue - config.WEBSITE_BLOCK_ZOOM_STEP
          : zoomLevelValue,
    }
    updateFrameData({ frameId, data })
  }, [
    config.WEBSITE_BLOCK_MIN_ZOOM,
    config.WEBSITE_BLOCK_ZOOM_STEP,
    updateFrameData,
    frameId,
    zoomLevelValue,
  ])

  const providerValue: WebsiteBlockContextProps = useMemo(
    () => ({
      websiteUrl,
      activateInteractiveMode,
      deactivateInteractiveMode,
      isInteractiveModeOn: isInteractiveModeOnValue,
      navigateForward,
      navigateBack,
      navigateHome,
      navigateUrl,
      zoomPageOut,
      zoomPageIn,
      zoomLevel: zoomLevelValue,
      websiteIframeKey,
    }),
    [
      activateInteractiveMode,
      deactivateInteractiveMode,
      isInteractiveModeOnValue,
      navigateBack,
      navigateForward,
      navigateHome,
      navigateUrl,
      websiteUrl,
      zoomLevelValue,
      zoomPageIn,
      zoomPageOut,
      websiteIframeKey,
    ]
  )

  return (
    <WebsiteBlockContext.Provider value={providerValue}>
      {children}
    </WebsiteBlockContext.Provider>
  )
}

export default WebsiteBlockContextProvider
