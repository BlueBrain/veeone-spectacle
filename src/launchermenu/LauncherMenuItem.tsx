import * as React from "react"
import { useRef } from "react"
import styled from "styled-components"
import useInteractable from "../core/interactable/useInteractable"
import { OpenInBrowser } from "@mui/icons-material"

interface LauncherMenuItemProps {
  label: string

  onSelected?()
}

const StyledLauncherMenuItem = styled.div`
  height: 100%;
  display: flex;
  flex-grow: 1;
  font-size: 0.8rem;
  font-weight: 400;
  padding: 0.5rem 0;
  box-sizing: border-box;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.9);
  text-align: center;
`

const LauncherMenuItem: React.FC<LauncherMenuItemProps> = ({
  label,
  onSelected,
}) => {
  const ref = useRef()
  const handleTap = event => {
    onSelected()
    event.stopPropagation()
  }
  useInteractable(ref, {
    onTap: handleTap,
  })

  return <StyledLauncherMenuItem ref={ref}>{label}</StyledLauncherMenuItem>
}

export default LauncherMenuItem
