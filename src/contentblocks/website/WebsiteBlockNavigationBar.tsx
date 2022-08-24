import { Box, Grid, IconButton, TextField, Tooltip } from "@mui/material"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useVisualKeyboard } from "../../visualkeyboard/VisualKeyboardContext"
import { useFrame } from "../../frames/FrameContext"
import {
  ArrowBack,
  ArrowForward,
  Home,
  LockOpenRounded,
  LockRounded,
  PlayCircle,
} from "@mui/icons-material"
import { useWebsiteBlock } from "./WebsiteBlockContext"

const WebsiteBlockNavigationBar: React.FC = () => {
  const ref = useRef()
  const { openKeyboard, closeKeyboardByTarget } = useVisualKeyboard()

  const {
    navigateUrl,
    navigateHome,
    navigateBack,
    navigateForward,
    websiteUrl,
    activateInteractiveMode,
    deactivateInteractiveMode,
    isInteractiveModeOn,
  } = useWebsiteBlock()

  const [locationBarUrl, setLocationBarUrl] = useState<string>(websiteUrl)
  const { frameId } = useFrame()

  const handleTextInputChange = useCallback(
    event => {
      if (event.target.value !== locationBarUrl) {
        setLocationBarUrl(event.target.value)
      }
    },
    [locationBarUrl]
  )

  const showVisualKeyboard = useCallback(
    (target, initialValue: string) => {
      openKeyboard({
        target,
        initial: initialValue,
        onInputChange: (newValue: string) => setLocationBarUrl(newValue),
        customKeyboardId: `navigation-bar-${frameId}`,
        onDone: (value: string) => navigateUrl(value),
      })
    },
    [frameId, navigateUrl, openKeyboard]
  )

  useEffect(() => {
    setLocationBarUrl(websiteUrl)
  }, [websiteUrl])

  return (
    <Grid container sx={{ padding: 1 }}>
      <Grid item>
        <Grid container alignItems="center" data-drag-handle={true}>
          <Grid item>
            <Tooltip title="Back" enterDelay={1000}>
              <span>
                <IconButton
                  onClick={navigateBack}
                  color={"primary"}
                  size={"large"}
                >
                  <ArrowBack fontSize={"large"} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Forward" enterDelay={1000}>
              <span>
                <IconButton
                  onClick={navigateForward}
                  color={"primary"}
                  size={"large"}
                >
                  <ArrowForward fontSize={"large"} />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip title="Home page" enterDelay={1000}>
              <span>
                <IconButton
                  onClick={navigateHome}
                  color={"primary"}
                  size={"large"}
                >
                  <Home fontSize={"large"} />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md>
        <Box
          sx={{ display: `flex`, flexDirection: `row`, paddingRight: `3rem` }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              inputRef={ref}
              type={"text"}
              variant={"outlined"}
              label={"Enter website address"}
              fullWidth={true}
              value={locationBarUrl}
              onChange={handleTextInputChange}
              onFocus={event =>
                showVisualKeyboard(event.target, locationBarUrl)
              }
            />
          </Box>

          <Tooltip title="Navigate to the URL" enterDelay={1000}>
            <IconButton
              onClick={() => navigateUrl(locationBarUrl)}
              size={"large"}
            >
              <PlayCircle fontSize={"large"} />
            </IconButton>
          </Tooltip>

          {isInteractiveModeOn ? (
            <Tooltip title="Lock page browsing" enterDelay={1000}>
              <IconButton onClick={deactivateInteractiveMode} size={"large"}>
                <LockRounded fontSize={"large"} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Unlock page browsing" enterDelay={1000}>
              <IconButton onClick={activateInteractiveMode} size={"large"}>
                <LockOpenRounded fontSize={"large"} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

export default WebsiteBlockNavigationBar
