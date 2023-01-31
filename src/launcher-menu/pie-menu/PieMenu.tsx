import React, { useMemo } from "react"
import SVGWedge from "./SVGWedge"
import { Box } from "@mui/material"
import PieLabelItem from "./PieLabelItem"
import { useLauncherMenu } from "../LauncherMenuContext"
import { MenuItem } from "../types"

interface PieMenuProps {}

const PieMenu: React.FC<PieMenuProps> = () => {
  const { menuData, setMenuData } = useLauncherMenu()
  const itemCount = useMemo(() => menuData.items.length, [menuData.items])
  const anglePerMainItem = useMemo(() => 360 / itemCount, [itemCount])

  const handleWedgeTap = (menuItem: MenuItem, index: number) => {
    const newMenuData = { ...menuData }

    if (!menuItem.isEnabled) {
      return
    }

    if (newMenuData.items[index]?.children?.length > 0) {
      newMenuData.items[index].isOpen = !newMenuData.items[index].isOpen
      setMenuData(newMenuData)
    } else if (menuData.items[index].action) {
      menuData.items[index].action()
    } else {
    }
  }

  return (
    <>
      <Box
        component={"svg"}
        width={"100%"}
        height={"100%"}
        viewBox={"0 0 100 100"}
        overflow={"visible"}
      >
        <defs>
          <mask id={"circleMask"} style={{ maskType: "luminance" }}>
            <rect x={-50} y={-50} width={200} height={200} fill={"white"} />
            <circle r={15} cx={50} cy={50} fill={"black"} />
          </mask>
          <mask id={"largeCircleMask"} style={{ maskType: "luminance" }}>
            <rect x={-50} y={-50} width={200} height={200} fill={"white"} />
            <circle r={49.5} cx={50} cy={50} fill={"black"} />
          </mask>
        </defs>
        <Box component={"g"} mask="url('#circleMask')">
          <rect width={100} height={100} fillOpacity={0} />
          {menuData.items.map((menuItem, index) => (
            <SVGWedge
              menuItem={menuItem}
              key={index}
              index={index}
              anglePerMainItem={anglePerMainItem}
              onTap={() => handleWedgeTap(menuItem, index)}
            />
          ))}
        </Box>
      </Box>
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
            index={index}
            menuItem={menuItem}
            anglePerMainItem={anglePerMainItem}
          />
        ))}
      </Box>
    </>
  )
}

export default PieMenu
