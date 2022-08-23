import { Box, Grid, IconButton, TextField, Tooltip } from "@mui/material"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useVisualKeyboard } from "../../visualkeyboard/VisualKeyboardContext"
import { useFrame } from "../../frames/FrameContext"
import { ArrowBack, ArrowForward, Home, Search } from "@mui/icons-material"
import FiltersSelector from "../filebrowser/FiltersSelector"
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
            <Tooltip title="Search files and directories" enterDelay={1000}>
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
        <Box sx={{ paddingRight: `3rem` }}>
          <TextField
            inputRef={ref}
            type={"text"}
            variant={"outlined"}
            label={"Enter website address"}
            fullWidth={true}
            value={locationBarUrl}
            onChange={handleTextInputChange}
            onFocus={event => showVisualKeyboard(event.target, locationBarUrl)}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default WebsiteBlockNavigationBar
