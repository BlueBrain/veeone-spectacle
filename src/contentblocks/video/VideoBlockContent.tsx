import { Box, CircularProgress, Grid } from "@mui/material"
import PlaybackControls from "./PlaybackControls"
import React, {
  CSSProperties,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useConfig } from "../../config/AppConfigContext"
import VeeDriveService from "../../veedrive"
import { Json } from "../../common/types"

interface OnVideoLoadedArgs {
  width: number
  height: number
}

interface VideoBlockContentProps {
  contentData: { [key: string]: Json } | any
  onFullscreenToggle(): void
  onVideoLoaded?(args: OnVideoLoadedArgs): void
}

interface VideoBlockParams {
  path: string
}

const VideoBlockContent: React.FC<VideoBlockContentProps> = ({
  contentData,
  onFullscreenToggle,
  onVideoLoaded,
}) => {
  const config = useConfig()
  const veeDriveService = useMemo(() => new VeeDriveService(config), [config])
  const videoRef = useRef(null)
  const { path } = (contentData as unknown) as VideoBlockParams
  const [videoSource, setVideoSource] = useState("")
  const [activeModeToggleHandler, setActiveModeToggleHandler] = useState(null)
  const elementStyle: CSSProperties = {
    boxSizing: "border-box",
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  }

  useEffect(() => {
    async function loadFromVeeDrive() {
      const response = await veeDriveService.requestFile({ path: path })
      console.debug("VideoBlock path=", response.url)
      setVideoSource(response.url)
    }
    void loadFromVeeDrive()
  }, [path, veeDriveService])

  const handleMetadata = (event: SyntheticEvent<HTMLVideoElement, Event>) => {
    const { videoWidth, videoHeight } = event.target as HTMLVideoElement
    onVideoLoaded && onVideoLoaded({ width: videoWidth, height: videoHeight })
  }

  const handleOverlayClick = useCallback(() => {
    activeModeToggleHandler && activeModeToggleHandler()
  }, [activeModeToggleHandler])

  const handleFullscreenToggle = useCallback(() => {
    onFullscreenToggle && onFullscreenToggle()
  }, [onFullscreenToggle])

  const handleActiveModeToggle = useCallback(handlerFunction => {
    setActiveModeToggleHandler(handlerFunction)
  }, [])

  return (
    <>
      {videoSource ? (
        <video
          width={"100%"}
          height={"100%"}
          autoPlay={true}
          style={elementStyle}
          loop={true}
          muted={true}
          onLoadedMetadata={handleMetadata}
          ref={videoRef}
          disablePictureInPicture
        >
          <source src={videoSource} />
        </video>
      ) : (
        <Grid
          container
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ height: "100%" }}
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )}
      <Box
        onClick={handleOverlayClick}
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
        }}
      />
      {videoSource ? (
        <PlaybackControls
          videoRef={videoRef}
          onActiveModeToggle={handleActiveModeToggle}
          onFullscreenToggle={handleFullscreenToggle}
        />
      ) : null}
    </>
  )
}

export default VideoBlockContent
