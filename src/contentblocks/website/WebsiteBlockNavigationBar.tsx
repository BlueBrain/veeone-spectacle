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
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material"
import { useWebsiteBlock } from "./WebsiteBlockContext"
import WebsiteBlockLockSwitch from "./WebsiteBlockLockSwitch"
import WebsiteBlockZoomButtons from "./WebsiteBlockZoomButtons"

const WebsiteBlockNavigationBar: React.FC = () => {
  const ref = useRef()
  const { openKeyboard } = useVisualKeyboard()

  const {
    navigateUrl,
    navigateHome,
    navigateBack,
    navigateForward,
    websiteUrl,
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
        doneButtonLabel: "Go",
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
          sx={{
            display: `flex`,
            alignItems: `center`,
            flexDirection: `row`,
            paddingRight: `4rem`,
          }}
        >
          <Box sx={{ flexGrow: 1, padding: `0 2rem 0 1rem` }}>
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

          <Box
            sx={{
              display: `flex`,
              alignItems: `center`,
              padding: `0 2rem 0 0`,
            }}
          >
            <WebsiteBlockZoomButtons />
          </Box>

          <Box sx={{ display: `flex`, alignItems: `center` }}>
            <WebsiteBlockLockSwitch />
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default WebsiteBlockNavigationBar
