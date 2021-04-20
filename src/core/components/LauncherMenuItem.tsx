import * as React from "react"
import OpenIcon from "../../assets/icons/open.inline.svg"
import styled from "styled-components"

interface LauncherMenuItemProps {
  label: string

  onSelected()
}

type Props = LauncherMenuItemProps

const StyledLauncherMenuItem = styled.a`
  color: #fff;
  font-size: 10pt;
  font-weight: 700;
  width: 50px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  text-shadow: 0 0 3px rgba(black, .7);
`

const StyledIconWrapper = styled.div`
  --shadow: drop-shadow(6px 6px 50px rgba(0, 0, 0, .7));
  path {
    fill: white;
    -webkit-filter: var(--shadow);
    filter: var(--shadow);
  }
`

const LauncherMenuItem = (props: Props) => {
  return <StyledLauncherMenuItem onClick={props.onSelected}>
    <StyledIconWrapper>
      <OpenIcon width={"100%"} height={"100%"}/>
    </StyledIconWrapper>
    {props.label}
  </StyledLauncherMenuItem>
}

export default LauncherMenuItem
