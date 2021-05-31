import * as React from "react"
import styled from "styled-components"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface LauncherMenuItemProps {
  label: string
  faSvgIcon?: IconDefinition

  onSelected?()
}

type Props = LauncherMenuItemProps

const StyledLauncherMenuItem = styled.a`
  height: 100%;
  display: flex;
  background: #1976d2;
  flex-grow: 1;
  flex-direction: column;
  font-size: .8rem;
  font-weight: 600;
  padding: .5rem 0;
  box-sizing: border-box;
  align-self: stretch;
  color: #fff;
  text-shadow: 0 0 3px rgba(0, 0, 0, .7);
  text-align: center;
`

const StyledIconWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 3rem;
  padding: .3rem;
  --shadow: drop-shadow(0 .2rem 20px rgba(0, 0, 0, .4));

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

const LauncherMenuItem = (props: Props) => {
  return <StyledLauncherMenuItem onClick={!!props.onSelected ? props.onSelected : null}>
    <StyledIconWrapper>
      {!!props.faSvgIcon ? <FontAwesomeIcon icon={props.faSvgIcon} /> : null}
    </StyledIconWrapper>
    {props.label}
  </StyledLauncherMenuItem>
}

export default LauncherMenuItem
