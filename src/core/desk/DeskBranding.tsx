import * as React from "react"
// @ts-ignore
import EPFLLogo from "../../assets/branding/EPFL_Logo_184X53.svg"
// @ts-ignore
import BBPLogo from "../../assets/branding/BlueBrainProject.svg"
import { Box } from "@mui/material"

interface DeskBrandingProps {}

export const DeskBranding: React.FC<DeskBrandingProps> = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box>
        <Box
          component={"img"}
          src={EPFLLogo}
          sx={{
            height: "1rem",
            margin: "1.5rem",
          }}
        />
      </Box>
      <Box>
        <Box
          component={"img"}
          src={BBPLogo}
          sx={{
            height: "1.3rem",
            marginTop: "0.3rem",
          }}
        />
      </Box>
    </Box>
  )
}
