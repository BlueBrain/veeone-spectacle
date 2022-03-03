import React, { useMemo } from "react"
import { Box } from "@mui/material"
import { MenuItem } from "../types"
import { SvgIconComponent } from "@mui/icons-material"
import { generateRandomId } from "../../common/random"

interface SubWedgeLabelItemProps {
  menuItem: MenuItem
  index: number
  mainRotationAngle: number
  totalSubitemCount: number
  degreesPerMainItem: number
}
const SubWedgeLabelItem: React.FC<SubWedgeLabelItemProps> = ({
  index,
  menuItem,
  mainRotationAngle,
  totalSubitemCount,
  degreesPerMainItem,
}) => {
  const { label, icon } = menuItem
  const animationId = useMemo(() => generateRandomId(), [])
  const degreesPerSubWedge = useMemo(
    () => degreesPerMainItem / totalSubitemCount,
    [degreesPerMainItem, totalSubitemCount]
  )
  const IconComponent = useMemo<SvgIconComponent>(() => icon, [icon])
  const rotationAngle = useMemo(
    () => degreesPerSubWedge / 2 + degreesPerSubWedge * index,
    [degreesPerSubWedge, index]
  )

  return (
    <Box
      sx={{
        // background: `hsla(${(100 + (255 / 3) * index) % 255}, 100%, 50%, .4)`,
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "30%",
        textAlign: "center",
        animation: `openPieSubItems${animationId} 500ms ease forwards`,
        [`@keyframes openPieSubItems${animationId}`]: {
          "0%": {
            opacity: 0,
            transform: `
              translate(-50%, -50%)
              rotate(${rotationAngle}deg)
              translateX(8rem)
              rotate(${-rotationAngle}deg)`,
          },
          "30%": {
            opacity: 0,
          },
          "100%": {
            opacity: 0.8,
            transform: `
              translate(-50%, -50%)
              rotate(${rotationAngle}deg)
              translateX(13rem)
              rotate(${-rotationAngle}deg)`,
          },
        },
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
        {/*{label}*/}
        {mainRotationAngle}
      </Box>
    </Box>
  )
}
export default SubWedgeLabelItem
