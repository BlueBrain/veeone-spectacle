import { Box } from "@mui/material"
import { SvgIconComponent } from "@mui/icons-material"
import React, { useMemo } from "react"

interface PieLabelItemProps {
  index: number
  rotateDegrees: number
  label: string
  icon: SvgIconComponent
}

const PieLabelItem: React.FC<PieLabelItemProps> = ({
  index,
  rotateDegrees,
  label,
  icon,
}) => {
  const IconComponent = useMemo<SvgIconComponent>(() => icon, [icon])

  return (
    <Box
      sx={{
        position: "absolute",
        // background: `rgba(0,255,0,.2)`,
        left: "50%",
        top: "50%",
        textAlign: "center",
        width: "50%",
        animation: `openPieItemsEffect${index} 1000ms ease forwards`,
        opacity: 0,
        ["@keyframes openPieItemsEffect" + index]: {
          "0%": {
            opacity: 0.0,
            transform: `
                    translateX(-50%)
                    translateY(-50%)
                  `,
          },
          "40%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
            transform: `
                    translate(-50%)
                    rotate(${rotateDegrees}deg)
                    translate(0, -7.2rem)
                    rotate(-${rotateDegrees}deg)
                    translateY(-50%)
                  `,
          },
        },
      }}
    >
      <Box sx={{}} className={"MenuItemIcon"}>
        <IconComponent sx={{ fontSize: "3rem" }} />
      </Box>
      <Box
        sx={{
          fontSize: ".8rem",
        }}
        className={"MenuItemLabel"}
      >
        {label}
      </Box>
    </Box>
  )
}

export default PieLabelItem
