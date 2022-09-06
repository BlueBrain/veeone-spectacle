import React from "react"
import { MenuItem } from "../types"
import SVGSubWedge from "./SVGSubWedge"
import { Box } from "@mui/material"

interface SVGSubWedgesProps {
  items: MenuItem[]
  index: number
  anglePerMainItem: number
}

const SVGSubWedges: React.FC<SVGSubWedgesProps> = ({
  items,
  anglePerMainItem,
  index,
}) => {
  return (
    <Box
      component={"g"}
      sx={{
        transformOrigin: "center",
        transform: `rotate(${anglePerMainItem * index}deg)`,
        willChange: "transform",
      }}
    >
      {items.map((item, i, list) => (
        <SVGSubWedge
          key={i}
          index={i}
          totalSubwedges={list.length}
          onTap={() => item.action()}
        />
      ))}
    </Box>
  )
}

export default SVGSubWedges
