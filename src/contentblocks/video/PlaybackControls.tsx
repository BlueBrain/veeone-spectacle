import React, {
  RefObject,
  useCallback,
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
} from "@mui/icons-material"
import { IconButton, Slider } from "@mui/material"
import withStyles from "@mui/styles/withStyles"
import interact from "interactjs"
import { friendlyFormatTime } from "./display"
import { useSpectacle, ViewMode } from "../../core/spectacle/SpectacleContext"
import { useDesk } from "../../core/desk/DeskContext"

const CONTROLS_FADING_TIME_MS = 500
const CONTROLS_AUTO_HIDE_AFTER_MS = 5000

interface PlaybackControlsProps {
  onActiveModeToggle(handlerFunction: Function): void
  onFullscreenToggle(): void
  videoRef: RefObject<HTMLVideoElement>
}

interface StyledPlaybackControlsProps {
  active: boolean
  activeCssDisplay: boolean
}

const StyledPlaybackControls = styled.div`
  width: clamp(30%, 40%, 40%);
  height: clamp(100px, 20%, 20%);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  transition: opacity ease ${CONTROLS_FADING_TIME_MS}ms;

  ${({ active, activeCssDisplay }: StyledPlaybackControlsProps) => `
    opacity: ${active ? `0.7` : `0`};
    visibility: ${active || activeCssDisplay ? `visible` : `hidden`};
    `}

  svg {
    fill: rgba(255, 255, 255, 1);
    filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.8));
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
    width: 22,
    height: 22,
  },
  rail: {
    height: 8,
  },
  track: {
    height: 8,
    color: `#ff0000`,
  },
})(Slider)

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  videoRef,
  onFullscreenToggle,
  onActiveModeToggle,
}) => {
  const controlsRef = useRef(null)
  const sliderRef = useRef(null)
  const [currentTime, setCurrentTime] = useState<number>(null)
  const [totalTime, setTotalTime] = useState<number>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [active, setActive] = useState(true)
  const [activeCssDisplay, setActiveCssDisplay] = useState(active)
  const [autoHideTimeoutId, setAutoHideTimeoutId] = useState(null)
  const { viewMode, activeSceneId } = useSpectacle()
  const { sceneId } = useDesk()

  const isPlayingAllowed = useMemo(
    () => viewMode === ViewMode.Desk && sceneId === activeSceneId,
    [activeSceneId, sceneId, viewMode]
  )

  const handlePlayButton = () => {
    setIsPlaying(!isPlaying)
  }

  const handleForwardButton = () => {
    videoRef.current.currentTime += 10
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleReplayButton = () => {
    videoRef.current.currentTime -= 10
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleSliderChange = (value: number) => {
    videoRef.current.currentTime = Math.floor((totalTime * value) / 100)
    setCurrentTime(videoRef.current.currentTime)
    restartHidingTimer()
  }

  // Reset timer that otherwise hides the playback controls
  const restartHidingTimer = useCallback(() => {
    autoHideTimeoutId && clearTimeout(autoHideTimeoutId)
    const timeoutId = setTimeout(() => {
      setActive(false)
    }, CONTROLS_AUTO_HIDE_AFTER_MS)
    setAutoHideTimeoutId(timeoutId)
  }, [autoHideTimeoutId])

  useEffect(() => {
    if (active) {
      restartHidingTimer()
    }
    return () => {
      autoHideTimeoutId && clearTimeout(autoHideTimeoutId)
    }
  }, [])

  // Allow changing active mode from external components within this video context
  useEffect(() => {
    const toggleActive = () => {
      setActive(!active)
    }
    onActiveModeToggle(() => toggleActive)
    if (active) {
      restartHidingTimer()
    }
    return () => {
      autoHideTimeoutId && clearTimeout(autoHideTimeoutId)
    }
  }, [active, onActiveModeToggle])

  // Play/Pause handling
  useEffect(() => {
    if (!videoRef.current) {
      return
    }

    async function handlePlaybackState() {
      if (isPlaying && isPlayingAllowed) {
        await videoRef.current.play()
      } else {
        await videoRef.current.pause()
      }
    }

    void handlePlaybackState()
  }, [videoRef, isPlaying, isPlayingAllowed])

  // Indicate current time
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
    const currentControlsRef = controlsRef.current
    const currentSliderRef = sliderRef.current
    if (currentControlsRef) {
      interact(currentControlsRef).on("doubletap", event => {
        event.stopPropagation()
      })
    }

    if (currentSliderRef) {
      // Prevent moving a frame when using the slider playback component
      const disabledEvent = event => {
        event.stopPropagation()
      }
      interact(currentSliderRef)
        .draggable({
          onstart: disabledEvent,
        })
        .gesturable({
          onstart: disabledEvent,
        })
    }

    return () => {
      interact(currentControlsRef).unset()
      interact(currentSliderRef).unset()
    }
  }, [])

  useEffect(() => {
    let timeout
    if (!active) {
      timeout && clearTimeout(timeout)
      timeout = setTimeout(
        () => setActiveCssDisplay(false),
        CONTROLS_FADING_TIME_MS
      )
    } else {
      setActiveCssDisplay(true)
    }
    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [active])

  const timelineProgress = useMemo(() => {
    return totalTime ? Math.ceil((100 * currentTime) / totalTime) : 0
  }, [currentTime, totalTime])

  const currentTimeFriendly = useMemo(() => friendlyFormatTime(currentTime), [
    currentTime,
  ])

  const totalTimeFriendly = useMemo(() => friendlyFormatTime(totalTime), [
    totalTime,
  ])

  return (
    <>
      <StyledPlaybackControls
        ref={controlsRef}
        active={active}
        activeCssDisplay={activeCssDisplay}
        onClick={restartHidingTimer}
      >
        <StyledPlaybackButtons>
          <IconButton onClick={handleReplayButton} size="large">
            <Replay10 />
          </IconButton>
          <IconButton onClick={handlePlayButton} size="large">
            {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
          </IconButton>
          <IconButton onClick={handleForwardButton} size="large">
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
          <IconButton onClick={onFullscreenToggle} size="large">
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
