import React, {
  CSSProperties,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { ContentBlockProps } from "../types"
import fileService from "../../veedrive"
import { FrameContext } from "../../core/frames"
import PlaybackControls from "./PlaybackControls"
import VideoBlockContext, { VideoBlockContextProps } from "./VideoBlockContext"
import { Box, CircularProgress, Grid } from "@mui/material"
import FloatingFrameControlBar from "../../core/frames/FloatingFrameControlBar"

interface VideoBlockParams {
  path: string
}

const VideoBlock: React.FC<ContentBlockProps> = ({ contentData }) => {
  const videoRef = useRef(null)
  const { updateAspectRatio } = useContext(FrameContext)
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
      const response = await fileService.requestFile({ path: path })
      console.debug("VideoBlock path=", response.url)
      setVideoSource(response.url)
    }
    void loadFromVeeDrive()
  }, [path])

  const handleMetadata = (event: SyntheticEvent<HTMLVideoElement, Event>) => {
    const { videoWidth, videoHeight } = event.target as HTMLVideoElement
    const aspectRatio = videoWidth / videoHeight
    updateAspectRatio(aspectRatio)
  }

  const handleOverlayClick = useCallback(() => {
    activeModeToggleHandler()
  }, [activeModeToggleHandler])

  const contextProvider: VideoBlockContextProps = useMemo(
    () => ({
      setActiveModeToggleHandler: handlerFunction => {
        setActiveModeToggleHandler(handlerFunction)
      },
    }),
    []
  )

  return (
    <VideoBlockContext.Provider value={contextProvider}>
      <Box
        data-drag-handle={true}
        sx={{
          background: "#000",
          width: "100%",
          height: "100%",
          boxShadow: 3,
        }}
      >
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
        {videoSource ? <PlaybackControls videoRef={videoRef} /> : null}
      </Box>
      <FloatingFrameControlBar />
    </VideoBlockContext.Provider>
  )
}

export default VideoBlock
