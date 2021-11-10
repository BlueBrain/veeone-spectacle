import React, {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import styled from "styled-components"
import {
  Forward10,
  Fullscreen,
  PauseRounded,
  PlayArrowRounded,
  Replay10,
} from "@material-ui/icons"
import { IconButton, Slider, withStyles } from "@material-ui/core"
import interact from "interactjs"
import { friendlyFormatTime } from "./display"
import { FrameContext } from "../../core/frames"

interface PlaybackControlsProps {
  videoRef: RefObject<HTMLVideoElement>
}

const StyledPlaybackControls = styled.div`
  width: clamp(300px, 40%, 600px);
  height: clamp(100px, 20%, 20%);
  //background: rgba(255, 0, 0, 0.5);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  opacity: 0.7;

  svg {
    fill: rgba(255, 255, 255, 1);
    filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.8));
  }
`

const StyledPlaybackButtons = styled.div`
  display: flex;
  flex-basis: 100%;
  height: 100%;
  justify-content: space-around;
  flex-direction: row;

  button {
    display: flex;
    flex-grow: 1;
  }

  .MuiIconButton-label {
    height: 100%;
  }

  svg {
    width: clamp(50px, 80%, 80%);
    height: 100%;
    display: flex;
  }
`

const StyledScrubBar = styled.div`
  //background: rgba(0, 255, 0, 0.4);
  display: flex;
  align-items: center;
`

const StyledFooter = styled.div`
  font-size: 0.8rem;
`

const TimelineSlider = withStyles({
  root: {
    color: `#ffffff`,
  },
  thumb: {
    width: 20,
    height: 20,
    marginTop: -6,
    marginLeft: -10,
  },
  rail: {
    height: 8,
  },
  track: {
    height: 8,
    color: `#ff0000`,
  },
})(Slider)

const PlaybackControls: React.FC<PlaybackControlsProps> = ({ videoRef }) => {
  const controlsRef = useRef(null)
  const sliderRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const { toggleFullscreen } = useContext(FrameContext)

  const handlePlayButton = () => {
    console.debug("PLAY / PAUSE button pressed")
    setIsPlaying(!isPlaying)
  }

  const handleForwardButton = () => {
    console.debug("FORWARD button pressed")
    videoRef.current.currentTime += 10
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleReplayButton = () => {
    console.debug("REPLAY button pressed")
    videoRef.current.currentTime -= 10
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleSliderChange = (value: number) => {
    videoRef.current.currentTime = Math.floor((totalTime * value) / 100)
    setCurrentTime(videoRef.current.currentTime)
  }

  useEffect(() => {
    if (!videoRef.current) {
      return
    }
    async function handlePlaybackState() {
      if (isPlaying) {
        await videoRef.current.play()
      } else {
        await videoRef.current.pause()
      }
    }
    void handlePlaybackState()
  }, [videoRef, isPlaying])

  const refreshVideoTime = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(Math.floor(videoRef.current.currentTime))
      setTotalTime(Math.floor(videoRef.current.duration))
    }
  }, [videoRef])

  useEffect(() => {
    const interval = setInterval(refreshVideoTime, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [refreshVideoTime, videoRef])

  useEffect(() => {
    if (controlsRef.current) {
      interact(controlsRef.current).on("doubletap", event => {
        console.debug("Caught doubletap in VIDEO CONTROLS - STOP PROPAGATION")
        event.stopPropagation()
      })
    }

    if (sliderRef.current) {
      // Prevent moving a frame when using the slider playback component
      const disabledEvent = event => {
        event.stopPropagation()
      }
      interact(sliderRef.current)
        .draggable({
          onstart: disabledEvent,
        })
        .gesturable({
          onstart: disabledEvent,
        })
    }
  }, [])

  const timelineProgress = useMemo(() => {
    return Math.ceil((100 * currentTime) / totalTime)
  }, [currentTime, totalTime])

  const currentTimeFriendly = useMemo(() => friendlyFormatTime(currentTime), [
    currentTime,
  ])

  const totalTimeFriendly = useMemo(() => friendlyFormatTime(totalTime), [
    totalTime,
  ])

  return (
    <>
      <StyledPlaybackControls ref={controlsRef}>
        <StyledPlaybackButtons>
          <IconButton onClick={handleReplayButton}>
            <Replay10 />
          </IconButton>
          <IconButton onClick={handlePlayButton}>
            {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
          </IconButton>
          <IconButton onClick={handleForwardButton}>
            <Forward10 />
          </IconButton>
        </StyledPlaybackButtons>
        <StyledScrubBar ref={sliderRef}>
          <TimelineSlider
            value={timelineProgress}
            color={"primary"}
            onChange={(event, newValue) =>
              handleSliderChange(newValue as number)
            }
          />
          <IconButton onClick={toggleFullscreen}>
            <Fullscreen />
          </IconButton>
        </StyledScrubBar>
        <StyledFooter>
          {currentTimeFriendly} / {totalTimeFriendly}
        </StyledFooter>
      </StyledPlaybackControls>
    </>
  )
}

export default PlaybackControls
