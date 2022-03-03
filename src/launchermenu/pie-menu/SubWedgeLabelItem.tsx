import React, { useMemo } from "react"
import { Box } from "@mui/material"
import { MenuItem } from "../types"
import { SvgIconComponent } from "@mui/icons-material"

interface SubWedgeLabelItemProps {
  menuItem: MenuItem
  index: number
  mainRotationDegrees: number
  totalSubitemCount: number
  degreesPerMainItem: number
}
const SubWedgeLabelItem: React.FC<SubWedgeLabelItemProps> = ({
  index,
  menuItem,
  mainRotationDegrees,
  totalSubitemCount,
  degreesPerMainItem,
}) => {
  const { label, icon } = menuItem
  const degreesPerSubWedge = degreesPerMainItem / totalSubitemCount
  console.debug(
    "degreesPerSubWedge",
    degreesPerSubWedge,
    "totalSubitemCount",
    totalSubitemCount
  )

  const IconComponent = useMemo<SvgIconComponent>(() => icon, [icon])

  const rotationAngle = degreesPerSubWedge / 2 + degreesPerSubWedge * index

  return (
    <Box
      sx={{
        // background: `hsla(${(100 + (255 / 3) * index) % 255}, 100%, 50%, .4)`,
        position: "absolute",
        opacity: 0.8,
        left: "50%",
        top: "50%",
        width: "30%",
        textAlign: "center",
        transform: `
          translate(-50%, -50%)
          rotate(${rotationAngle}deg)
          translateX(13rem)
          rotate(${-rotationAngle}deg)
        `,
      }}
    >
      <Box sx={{}} className={"MenuItemIcon"}>
        <IconComponent sx={{ fontSize: "1.5rem" }} />
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
export default SubWedgeLabelItem
