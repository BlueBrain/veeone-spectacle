import { Box, CircularProgress, Grid } from "@mui/material"
import PlaybackControls from "./PlaybackControls"
import React, {
  CSSProperties,
  forwardRef,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react"
import { useSpectacle } from "../../spectacle/SpectacleStateContext"

interface OnVideoLoadedArgs {
  width: number
  height: number
}

interface VideoBlockContentProps {
  contentData: VideoBlockParams
  onFullscreenToggle(): void
  onVideoLoaded?(args: OnVideoLoadedArgs): void
  startAt?: number
  allowPlayingInFullscreenMode?: boolean
}

export interface VideoBlockParams {
  path: string
}

const VideoBlockContent: React.FC<VideoBlockContentProps> = (
  {
    contentData,
    onFullscreenToggle,
    onVideoLoaded,
    startAt,
    allowPlayingInFullscreenMode,
  },
  videoRef
) => {
  const { veeDriveService } = useSpectacle()
  const { path } = contentData
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

  useEffect(
    () => {
      if (videoRef.current && startAt) {
        videoRef.current.currentTime = startAt
      }
    },
    // `videoRef.current` is used instead of `videoRef` because otherwise
    // the current time is not passed correctly
    [startAt, videoRef.current]
  )

  return (
    <>
      {videoSource ? (
        <Box
          component={"video"}
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
        </Box>
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
          allowPlayingInFullscreenMode={allowPlayingInFullscreenMode}
          onActiveModeToggle={handleActiveModeToggle}
          onFullscreenToggle={handleFullscreenToggle}
        />
      ) : null}
    </>
  )
}

const VideoBlockContentWithRef = forwardRef(VideoBlockContent)

export default VideoBlockContentWithRef
