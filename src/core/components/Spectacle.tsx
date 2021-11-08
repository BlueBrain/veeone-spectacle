import * as React from "react"
import Desk from "../desk/Desk"
import styled from "styled-components"

const StyledSpectacle = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`

export const Spectacle = () => {
  return (
    <StyledSpectacle>
      <Desk />
    </StyledSpectacle>
  )
}
