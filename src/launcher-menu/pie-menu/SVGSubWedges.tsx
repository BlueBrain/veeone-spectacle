import React from "react"
import { MenuItem } from "../types"
import SVGSubWedge from "./SVGSubWedge"

interface SVGSubWedgesProps {
  items: MenuItem[]
}

const SVGSubWedges: React.FC<SVGSubWedgesProps> = ({ items }) => {
  return (
    <>
      {items.map((item, i, list) => (
        <SVGSubWedge
          key={i}
          index={i}
          totalSubwedges={list.length}
          onTap={() => item.action()}
        />
      ))}
    </>
  )
}

export default SVGSubWedges
