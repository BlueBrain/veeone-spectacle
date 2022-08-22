import { Grid } from "@mui/material"
import React from "react"

interface KeyboardRowProps {}

const KeyboardRow: React.FC<KeyboardRowProps> = ({ children }) => {
  return (
    <Grid
      container
      direction={"row"}
      sx={{
        display: `flex`,
        flexDirection: `row`,
        flexWrap: `nowrap`,
        flexGrow: 1,
        justifyContent: `space-between`,
        padding: `0.1rem 0`,
        textTransform: `none`,
      }}
    >
      {children}
    </Grid>
  )
}

export default KeyboardRow
