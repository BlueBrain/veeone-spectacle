import React from "react"
import styled from "styled-components"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { EffectCoverflow, Navigation, Pagination } from 'swiper/core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCog, faTimes } from "@fortawesome/free-solid-svg-icons"

SwiperCore.use([EffectCoverflow, Pagination, Navigation])

const StyledLauncherPagesNavigator = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
  align-self: center;
  flex-direction: column;
  margin-bottom: 1rem;
`

const StyledSwiper = styled.div`
  -webkit-mask-image: -webkit-gradient(linear, left top, right top,
  color-stop(0, rgba(0, 0, 0, 0)),
  color-stop(0.2, rgba(0, 0, 0, 1)),
  color-stop(0.8, rgba(0, 0, 0, 1)),
  color-stop(1, rgba(0, 0, 0, 0)));

  .swiper-button-prev, .swiper-button-next {
    color: rgba(0, 0, 0, .8);
  }
`

const StyledPagePrev = styled.div`
  background: #9a0036;
  padding: 1rem;
  height: 3rem;
  overflow: hidden;
  position: relative;
`

const StyledFakeFrame = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, .2);
  width: 25%;
  height: 10%;
`

const StyledOptionsBar = styled.div`
  width: 100%;
  text-align: right;
  font-size: .8rem;
`

const PagePrev = () => {
  return <StyledPagePrev>
    <StyledFakeFrame style={{ left: "27%", top: "33%", width: "40%", height: "50%" }} />
    <StyledFakeFrame style={{ left: "10%", top: "45%", width: "20%", height: "35%" }} />
    <StyledFakeFrame style={{ left: "3%", top: "5%", width: "40%", height: "30%" }} />
    <StyledFakeFrame style={{ left: "27%", top: "20%", width: "50%", height: "44%" }} />
    <StyledFakeFrame style={{ left: "57%", top: "50%", width: "40%", height: "40%" }} />
  </StyledPagePrev>
}

const LauncherPagesNavigator = () => {
  return <StyledLauncherPagesNavigator>

    <StyledOptionsBar>
      1 of 4 pages
      <FontAwesomeIcon icon={faCog} />
    </StyledOptionsBar>

    <StyledSwiper><Swiper
      effect={'coverflow'}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={3}
      coverflowEffect={{
        "rotate": 35,
        "stretch": 0,
        "depth": 30,
        "modifier": 0,
        "slideShadows": false,
      }}
      // pagination={true}
      className="mySwiper"
      spaceBetween={10}
      loop={false}
      navigation={true}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide>
        <PagePrev />
        Welcome screen
      </SwiperSlide>
      <SwiperSlide>
        <PagePrev />
        Page 2
      </SwiperSlide>
      <SwiperSlide>
        <PagePrev />
        Hippocampus
      </SwiperSlide>
      <SwiperSlide>
        <PagePrev />
        Neuron structure
      </SwiperSlide>
    </Swiper></StyledSwiper>
  </StyledLauncherPagesNavigator>
}

export default LauncherPagesNavigator
