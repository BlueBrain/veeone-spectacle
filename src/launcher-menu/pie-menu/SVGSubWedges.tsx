import React from "react"
import { MenuItem } from "../types"
import SVGSubWedge from "./SVGSubWedge"

interface SVGSubWedgesProps {
  items: MenuItem[]
  anglePerItem: number
}

const SVGSubWedges: React.FC<SVGSubWedgesProps> = ({ items, anglePerItem }) => {
  return (
    <>
      {items.map((item, i) => (
        <SVGSubWedge
          key={i}
          index={i}
          anglePerSubwedge={anglePerItem / items.length}
          onTap={() => item.action()}
        />
      ))}
    </>
  )
}

export default SVGSubWedges
