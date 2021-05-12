import React, { CSSProperties, useEffect, useState } from "react"
import styled from "styled-components"
import MovieSrc1 from "../../assets/tmp/patagonia-8k.webm"
import MovieSrc2 from "../../assets/tmp/peru.webm"
import _ from "lodash"

const movies = [MovieSrc1, MovieSrc2]

const StyledVideoBlock = styled.div`
background: #000;
width: 100%;
height: 100%;
box-shadow: 0px 5px 10px rgba(0, 0, 0, .3);
`

const StyledOverlay = styled.div`
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
//background: red;
opacity: .3;
`

const VideoBlock: React.FC = () => {
  const [src, setSrc] = useState()
  const elementStyle: CSSProperties = {
    boxSizing: "border-box",
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%"
  }

  console.debug("$$$ render VideoFileBlock")

  useEffect(() => {
    setSrc(() => _.sample(movies))
  }, [])

  return <StyledVideoBlock>
    <video controls width={"500"} height={"400"} autoPlay={true} style={elementStyle}>
      <source src={src} type="video/webm"/>
    </video>
    <StyledOverlay/>
  </StyledVideoBlock>
}

export default VideoBlock
