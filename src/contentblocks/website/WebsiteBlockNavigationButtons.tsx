import { Grid, IconButton, Tooltip } from "@mui/material"
import { ArrowBack, ArrowForward, Home } from "@mui/icons-material"
import React from "react"
import { useWebsiteBlock } from "./WebsiteBlockContext"

const WebsiteBlockNavigationButtons: React.FC = () => {
  const { navigateHome, navigateBack, navigateForward } = useWebsiteBlock()
  return (
    <Grid container alignItems="center" data-drag-handle={true}>
      {/* todo implement nav buttons */}
      <Grid item sx={{ display: `none` }}>
        <Tooltip title="Back" enterDelay={1000}>
          <span>
            <IconButton onClick={navigateBack} color={"primary"} size={"large"}>
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
            <IconButton onClick={navigateHome} color={"primary"} size={"large"}>
              <Home fontSize={"large"} />
            </IconButton>
          </span>
        </Tooltip>
      </Grid>
    </Grid>
  )
}

export default WebsiteBlockNavigationButtons
