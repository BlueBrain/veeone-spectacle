import React, { useCallback, useMemo, useState } from "react"
import WebsiteBlockContext, {
  WebsiteBlockContextProps,
} from "./WebsiteBlockContext"
import { WebsiteBlockContentData } from "./types"
import { useDispatch } from "react-redux"
import { updateFrameData } from "../../redux/actions"
import { useFrame } from "../../frames/FrameContext"
import { useConfig } from "../../config/AppConfigContext"
import { generateRandomId } from "../../common/random"

const WebsiteBlockContextProvider: React.FC = ({ children }) => {
  const config = useConfig()
  const dispatch = useDispatch()
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
    dispatch(updateFrameData(frameId, frameData))
  }, [dispatch, frameId])

  const deactivateInteractiveMode = useCallback(() => {
    const frameData: Partial<WebsiteBlockContentData> = {
      isInteractiveModeOn: false,
    }
    dispatch(updateFrameData(frameId, frameData))
  }, [dispatch, frameId])

  const navigateUrl = useCallback(
    (newUrl: string) => {
      const frameData: Partial<WebsiteBlockContentData> = {
        websiteUrl: newUrl,
      }
      setWebsiteIframeKey(`${websiteUrl}-${generateRandomId()}`)
      dispatch(updateFrameData(frameId, frameData))
    },
    [dispatch, frameId, websiteUrl]
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
    dispatch(updateFrameData(frameId, data))
  }, [
    config.WEBSITE_BLOCK_MAX_ZOOM,
    config.WEBSITE_BLOCK_ZOOM_STEP,
    dispatch,
    frameId,
    zoomLevelValue,
  ])

  const zoomPageOut = useCallback(() => {
    const data: Partial<WebsiteBlockContentData> = {
      zoomLevel:
        zoomLevelValue > config.WEBSITE_BLOCK_MIN_ZOOM
          ? zoomLevelValue - config.WEBSITE_BLOCK_ZOOM_STEP
          : zoomLevelValue,
    }
    dispatch(updateFrameData(frameId, data))
  }, [
    config.WEBSITE_BLOCK_MIN_ZOOM,
    config.WEBSITE_BLOCK_ZOOM_STEP,
    dispatch,
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
