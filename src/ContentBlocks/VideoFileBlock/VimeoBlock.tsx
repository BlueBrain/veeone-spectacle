import React, { CSSProperties } from "react"
import styled from "styled-components"

const StyledVimeoBlock = styled.div`
background: #fff;
`

const StyledOverlay = styled.div`
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
background: red;
opacity: .3;`

const VimeoBlock: React.FC = () => {
  const iframeStyle: CSSProperties = {
    boxSizing: "border-box",
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%"
  }

  console.debug("$$$ render VideoFileBlock")

  return <StyledVimeoBlock>
    <iframe
      src="https://player.vimeo.com/video/352685468?color=45C2B1&title=0&byline=0&portrait=0&loop=1&autoplay=1&background=1"
      width="100%" height="100%" frameBorder="0" allow="autoplay; picture-in-picture"
      style={iframeStyle}
      allowFullScreen></iframe>
    <StyledOverlay/>
  </StyledVimeoBlock>
}

export default VimeoBlock
