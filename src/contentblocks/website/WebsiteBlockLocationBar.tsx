import { Box, TextField } from "@mui/material"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useVisualKeyboard } from "../../visualkeyboard/VisualKeyboardContext"
import { useWebsiteBlock } from "./WebsiteBlockContext"
import { useFrame } from "../../frames/FrameContext"
import { useConfig } from "../../config/AppConfigContext"

const WebsiteBlockLocationBar: React.FC = () => {
  const ref = useRef()
  const config = useConfig()
  const { openKeyboard } = useVisualKeyboard()

  const { navigateUrl, websiteUrl } = useWebsiteBlock()

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
    <Box sx={{ flexGrow: 1, padding: `0 2rem 0 1rem` }}>
      <TextField
        inputRef={ref}
        type={"text"}
        variant={"outlined"}
        label={"Enter website address"}
        fullWidth={true}
        value={locationBarUrl}
        onChange={handleTextInputChange}
        onFocus={event => showVisualKeyboard(event.target, locationBarUrl)}
        disabled={!config.WEBSITE_BLOCK_ALLOW_CHANGING_URL}
      />
    </Box>
  )
}

export default WebsiteBlockLocationBar
