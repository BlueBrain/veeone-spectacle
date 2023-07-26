import React, { useMemo } from "react"
import { Box } from "@mui/material"
import { MenuItem } from "../types"
import { SvgIconComponent } from "@mui/icons-material"
import { generateRandomId } from "../../common/random"
import { useConfig } from "../../config/AppConfigContext"

interface SubWedgeLabelItemProps {
  menuItem: MenuItem
  index: number
  mainRotationAngle: number
  totalSubitemCount: number
}
const SubWedgeLabelItem: React.FC<SubWedgeLabelItemProps> = ({
  index,
  menuItem,
  mainRotationAngle,
  totalSubitemCount,
}) => {
  const { LAUNCHER_SUBWEDGE_ANGLE, LAUNCHER_MENU_SIZE_REM } = useConfig()
  const { label, icon } = menuItem
  const anglePerMainItem = LAUNCHER_SUBWEDGE_ANGLE * totalSubitemCount
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
        width: "28%",
        textAlign: "center",
        opacity: 0,
        animation: `openPieSubItems${animationId} 500ms ease forwards`,
        animationDelay: `300ms`,
        [`@keyframes openPieSubItems${animationId}`]: {
          "0%": {
            opacity: 0,
            transform: `
              translate(-50%, -50%)
              rotate(${rotateAngle}deg)
              translateX(8rem)
              rotate(${-rotateAngle}deg)`,
          },
          "40%": {
            opacity: 0,
          },
          "100%": {
            opacity: 0.8,
            transform: `
              translate(-50%, -50%)
              rotate(${rotateAngle}deg)
              translateX(${LAUNCHER_MENU_SIZE_REM / 1.654411765}rem)
              rotate(${-rotateAngle}deg)
              `,
          },
        },
      }}
    >
      <Box sx={{}} className={"MenuItemIcon"}>
        <IconComponent sx={{ fontSize: `${LAUNCHER_MENU_SIZE_REM / 15}rem` }} />
      </Box>
      <Box
        sx={{
          fontSize: `${Math.max(0.65, LAUNCHER_MENU_SIZE_REM / 28.0)}rem`,
        }}
        className={"MenuItemLabel"}
      >
        {label}
      </Box>
    </Box>
  )
}
export default SubWedgeLabelItem
