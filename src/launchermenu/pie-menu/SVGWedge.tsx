import React, { useEffect, useRef } from "react"
import { MenuItem } from "../types"
import { Box } from "@mui/material"
import useInteractable from "../../core/interactable/useInteractable"
interface SVGWedgeProps {
  menuItem: MenuItem
  index: number
  degreesPerItem: number
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "L50 50",
    "L",
    start.x,
    start.y,
  ].join(" ")
}

const SVGWedge: React.FC<SVGWedgeProps> = ({
  menuItem,
  degreesPerItem,
  index,
}) => {
  const arcRef = useRef()

  useEffect(() => {
    const arc: SVGElement = arcRef.current
    const startAngle = -degreesPerItem / 2
    const endAngle = startAngle + degreesPerItem
    if (arc) {
      arc.setAttribute("d", describeArc(50, 50, 50, startAngle, endAngle))
    }
  }, [degreesPerItem, index])

  useInteractable(arcRef, {
    onTap: event => {
      menuItem.action()
    },
  })

  return (
    <>
      <Box
        component={"g"}
        mask={"url(#mymask)"}
        sx={{
          "> path": {
            transition: `fill ease 300ms`,
          },
          // ":hover": {
          //   fill: `rgba(255,255,255,.8)`,
          //   "> path": {
          //     fill: `rgba(255,255,255,.8)`,
          //   },
          // },
          transformOrigin: `center`,
          transform: `rotate(${degreesPerItem * index}deg)`,
          transition: `all ease 300ms`,
          animation: "openPieEffect 1000ms ease",
          "@keyframes openPieEffect": {
            "0%": {
              opacity: 0.05,
              transform: `scale(0.1)`,
            },
            "20%": {
              opacity: 0.2,
              transform: `scale(1)`,
            },
            "100%": {
              opacity: 1,
            },
          },
        }}
      >
        <Box
          component={"path"}
          d={""}
          ref={arcRef}
          sx={{
            fill: `rgba(255,255,255,${0.2 + 0.05 * index})`,
          }}
        />
      </Box>
    </>
  )
}

export default SVGWedge
