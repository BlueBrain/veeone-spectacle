import React from "react"
import { MenuItem } from "../types"
import SVGSubWedge from "./SVGSubWedge"

interface SVGSubWedgesProps {
  items: MenuItem[]
  degreesPerItem: number
}

const SVGSubWedges: React.FC<SVGSubWedgesProps> = ({
  items,
  degreesPerItem,
}) => {
  return (
    <>
      {items.map((item, i) => (
        <SVGSubWedge
          key={i}
          degreePerSubwedge={degreesPerItem / items.length}
          fromAngle={-degreesPerItem / 2}
          index={i}
          onTap={() => item.action()}
        />
      ))}
    </>
  )
}

export default SVGSubWedges
