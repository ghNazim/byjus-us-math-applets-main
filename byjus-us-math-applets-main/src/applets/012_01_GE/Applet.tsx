import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import handAnimation from '../../common/handAnimations/moveHorizontally.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

const Placetext2 = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  width: 230px;
  color: #c882fa;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  top: 500px;
  transition: 0.2ms;
`

const PlaceText = styled.div<{ delay: number; isOffset: boolean }>`
  position: absolute;
  top: ${(props) => (props.isOffset ? '500px' : '515px')};
  left: 50%;
  translate: -50%;
  width: 600px;
  color: #646464;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  text-align: center;

  animation-duration: 500ms;
  animation-timing-function: ease;
  animation-delay: ${(props) => props.delay}s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${fadeInRight};

  .math-bold {
    color: #aa5ee0;
    font-family: 'Nunito', sans-serif;
    font-size: 20px;
    font-weight: 700;
    text-align: center !important;

    .katex {
      .mathdefault,
      .mathnormal,
      .mord,
      .mathbf {
        font-family: 'Nunito', sans-serif !important;
      }
    }
  }

  .katex {
    .mathdefault,
    .mathnormal,
    .mord,
    .mathbf {
      font-family: 'Nunito', sans-serif !important;
    }
  }
`

const VerticalSlider = styled(AnimatedInputSlider)`
  position: absolute;
  rotate: -90deg;
  left: 430px;
  bottom: 360px;
  width: 340px;
  height: 50px;
  button {
    rotate: 90deg;
  }
`
const GeogebraPlayer = styled(Player)`
  position: absolute;
  top: 450px;
  left: 280px;
  pointer-events: none;
`
const CenteredGGB = styled(Geogebra)<{ isOffset: boolean }>`
  position: absolute;
  left: 100%;
  top: ${(props) => (props.isOffset ? '190px' : '200px')};
  width: 500px;
  height: 380px;
  translate: -100%;
  scale: 1.3 1.3;
  transition: 0.3s;
`
const pageTexts = [
  '',
  '',
  <p key={2}>
    <br />
    <br />
    Volume of triangular prism ={' '}
    <span style={{ color: '#C882FA' }}>
      <b>Base area (A) </b>
    </span>
    x{' '}
    <span style={{ color: '#7F5CF4' }}>
      {' '}
      <b>Height (h)</b>
    </span>
  </p>,
]

const pageTexts2 = [
  '',
  <p key={1} className="math-bold">
    <b>Base Area (A)</b>
  </p>,
  <p key={1} className="math-bold">
    <b>Base Area (A)</b>
  </p>,
]

const AppInternal: React.FC = () => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const [onPointUpdate, setOnPointUpdate] = useState(false)
  const [enableNext, setEnableNext] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const onInteraction = useContext(AnalyticsContext)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [showSliderOnboarding, setShowSliderOnboarding] = useState(false)
  const [resetSlider, setResetSlider] = useState(true)
  const [sliderValue, setSliderValue] = useState(0)
  const [isGGBLoaded, setGGBloaded] = useState(false)
  const transitionTarget = pageIndex === 0 ? 0 : 1

  const [isReset, setIsReset] = useState(0)

  const onPageChange = useCallback((current: number) => setPageIndex(current), [])
  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGGBloaded(true)

      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'B') {
          onInteraction('drag')
          setOnPointUpdate(true)

          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'B') {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  const onSliderChange = useCallback((value: number) => {
    setSliderValue(Math.round((value / 100) * 6))
    if (value == 100) {
      setEnableNext(true)
    } else {
      setEnableNext(false)
    }
  }, [])

  useInterval(
    () => {
      if (pageIndex === 0 && sliderValue > transitionTarget)
        setSliderValue((v) => Math.max(v - 0.1, 0))
    },
    sliderValue != transitionTarget ? 50 : null,
  )

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.setValue('h', sliderValue)
    }
  }, [sliderValue, transitionTarget])

  useEffect(() => {
    switch (pageIndex) {
      case 0:
        setResetSlider(true)
        ggbApi.current?.setValue('next', 0)
        setEnableNext(true)
        ggbApi.current?.setValue('h', 0)
        break
      case 1:
        ggbApi.current?.setValue('next', 2)

        break
      case 2:
        setShowSliderOnboarding(true)
        setResetSlider(false)
        break

      default:
        break
    }
  }, [pageIndex])

  const onClickReset = () => {
    ggbApi.current = null
    setShowSliderOnboarding(false)
    setResetSlider(true)
    setIsReset((r) => r + 1)
  }
  return (
    <>
      <CenteredGGB
        key={isReset}
        isOffset={pageIndex >= 1}
        width={560}
        height={600}
        materialId={'m2afpgnb'}
        onApiReady={onGGBLoaded}
        pointToTrack="B"
        isApplet2D={false}
        // showOnBoarding={onPointUpdate && pageIndex == 0}
        onboardingAnimationSrc={handAnimation}
      />
      {pageIndex === 1 && (
        <VerticalSlider
          onChangePercent={onSliderChange}
          value={resetSlider ? 0 : 1}
          forceHideHandAnimation={showSliderOnboarding}
        />
      )}
      <Placetext2>{pageTexts2[pageIndex]}</Placetext2>
      <PlaceText isOffset={pageIndex > 1} delay={pageIndex > 1 ? 0 : 0.5} key={pageIndex}>
        {pageTexts[pageIndex]}
      </PlaceText>
      {isGGBLoaded && pageIndex == 0 && !onPointUpdate && (
        <GeogebraPlayer src={handAnimation} autoplay loop />
      )}
      <PageControl
        total={3}
        onChange={onPageChange}
        nextDisabled={!isGGBLoaded || !enableNext}
        onReset={onClickReset}
      />
    </>
  )
}

export const Applet01201Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '012_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Form a triangular prism by stacking triangles of base area “A” to derive the volume formula."
        backgroundColor="#FAF2FF"
        buttonColor="#D9CDFF"
      />
      <AppInternal />
    </AppletContainer>
  )
}
