import React, { useEffect, useRef, useState } from "react"
import { MenuItem } from "../types"
import { Box } from "@mui/material"
import useInteractable from "../../core/interactable/useInteractable"
import { describeArc } from "./utils"

interface SVGWedgeProps {
  menuItem: MenuItem
  index: number
  degreesPerItem: number
}

const getSubWedgeComponents = (menuItem: MenuItem, degreesPerItem: number) => {
  const degreePerSubwedge = degreesPerItem / menuItem.children.length
  const initialAngle = -degreesPerItem / 2
  const wedges = []
  menuItem.children.forEach((menuItem, i) => {
    // const fromAngle = initialAngle + degreePerSubwedge * i
    const fromAngle = -degreesPerItem / 2
    const toAngle = fromAngle + degreePerSubwedge
    wedges.push(
      <Box
        key={i}
        mask={"url(#largeCircleMask)"}
        component={"path"}
        d={describeArc(50, 50, 75, fromAngle, toAngle)}
        sx={{
          fill: theme => theme.palette.primary.main,
          opacity: 0.5,
          transformOrigin: `center`,
          transform: `
            rotate(${degreePerSubwedge * i}deg)
            translateY(-2px)
            scale(.95)
          `,
        }}
      />
    )
  })
  return wedges
}

const SVGWedge: React.FC<SVGWedgeProps> = ({
  menuItem,
  degreesPerItem,
  index,
}) => {
  const arcRef = useRef<SVGElement>()
  const rotateDegrees = degreesPerItem * index
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const [childWedges, setChildWedges] = useState(null)

  useEffect(() => {
    const arc = arcRef.current
    const startAngle = -degreesPerItem / 2
    const endAngle = startAngle + degreesPerItem
    if (arc) {
      arc.setAttribute("d", describeArc(50, 50, 50, startAngle, endAngle))
    }
  }, [degreesPerItem, index])

  useInteractable(arcRef, {
    onTap: event => {
      if (Array.isArray(menuItem.children) && menuItem.children.length > 0) {
        setIsSubmenuOpen(!isSubmenuOpen)
      } else {
        menuItem.action()
      }
    },
  })

  useEffect(() => {
    if (Array.isArray(menuItem.children) && menuItem.children.length > 0) {
      setTimeout(() => {
        setIsSubmenuOpen(true)
      }, 1000)
    }
  }, [menuItem.children])

  useEffect(() => {
    if (Array.isArray(menuItem.children) && menuItem.children.length > 0) {
      if (isSubmenuOpen) {
        setChildWedges(getSubWedgeComponents(menuItem, degreesPerItem))
      }
    }
  }, [degreesPerItem, isSubmenuOpen, menuItem, menuItem.children])

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
        <Box
          component={"path"}
          ref={arcRef}
          sx={{
            fill: theme => theme.palette.primary.main,
            opacity: 0.9,
          }}
        />
        {childWedges}
      </Box>
    </>
  )
}

export default SVGWedge
