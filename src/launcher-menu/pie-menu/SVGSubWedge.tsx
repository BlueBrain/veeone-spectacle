import { Box } from "@mui/material"
import React, { useMemo, useRef } from "react"
import { describeArc } from "./utils"
import useInteractable from "../../interactable/useInteractable"
import { generateRandomId } from "../../common/random"
import { useConfig } from "../../config/AppConfigContext"

interface SVGSubWedgeProps {
  index: number
  totalSubwedges: number

  onTap(): void
}

const SVGSubWedge: React.FC<SVGSubWedgeProps> = ({
  index,
  totalSubwedges,
  onTap,
}) => {
  const { LAUNCHER_SUBWEDGE_ANGLE } = useConfig()
  const ref = useRef()
  const offsetAngle = -(LAUNCHER_SUBWEDGE_ANGLE * totalSubwedges) / 2
  const fromAngle = -LAUNCHER_SUBWEDGE_ANGLE / 2
  const toAngle = fromAngle + LAUNCHER_SUBWEDGE_ANGLE
  const svgPath = describeArc(50, 50, 68, fromAngle, toAngle)
  const animationId = useMemo(() => generateRandomId(), [])

  const wedgeInitialRotation = 0
  const wedgeEndRotation =
    LAUNCHER_SUBWEDGE_ANGLE * index + offsetAngle + LAUNCHER_SUBWEDGE_ANGLE / 2
  const subPieEffectAnimationDuration = LAUNCHER_SUBWEDGE_ANGLE * 20
  const wedgeInitialScale = 0.7
  const wedgeEndScale = 1

  // at 30 degrees translateY -2 px
  // at 45 translateY -1.5px
  // at 90 -0.67
  const wedgeTranslateY = -60 / LAUNCHER_SUBWEDGE_ANGLE

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
        willChange: `transform, opacity`,
        animation: `openSubPieEffect${animationId} ${subPieEffectAnimationDuration}ms ease forwards`,
        ["@keyframes openSubPieEffect" + animationId]: {
          "0%": {
            opacity: 0,
            transform: `
              rotate(${wedgeInitialRotation}deg)
              scale(${wedgeInitialScale})
              translateY(${wedgeTranslateY}px)
            `,
          },
          "30%": {
            opacity: 0.2,
            transform: `
              rotate(${wedgeInitialRotation}deg)
              scale(${wedgeEndScale})
              translateY(${wedgeTranslateY}px)
            `,
          },
          "100%": {
            opacity: 0.7,
            transform: `
            rotate(${wedgeEndRotation}deg)
            scale(${wedgeEndScale})
            translateY(${wedgeTranslateY}px)
            `,
          },
        },
        transition: `fill ease 300ms`,
        ":hover": {
          fill: theme => theme.palette.primary.dark,
        },
      }}
    />
  )
}

export default SVGSubWedge
