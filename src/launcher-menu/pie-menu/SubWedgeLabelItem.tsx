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
  anglePerMainItem: number
}
const SubWedgeLabelItem: React.FC<SubWedgeLabelItemProps> = ({
  index,
  menuItem,
  mainRotationAngle,
  totalSubitemCount,
  anglePerMainItem,
}) => {
  const { label, icon } = menuItem
  const animationId = useMemo(() => generateRandomId(), [])
  const anglePerSubWedge = useMemo(() => anglePerMainItem / totalSubitemCount, [
    anglePerMainItem,
    totalSubitemCount,
  ])
  const IconComponent = useMemo<SvgIconComponent>(() => icon, [icon])
  const indexRotationAngle = useMemo(
    () => anglePerSubWedge / 2 + anglePerSubWedge * index,
    [anglePerSubWedge, index]
  )

  const rotateAngle = useMemo(
    () => -90 - anglePerMainItem / 2 + indexRotationAngle + mainRotationAngle,
    [anglePerMainItem, mainRotationAngle, indexRotationAngle]
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
              rotate(${rotateAngle}deg)
              translateX(8rem)
              rotate(${-rotateAngle}deg)`,
          },
          "30%": {
            opacity: 0,
          },
          "100%": {
            opacity: 0.8,
            transform: `
              translate(-50%, -50%)
              rotate(${rotateAngle}deg)
              translateX(13.4rem)
              rotate(${-rotateAngle}deg)
              `,
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
        {label}
      </Box>
    </Box>
  )
}
export default SubWedgeLabelItem
