import * as React from "react"
import { Helmet } from "react-helmet"
import Desk from "./Desk"
import styled from "styled-components"

interface SpectacleProps {
}


type Props = SpectacleProps

const StyledSpectacle = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`
export const Spectacle = (props: Props) => {
  return (
    <StyledSpectacle>
      <Helmet>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <Desk />
    </StyledSpectacle>
  )
}
