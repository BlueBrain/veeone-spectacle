import { Box } from "@mui/material"
import React, { useRef } from "react"
import { describeArc } from "./utils"
import useInteractable from "../../core/interactable/useInteractable"
interface SVGSubWedgeProps {
  degreePerSubwedge: number
  fromAngle: number
  index: number
  onTap(): void
}
const SVGSubWedge: React.FC<SVGSubWedgeProps> = ({
  degreePerSubwedge,
  fromAngle,
  index,
  onTap,
}) => {
  const ref = useRef()
  const toAngle = fromAngle + degreePerSubwedge
  const svgPath = describeArc(50, 50, 75, fromAngle, toAngle)

  useInteractable(ref, {
    onTap,
  })

  return (
    <Box
      ref={ref}
      mask={"url(#largeCircleMask)"}
      component={"path"}
      d={svgPath}
      sx={{
        fill: theme => theme.palette.primary.main,
        transformOrigin: `center`,
        animation: `openSubPieEffect${index} 500ms ease forwards`,
        ["@keyframes openSubPieEffect" + index]: {
          "0%": {
            opacity: 0,
            transform: `
                rotate(${degreePerSubwedge * index}deg)
                scale(.8)
              `,
          },
          "100%": {
            opacity: 0.6,
            transform: `
                rotate(${degreePerSubwedge * index}deg)
                translateY(-2px)
                scale(.95)
              `,
          },
        },
      }}
    />
  )
}

export default SVGSubWedge
