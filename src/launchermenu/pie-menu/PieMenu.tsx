import React, { useMemo } from "react"
import { MenuData } from "../types"
import SVGWedge from "./SVGWedge"
import { Box } from "@mui/material"
import PieLabelItem from "./PieLabelItem"

interface PieMenuProps {
  menuData: MenuData
}

const PieMenu: React.FC<PieMenuProps> = ({ menuData }) => {
  const itemCount = useMemo(() => menuData.items.length, [menuData.items])
  const degreesPerItem = useMemo(() => 360 / itemCount, [itemCount])

  return (
    <>
      <svg width={"100%"} height={"100%"} viewBox={"0 0 100 100"}>
        <defs>
          <mask id={"mymask"}>
            <rect width={"100%"} height={"100%"} fill={"white"} />
            <circle r={15} cx={50} cy={50} fill={"black"} />
          </mask>
        </defs>
        {menuData.items.map((menuItem, index) => (
          <SVGWedge
            menuItem={menuItem}
            key={index}
            index={index}
            degreesPerItem={degreesPerItem}
          />
        ))}
      </svg>
      <Box
        sx={{
          pointerEvents: "none",
          position: "absolute",
          width: "100%",
          height: "100%",
          left: "0",
          top: "0",
          // background: `rgba(255,0,0,.3)`,
          color: "white",
          fontSize: "1rem",
        }}
      >
        {menuData.items.map((menuItem, index) => (
          <PieLabelItem
            key={index}
            label={menuItem.label}
            icon={menuItem.icon}
            rotateDegrees={degreesPerItem * index}
            index={index}
          />
        ))}
      </Box>
    </>
  )
}

export default PieMenu
