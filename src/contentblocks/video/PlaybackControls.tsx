import React, { RefObject, useEffect, useState } from "react"
import styled from "styled-components"
import {
  Forward10,
  Pause,
  PauseRounded,
  PlayArrowRounded,
  Replay10,
} from "@material-ui/icons"
import { IconButton } from "@material-ui/core"

interface PlaybackControlsProps {
  videoRef: RefObject<HTMLVideoElement>
}

const StyledPlaybackControls = styled.div`
  //background: rgba(255, 0, 0, 0.5);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  svg {
    fill: white;
  }
`

const PlaybackControls: React.FC<PlaybackControlsProps> = ({ videoRef }) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const handlePlayButton = () => {
    console.debug("PLAY / PAUSE button pressed")
    setIsPlaying(!isPlaying)
  }

  const handleForwardButton = () => {
    console.debug("FORWARD button pressed")
    // todo this should be configurable (note the icon with "10"!)
    videoRef.current.currentTime += 10
  }

  const handleReplayButton = () => {
    console.debug("REPLAY button pressed")
    // todo this should be configurable (note the icon with "10"!)
    videoRef.current.currentTime -= 10
  }

  useEffect(() => {
    async function handlePlaybackState() {
      if (isPlaying) {
        await videoRef.current.play()
      } else {
        await videoRef.current.pause()
      }
    }
    void handlePlaybackState()
  }, [videoRef, isPlaying])

  return (
    <StyledPlaybackControls>
      <IconButton onClick={handleReplayButton}>
        <Replay10 />
      </IconButton>
      <IconButton onClick={handlePlayButton}>
        {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
      </IconButton>
      <IconButton onClick={handleForwardButton}>
        <Forward10 />
      </IconButton>
    </StyledPlaybackControls>
  )
}

export default PlaybackControls
