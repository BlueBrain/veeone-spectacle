import { Grid } from "@mui/material"
import React from "react"
import WebsiteBlockLockSwitch from "./WebsiteBlockLockSwitch"
import WebsiteBlockZoomButtons from "./WebsiteBlockZoomButtons"
import WebsiteBlockLocationBar from "./WebsiteBlockLocationBar"
import WebsiteBlockNavigationButtons from "./WebsiteBlockNavigationButtons"

const WebsiteBlockNavigationBar: React.FC = () => {
  return (
    <Grid container alignItems={"center"}>
      <Grid item>
        <WebsiteBlockNavigationButtons />
      </Grid>

      <Grid item xs={12} md>
        <WebsiteBlockLocationBar />
      </Grid>

      <Grid item xs md={"auto"}>
        <WebsiteBlockZoomButtons />
      </Grid>

      <Grid item xs md={"auto"}>
        <WebsiteBlockLockSwitch />
      </Grid>

      <Grid item md={"auto"} sx={{ minWidth: `5rem` }} />
    </Grid>
  )
}

export default WebsiteBlockNavigationBar
