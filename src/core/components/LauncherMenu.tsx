import * as React from "react"

import { connect } from 'react-redux'
import { addFrame, AddFramePayload, closeAllFrames, closeLauncherMenu } from '../redux/actions'
import { Position } from "../types"
import styled from "styled-components"
import { ContentBlockTypes } from "../../contentblocks/register"
import { generateRandomId } from "../../common/random"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { EffectCoverflow, Navigation, Pagination } from 'swiper/core'
import 'swiper/swiper-bundle.min.css'
// import 'swiper/components/zoom/zoom.scss'
// import "swiper/components/effect-coverflow/effect-coverflow.scss"
// import "swiper/components/pagination/pagination.scss"
// import "swiper/components/navigation/navigation.scss"
import LauncherMenuItem from "./LauncherMenuItem"

SwiperCore.use([EffectCoverflow, Pagination, Navigation])


interface DispatchProps {
  addFrame(payload: AddFramePayload): void

  closeLauncherMenu
  closeAllFrames
}

interface LauncherMenuProps {
  menuId: string
  position: Position
}

type Props = LauncherMenuProps & DispatchProps


const StyledLauncherMenu = styled.div`
  display: flex;
  flex-grow: 1;
  max-width: 25rem;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 9999;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-mask-image: -webkit-gradient(linear, left top, right top,
  color-stop(0.00, rgba(0, 0, 0, 0)),
  color-stop(0.30, rgba(0, 0, 0, 1)),
  color-stop(0.70, rgba(0, 0, 0, 1)),
  color-stop(1.00, rgba(0, 0, 0, 0)));

  .swiper-button-prev, .swiper-button-next {
    color: rgba(0, 0, 0, .8);
  }
`
const LauncherMenu = (props: Props) => {
  const close = () => {
    props.closeLauncherMenu({ menuId: props.menuId })
  }

  const generateFrameId = () => generateRandomId(6)

  const newFrame = (payload) => {
    close()
    props.addFrame({
      frameId: generateFrameId(),
      position: props.position,
      ...payload
    })
  }

  const openFrame = () => newFrame({ type: ContentBlockTypes.Dummy })

  const openImage = () => newFrame({ type: ContentBlockTypes.SampleImage })

  const openVideo = () => newFrame({ type: ContentBlockTypes.SampleVideo })

  const openVimeo = () => newFrame({ type: ContentBlockTypes.Vimeo })

  const closeAllFrames = () => {
    close()
    props.closeAllFrames()
  }

  const openFile = () => newFrame({
    type: ContentBlockTypes.FileBrowser,
    size: { width: 700, height: 500 },
  })

  return (
    <StyledLauncherMenu>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={5}
        coverflowEffect={{
          "rotate": 35,
          "stretch": 0,
          "depth": 70,
          "modifier": -.7,
          "slideShadows": false,
        }}
        // pagination={true}
        className="mySwiper"
        spaceBetween={10}
        loop={true}
        navigation={true}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide zoom={true}>
          <LauncherMenuItem
            label={"Open..."}
            onSelected={() => openFile()} />
        </SwiperSlide>
        <SwiperSlide>
          <LauncherMenuItem
            label={"Open image"}
            onSelected={() => openImage()} />
        </SwiperSlide>
        <SwiperSlide>
          <LauncherMenuItem
            label={"Open video"}
            onSelected={() => openVideo()} />
        </SwiperSlide>
        <SwiperSlide>
          <LauncherMenuItem
            label={"Open Vimeo movie"}
            onSelected={() => openVimeo()} />
        </SwiperSlide>
        <SwiperSlide>
          <LauncherMenuItem
            label={"Cancel"}
            onSelected={close} />
        </SwiperSlide>
        <SwiperSlide>
          <LauncherMenuItem
            label={"Close all"}
            onSelected={closeAllFrames} />
        </SwiperSlide>
      </Swiper>

      {/*<LauncherMenuItem*/}
      {/*  label={"Open frame"}*/}
      {/*  onSelected={() => openFrame()} />*/}
      {/*<LauncherMenuItem*/}
      {/*  label={"Open image"}*/}
      {/*  onSelected={() => openImage()} />*/}
      {/*<LauncherMenuItem*/}
      {/*  label={"Open video"}*/}
      {/*  onSelected={() => openVideo()} />*/}
      {/*<LauncherMenuItem*/}
      {/*  label={"Open Vimeo movie"}*/}
      {/*  onSelected={() => openVimeo()} />*/}
      {/*<LauncherMenuItem*/}
      {/*  label={"Cancel"}*/}
      {/*  onSelected={close} />*/}
      {/*<LauncherMenuItem*/}
      {/*  label={"Close all"}*/}
      {/*  onSelected={closeAllFrames} />*/}
    </StyledLauncherMenu>
  )
}

export default connect(null, { addFrame, closeLauncherMenu, closeAllFrames })(LauncherMenu)
