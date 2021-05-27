import React, { CSSProperties, useState } from "react"
import styled from "styled-components"

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

  // useEffect(() => {
  //   setSrc(() => _.sample([]))
  // }, [])

  return <StyledVideoBlock>
    {/*<video controls width={"500"} height={"400"} autoPlay={true} style={elementStyle}>*/}
    {/*  <source src={src} type="video/webm"/>*/}
    {/*</video>*/}
    To be implemented with real files
    <StyledOverlay/>
  </StyledVideoBlock>
}

export default VideoBlock
