import * as React from "react"
// @ts-ignore
import EPFLLogo from "../../assets/branding/EPFL_Logo_184X53.svg"
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
            height: "1.2vh",
            margin: "2vh",
          }}
        />
      </Box>
      <Box
        sx={{
          fontSize: "1.2rem",
          paddingBottom: "0.3rem",
          color: theme => theme.branding.main,
        }}
      >
        Blue Brain Project
      </Box>
    </Box>
  )
}
