import * as React from "react"
import styled from "styled-components"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { EffectCoverflow, Navigation, Pagination } from 'swiper/core'
import 'swiper/swiper-bundle.min.css'
import LauncherMenuItem from "./LauncherMenuItem"
import { faFolderOpen, faGlobe, faImage, faVideo } from "@fortawesome/free-solid-svg-icons"
import { LauncherMenuAction } from "../launchermenu/launcher-menu-actions"
import { faVimeo } from "@fortawesome/free-brands-svg-icons"

SwiperCore.use([EffectCoverflow, Pagination, Navigation])


const StyledLauncherMenu = styled.div`
  display: flex;
  flex-grow: 1;
  z-index: 9999;
  //overflow: hidden;
  //backdrop-filter: blur(10px);
  -webkit-mask-image: -webkit-gradient(linear, left top, right top,
  color-stop(0, rgba(0, 0, 0, 0)),
  color-stop(0.2, rgba(0, 0, 0, 1)),
  color-stop(0.8, rgba(0, 0, 0, 1)),
  color-stop(1, rgba(0, 0, 0, 0)));

  .swiper-button-prev, .swiper-button-next {
    color: rgba(0, 0, 0, .8);
  }
`

interface LauncherPrimaryMenuProps {
  onActionSelected(action: LauncherMenuAction)
}

const LauncherPrimaryMenu = (props: LauncherPrimaryMenuProps) => {
  // const close = () => {
  //   props.closeLauncherMenu({ menuId: props.menuId })
  // }
  //
  // const generateFrameId = () => generateRandomId(6)
  //
  // const newFrame = (payload) => {
  //   close()
  //   props.addFrame({
  //     frameId: generateFrameId(),
  //     position: props.position,
  //     ...payload
  //   })
  // }

  // const openFrame = () => newFrame({ type: ContentBlockTypes.Dummy })
  //
  // const openImage = () => newFrame({ type: ContentBlockTypes.SampleImage })
  //
  // const openVideo = () => newFrame({ type: ContentBlockTypes.SampleVideo })
  //
  // const openVimeo = () => newFrame({ type: ContentBlockTypes.Vimeo })
  //
  // const closeAllFrames = () => {
  //   close()
  //   props.closeAllFrames()
  // }

  // const openFile = () => newFrame({
  //   type: ContentBlockTypes.FileBrowser,
  //   size: { width: 700, height: 500 },
  // })

  return (
    <StyledLauncherMenu>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={4}
        coverflowEffect={{
          "rotate": 35,
          "stretch": 0,
          "depth": 30,
          "modifier": -.7,
          "slideShadows": false,
        }}
        // pagination={true}
        className="mySwiper"
        spaceBetween={10}
        loop={true}
        zoom={true}
        navigation={true}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <LauncherMenuItem
            label={"Open media"}
            faSvgIcon={faFolderOpen}
            onSelected={() => props.onActionSelected(LauncherMenuAction.OpenMedia)} />
        </SwiperSlide>
        <SwiperSlide>
          <LauncherMenuItem
            label={"Open image"}
            faSvgIcon={faImage}
            onSelected={() => props.onActionSelected(LauncherMenuAction.OpenSampleImage)} />
        </SwiperSlide>
        <SwiperSlide>
          <LauncherMenuItem
            label={"Open video"}
            faSvgIcon={faVideo}
            onSelected={() => props.onActionSelected(LauncherMenuAction.OpenSampleVideo)} />
        </SwiperSlide>
        <SwiperSlide>
          <LauncherMenuItem
            label={"Vimeo sample"}
            faSvgIcon={faVimeo}
            onSelected={() => props.onActionSelected(LauncherMenuAction.OpenSampleVimeo)} />
        </SwiperSlide>
        <SwiperSlide>
          <LauncherMenuItem
            label={"Web"}
            faSvgIcon={faGlobe} />
        </SwiperSlide>
        {/*<SwiperSlide>*/}
        {/*  <LauncherMenuItem*/}
        {/*    label={"Close all"}*/}
        {/*    faSvgIcon={faEraser}*/}
        {/*    onSelected={closeAllFrames} />*/}
        {/*</SwiperSlide>*/}
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

export default LauncherPrimaryMenu
