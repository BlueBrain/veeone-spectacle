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
  background: #1976d2;
  flex-grow: 1;
  flex-direction: column;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem 0;
  box-sizing: border-box;
  align-self: stretch;
  color: #fff;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
  text-align: center;
`

const StyledIconWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 3rem;
  padding: 0.3rem;
  --shadow: drop-shadow(0 0.2rem 20px rgba(0, 0, 0, 0.4));

  svg {
    //display: flex;
    //align-self: center;
    box-sizing: border-box;
    width: 50% !important;
    height: auto !important;
  }

  path {
    fill: white;
    -webkit-filter: var(--shadow);
    filter: var(--shadow);
  }
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

  return (
    <StyledLauncherMenuItem ref={ref}>
      <StyledIconWrapper>
        <OpenInBrowser />
      </StyledIconWrapper>
      {label}
    </StyledLauncherMenuItem>
  )
}

export default LauncherMenuItem
