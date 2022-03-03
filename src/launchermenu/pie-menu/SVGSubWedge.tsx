import { Box } from "@mui/material"
import React, { useMemo, useRef } from "react"
import { describeArc } from "./utils"
import useInteractable from "../../core/interactable/useInteractable"
import { generateRandomId } from "../../common/random"

interface SVGSubWedgeProps {
  anglePerSubwedge: number
  index: number
  onTap(): void
}

const SVGSubWedge: React.FC<SVGSubWedgeProps> = ({
  anglePerSubwedge,
  index,
  onTap,
}) => {
  const ref = useRef()
  const fromAngle = -anglePerSubwedge / 2
  const toAngle = -fromAngle
  const svgPath = describeArc(50, 50, 70, fromAngle, toAngle)
  const animationId = useMemo(() => generateRandomId(), [])

  useInteractable(ref, {
    onTap,
  })

  return (
    <Box
      ref={ref}
      component={"path"}
      d={svgPath}
      sx={{
        fill: theme => theme.palette.primary.main,
        transformOrigin: `center`,
        animation: `openSubPieEffect${animationId} 500ms ease forwards`,
        ["@keyframes openSubPieEffect" + animationId]: {
          "0%": {
            opacity: 0,
            transform: `
              rotate(${anglePerSubwedge * index}deg)
              translateY(-3px)
              scale(.7)
            `,
          },
          "100%": {
            opacity: 0.6,
            transform: `
              rotate(${anglePerSubwedge * index}deg)
              translateY(-3px)
              scale(.97)
            `,
          },
        },
      }}
    />
  )
}

export default SVGSubWedge
