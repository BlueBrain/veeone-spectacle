import * as React from "react"
// @ts-ignore
import EPFLLogo from "../assets/branding/epfl-logo.svg"
// @ts-ignore
import BBPLogo from "../assets/branding/blue-brain-project-logo.svg"
import { Box, Typography } from "@mui/material"
import { white } from "../branding/colors"
import { useSpectacle } from "../spectacle/SpectacleStateContext"

interface DeskBrandingProps {}

export const DeskBranding: React.FC<DeskBrandingProps> = () => {
  const { presentationName } = useSpectacle()
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
      {presentationName ? (
        <Box
          sx={{
            marginLeft: `0.9rem`,
            borderLeft: `0.1rem solid rgba(255, 255, 255, 0.8)`,
          }}
        >
          <Typography
            sx={{
              color: white,
              fontSize: `1.2rem`,
              marginLeft: `0.9rem`,
              marginBottom: `0.15rem`,
              opacity: `0.90`,
            }}
          >
            {presentationName}
          </Typography>
        </Box>
      ) : null}
    </Box>
  )
}
