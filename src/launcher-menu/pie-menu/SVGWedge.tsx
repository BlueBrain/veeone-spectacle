import React, { useMemo, useRef } from "react"
import { MenuItem } from "../types"
import { Box } from "@mui/material"
import useInteractable from "../../core/interactable/useInteractable"
import { describeArc } from "./utils"
import SVGSubWedges from "./SVGSubWedges"
import { generateRandomId } from "../../common/random"

interface SVGWedgeProps {
  menuItem: MenuItem
  index: number
  anglePerMainItem: number
  onTap(): void
}

const SVGWedge: React.FC<SVGWedgeProps> = ({
  menuItem,
  anglePerMainItem,
  index,
  onTap,
}) => {
  const animationId = useMemo(() => generateRandomId(), [])
  const arcRef = useRef<SVGElement>()
  const rotateDegrees = useMemo(() => anglePerMainItem * index, [
    anglePerMainItem,
    index,
  ])
  const startAngle = useMemo(() => -anglePerMainItem / 2, [anglePerMainItem])
  const endAngle = useMemo(() => startAngle + anglePerMainItem, [
    anglePerMainItem,
    startAngle,
  ])
  const pathCommands = useMemo(
    () => describeArc(50, 50, 50, startAngle, endAngle),
    [endAngle, startAngle]
  )

  useInteractable(arcRef, {
    onTap,
  })

  return (
    <>
      {menuItem.isOpen ? (
        <Box
          mask={"url(#largeCircleMask)"}
          component={"g"}
          sx={{
            transformOrigin: "center",
            transform: `
              rotate(${anglePerMainItem / menuItem.children.length / 2}deg)
              rotate(${-anglePerMainItem / 2}deg)
              rotate(${anglePerMainItem * index}deg)
            `,
          }}
        >
          <SVGSubWedges
            items={menuItem.children}
            anglePerItem={anglePerMainItem}
          />
        </Box>
      ) : null}

      <Box
        component={"g"}
        sx={{
          "> path": {
            transition: `fill ease 500ms`,
          },
          transformOrigin: `center`,
          transition: `all ease 300ms`,
          willChange: `transform, opacity`,
          animation: `openPieEffect${animationId} 1s ease forwards`,
          ["@keyframes openPieEffect" + animationId]: {
            "0%": {
              opacity: 0.0,
              transform: `scale(0.3)`,
            },
            "20%": {
              opacity: 0.2,
              transform: `scale(1) `,
            },
            "100%": {
              opacity: 1,
              transform: `
                rotate(${rotateDegrees}deg)
              `,
            },
          },
        }}
      >
        <Box
          component={"path"}
          ref={arcRef}
          d={pathCommands}
          sx={{
            fill: theme =>
              menuItem.isOpen
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
            opacity: menuItem.isEnabled ? 0.8 : 0.3,
            transformOrigin: "center",
            transform: `
              translateY(-1px)
              scale(.95)`,
            ":hover": {
              fill: theme => theme.palette.primary.dark,
            },
          }}
        />
      </Box>
    </>
  )
}

export default SVGWedge
