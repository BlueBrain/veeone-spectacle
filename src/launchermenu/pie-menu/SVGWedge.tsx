import React, { useMemo, useRef } from "react"
import { MenuItem } from "../types"
import { Box } from "@mui/material"
import useInteractable from "../../core/interactable/useInteractable"
import { describeArc } from "./utils"
import SVGSubWedges from "./SVGSubWedges"

interface SVGWedgeProps {
  menuItem: MenuItem
  index: number
  degreesPerItem: number
  onTap(): void
}

const SVGWedge: React.FC<SVGWedgeProps> = ({
  menuItem,
  degreesPerItem,
  index,
  onTap,
}) => {
  const arcRef = useRef<SVGElement>()
  const rotateDegrees = degreesPerItem * index
  const startAngle = -degreesPerItem / 2
  const endAngle = startAngle + degreesPerItem

  const pathCommands = useMemo(
    () => describeArc(50, 50, 50, startAngle, endAngle),
    [endAngle, startAngle]
  )

  useInteractable(arcRef, {
    onTap,
  })

  return (
    <>
      <Box
        component={"g"}
        mask={"url(#circleMask)"}
        sx={{
          "> path": {
            transition: `fill ease 500ms`,
          },
          transformOrigin: `center`,
          transition: `all ease 300ms`,
          animation: `openPieEffect${index} 1s ease forwards`,
          ["@keyframes openPieEffect" + index]: {
            "0%": {
              opacity: 0.0,
              transform: `scale(0.1)`,
            },
            "20%": {
              opacity: 0.2,
              transform: `scale(.95) `,
            },
            "100%": {
              opacity: 1,
              transform: `
                rotate(${rotateDegrees}deg)
                translateY(-1px)
                scale(.95)
              `,
            },
          },
        }}
      >
        {menuItem.isOpen ? (
          <SVGSubWedges
            items={menuItem.children}
            degreesPerItem={degreesPerItem}
          />
        ) : null}
        <Box
          component={"path"}
          ref={arcRef}
          d={pathCommands}
          sx={{
            fill: theme => theme.palette.primary.main,
            opacity: 0.9,
          }}
        />
      </Box>
    </>
  )
}

export default SVGWedge
