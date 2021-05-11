import React, { CSSProperties, useEffect, useState } from "react"
import _ from "lodash"
import Image1 from "../../assets/tmp/column_layer2_7680x3240.png"
import Image2 from "../../assets/tmp/hippocampus_collage_4k_v3.png"
import Image3 from "../../assets/tmp/hippocampus_collage_4k_v6a.png"
import Image4 from "../../assets/tmp/hippocampus_collage_4k_v8.png"
import Image5 from "../../assets/tmp/20120417cell18_a.CNG-7.png"
import Image6 from "../../assets/tmp/20120417cell18_a.CNG-5 2.png"
import styled from "styled-components"

const sampleImagePaths = [Image1, Image2, Image3, Image4, Image5, Image6]

const StyledImageBlock = styled.div`
width: 100%;
height: 100%;
background: black;
box-shadow: 0px 5px 10px rgba(0, 0, 0, .3);
`

const ImageBlock: React.FC = () => {
  const [img, setImg] = useState<JSX.Element>()
  const imgStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }

  useEffect(() => {
    const imgPath = _.sample(sampleImagePaths)
    setImg(() => <img src={imgPath} style={imgStyle} alt={""}/>)
  }, [])

  return <StyledImageBlock>
    {img}
  </StyledImageBlock>
}

export default ImageBlock
