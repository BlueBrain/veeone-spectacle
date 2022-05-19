import { Box } from "@mui/material"
import { SvgIconComponent } from "@mui/icons-material"
import React, { useMemo } from "react"
import { MenuItem } from "../types"
import SubWedgeLabelItem from "./SubWedgeLabelItem"

interface PieLabelItemProps {
  index: number
  anglePerMainItem: number
  menuItem: MenuItem
}

const PieLabelItem: React.FC<PieLabelItemProps> = ({
  index,
  anglePerMainItem,
  menuItem,
}) => {
  const { label, icon, isOpen, children, isEnabled } = menuItem
  const mainRotationAngle = anglePerMainItem * index
  const IconComponent = useMemo<SvgIconComponent>(() => icon, [icon])

  return (
    <>
      <Box
        sx={{
          // background: `rgba(0,255,0,.2)`,
          position: "absolute",
          left: "50%",
          top: "50%",
          textAlign: "center",
          width: "50%",
          animation: `openPieItemsEffect${index} 1000ms ease forwards`,
          opacity: 0,
          willChange: `transform`,
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
              opacity: isEnabled ? 1 : 0.3,
              transform: `
              translate(-50%)
              rotate(${mainRotationAngle}deg)
              translate(0, -7.4rem)
              rotate(${-mainRotationAngle}deg)
              translateY(-50%)
            `,
            },
          },
        }}
      >
        <Box sx={{}} className={"MenuItemIcon"}>
          <IconComponent sx={{ fontSize: "2.7rem" }} />
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
      {isOpen ? (
        <>
          {children.map((menuItem, i, total) => (
            <SubWedgeLabelItem
              key={i}
              index={i}
              menuItem={menuItem}
              totalSubitemCount={total.length}
              mainRotationAngle={mainRotationAngle}
              anglePerMainItem={anglePerMainItem}
            />
          ))}
        </>
      ) : null}
    </>
  )
}

export default PieLabelItem
