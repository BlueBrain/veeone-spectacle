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
import styled from "styled-components"
import { ContentBlockProps } from "../types"
import fileService from "../../veedrive/service"
import { FrameContext } from "../../core/frames"
import PlaybackControls from "./PlaybackControls"
import VideoBlockContext, { VideoBlockContextProps } from "./VideoBlockContext"
import FrameControlBar from "../../core/frames/FrameControlBar"

const StyledVideoBlock = styled.div`
  background: #000;
  width: 100%;
  height: 100%;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
`

const StyledOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
`

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
      <StyledVideoBlock data-drag-handle={true}>
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
        ) : null}
        <StyledOverlay onClick={handleOverlayClick} />
        <PlaybackControls videoRef={videoRef} />
      </StyledVideoBlock>
      <FrameControlBar floating={true} />
    </VideoBlockContext.Provider>
  )
}

export default VideoBlock
