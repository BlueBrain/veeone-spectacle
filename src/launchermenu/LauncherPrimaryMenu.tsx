import * as React from "react"
import styled from "styled-components"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { Navigation, Pagination } from "swiper/core"
import "swiper/swiper-bundle.min.css"
import LauncherMenuItem from "./LauncherMenuItem"
import { faFolderOpen, faGlobe } from "@fortawesome/free-solid-svg-icons"
import { LauncherMenuAction } from "./launcher-menu-actions"
import { faVimeo } from "@fortawesome/free-brands-svg-icons"

SwiperCore.use([Pagination, Navigation])

const StyledLauncherMenu = styled.div`
  display: flex;
  flex-grow: 1;
  z-index: 9999;
  //overflow: hidden;
  //backdrop-filter: blur(10px);
  -webkit-mask-image: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0, rgba(0, 0, 0, 0)),
    color-stop(0.2, rgba(0, 0, 0, 1)),
    color-stop(0.8, rgba(0, 0, 0, 1)),
    color-stop(1, rgba(0, 0, 0, 0))
  );

  .swiper-button-prev,
  .swiper-button-next {
    color: rgba(0, 0, 0, 0.8);
  }
`

interface LauncherPrimaryMenuProps {
  onActionSelected(action: LauncherMenuAction)
}

const LauncherPrimaryMenu = (props: LauncherPrimaryMenuProps) => {
  return (
    <StyledLauncherMenu>
      <Swiper
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={4}
        className="mySwiper"
        spaceBetween={10}
        loop={true}
        zoom={true}
        navigation={true}
        onSlideChange={() => console.log("slide change")}
        onSwiper={swiper => console.log(swiper)}
      >
        <SwiperSlide>
          <LauncherMenuItem
            label={"Open media"}
            faSvgIcon={faFolderOpen}
            onSelected={() =>
              props.onActionSelected(LauncherMenuAction.OpenMedia)
            }
          />
        </SwiperSlide>
        {/*<SwiperSlide>*/}
        {/*  <LauncherMenuItem*/}
        {/*    label={"Open image"}*/}
        {/*    faSvgIcon={faImage}*/}
        {/*    onSelected={() => props.onActionSelected(LauncherMenuAction.OpenSampleImage)} />*/}
        {/*</SwiperSlide>*/}
        {/*<SwiperSlide>*/}
        {/*  <LauncherMenuItem*/}
        {/*    label={"Open video"}*/}
        {/*    faSvgIcon={faVideo}*/}
        {/*    onSelected={() => props.onActionSelected(LauncherMenuAction.OpenSampleVideo)} />*/}
        {/*</SwiperSlide>*/}
        <SwiperSlide>
          <LauncherMenuItem
            label={"Vimeo sample"}
            faSvgIcon={faVimeo}
            onSelected={() =>
              props.onActionSelected(LauncherMenuAction.OpenSampleVimeo)
            }
          />
        </SwiperSlide>
        <SwiperSlide>
          <LauncherMenuItem label={"Web"} faSvgIcon={faGlobe} />
        </SwiperSlide>
      </Swiper>
    </StyledLauncherMenu>
  )
}

export default LauncherPrimaryMenu
