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
import { useSpectacle, ViewMode } from "../../spectacle/SpectacleStateContext"
import { useDesk } from "../../desk/DeskContext"
import { useScenes } from "../../scenes/SceneContext"
import { useFrame } from "../../frames/FrameContext"
import { useConfig } from "../../config/AppConfigContext"
import { RunningEnvironment } from "../../config/types"

const CONTROLS_FADING_TIME_MS = 500
const CONTROLS_AUTO_HIDE_AFTER_MS = 5000

interface PlaybackControlsProps {
  onActiveModeToggle(handlerFunction: Function): void
  onFullscreenToggle(): void
  videoRef: RefObject<HTMLVideoElement>
  allowPlayingInFullscreenMode?: boolean
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
  allowPlayingInFullscreenMode,
}) => {
  const controlsRef = useRef(null)
  const sliderRef = useRef(null)

  const { RUNNING_ENVIRONMENT } = useConfig()
  const shouldAutoPlayByDefault = ![
    RunningEnvironment.CLIENT,
    RunningEnvironment.DEV,
  ].includes(RUNNING_ENVIRONMENT)

  const [currentTime, setCurrentTime] = useState<number>(null)
  const [totalTime, setTotalTime] = useState<number>(null)
  const [isPlaying, setIsPlaying] = useState(shouldAutoPlayByDefault)
  const [active, setActive] = useState(true)
  const [activeCssDisplay, setActiveCssDisplay] = useState(active)
  const { viewMode } = useSpectacle()
  const { sceneId, fullscreenFrame } = useDesk()
  const { activeSceneId } = useScenes()
  const autoHideTimeoutId = useRef(null)
  const frameAttrs = useFrame()

  const isPlaybackAllowed = useMemo(
    () =>
      viewMode === ViewMode.Desk &&
      sceneId === activeSceneId &&
      (!fullscreenFrame || allowPlayingInFullscreenMode),
    [
      activeSceneId,
      allowPlayingInFullscreenMode,
      fullscreenFrame,
      sceneId,
      viewMode,
    ]
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
    const newTime = Math.floor((totalTime * value) / 100)
    if (Number.isFinite(newTime)) {
      videoRef.current.currentTime = newTime
      setCurrentTime(videoRef.current.currentTime)
      restartHidingTimer()
    }
  }

  // Reset timer that otherwise hides the playback controls
  const restartHidingTimer = useCallback(() => {
    autoHideTimeoutId.current && clearTimeout(autoHideTimeoutId.current)
    autoHideTimeoutId.current = setTimeout(() => {
      setActive(false)
    }, CONTROLS_AUTO_HIDE_AFTER_MS)
  }, [autoHideTimeoutId])

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
      autoHideTimeoutId.current && clearTimeout(autoHideTimeoutId.current)
    }
  }, [active, onActiveModeToggle, restartHidingTimer, setActive])

  // Play/Pause handling
  useEffect(() => {
    if (!videoRef.current) {
      return
    }

    async function handlePlaybackState() {
      const playPromise = videoRef.current.play()

      if (playPromise !== undefined) {
        if (isPlaying && isPlaybackAllowed) {
          await playPromise
        } else {
          playPromise.then(() => {
            videoRef.current.pause()
          })
        }
      }
    }

    void handlePlaybackState()
  }, [videoRef, isPlaying, isPlaybackAllowed])

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
      if (currentControlsRef) {
        interact(currentControlsRef).unset()
      }
      if (currentSliderRef) {
        interact(currentSliderRef).unset()
      }
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

  useEffect(() => {
    if (frameAttrs && frameAttrs.isTopFrame) {
      setActive(false)
    }
  }, [frameAttrs])

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
