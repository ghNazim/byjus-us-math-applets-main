import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import handAnimation from '../../common/handAnimations/moveHorizontally.json'
import { TextHeader } from '../../common/Header'
import { Math as Latex } from '../../common/Math'
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

const Placetext2 = styled.div<{ isOffset: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  width: 600px;
  color: #c882fa;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  text-align: center;
  top: ${(props) => (props.isOffset ? '485px' : '505px')};
  transition: 0.2ms;
`

const PlaceText = styled.div<{ delay: number; isOffset: boolean }>`
  position: absolute;
  top: ${(props) => (props.isOffset ? '495px' : '515px')};
  left: 50%;
  translate: -50%;
  width: 600px;
  color: #646464;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
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
  left: 420px;
  bottom: 450px;
  width: 300px;
  height: 50px;
  button {
    rotate: 90deg;
  }
`

const CenteredGGB = styled(Geogebra)<{ isOffset: boolean }>`
  position: absolute;
  left: 50%;
  top: ${(props) => (props.isOffset ? '85px' : '105px')};
  width: 500px;
  height: 500px;
  translate: -50%;
  transition: 0.3s;
`
const pageTexts = [
  '',
  '',
  <p key={2}>
    <br />
    <br />
    On stacking the circular disks of<span style={{ color: '#C882FA' }}> radius r</span>, you have{' '}
    <br />
    created a cylinder of<span style={{ color: '#ED6B90' }}> height h</span>.
  </p>,
  <>
    <br />
    <br />
    <Latex key={3} displayMode>
      {String.raw`
      \begin{align*}
      \text{Volume of a cylinder} &= \textcolor{#AA5EE0}{\text{Area of circular disk}} \times \textcolor{#ED6B90}{\text{Height of the cylinder}} \\
      &= {\bf \textcolor{#AA5EE0}{\pi r^2} \times \textcolor{#ED6B90}{h}} \\
      &= \pi r^2h\\
      \end{align*}
      `}
    </Latex>
  </>,
]

const pageTexts2 = [
  '',
  <p key={1} className="math-bold">
    Area of the circular disk = <Latex>{'\\pi r^2'}</Latex>
  </p>,
  <p key={1} className="math-bold">
    Area of the circular disk = <Latex>{'\\pi r^2'}</Latex>
  </p>,
  <p key={1} className="math-bold">
    Area of the circular disk = <Latex>{'\\pi r^2'}</Latex>
  </p>,
]

const AppInternal: React.FC = () => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const [onPointUpdate, setOnPointUpdate] = useState(false)
  const [disableNext, setDisableNext] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [animTarget, setAnimTarget] = useState(0)
  const [animCurrent, setAnimCurrent] = useState(0)
  const [sliderValue, setSliderValue] = useState(0)
  const [showSliderOnboarding, setShowSliderOnboarding] = useState(false)
  const [resetSlider, setResetSlider] = useState(true)
  const onInteraction = useContext(AnalyticsContext)
  const onPageChange = useCallback((current: number) => setPageIndex(current), [])
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setOnPointUpdate(true)
      api.registerUpdateListener((e: any) => {
        if (e != 'B') return
        setOnPointUpdate(false)
      })

      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'B') {
          onInteraction('drag')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'B') {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  useInterval(
    () => {
      if (animCurrent < animTarget) {
        setAnimCurrent(animCurrent + 0.1)
      } else if (animCurrent > animTarget) {
        setAnimCurrent(animCurrent - 0.1)
      }
    },
    animCurrent !== animTarget ? 50 : null,
  )

  useEffect(() => {
    ggbApi.current?.setValue('to3D', animCurrent)
  }, [animCurrent])

  useEffect(() => {
    if (pageIndex >= 1) {
      setAnimTarget(1)
    } else {
      setAnimTarget(0)
      ggbApi.current?.setValue('height', 0)
    }
    switch (pageIndex) {
      case 0:
        setDisableNext(false)
        setResetSlider(true)
        break
      case 1:
        setDisableNext(true)

        break
      case 2:
        setShowSliderOnboarding(true)
        setResetSlider(false)
        break
      default:
        break
    }
  }, [pageIndex])

  const onSliderChange = useCallback((value: number) => {
    setSliderValue(Math.round((value / 100) * 40))
    if (value == 100) {
      setDisableNext(false)
    } else {
      setDisableNext(true)
    }
  }, [])

  useEffect(() => {
    if (ggbApi.current) {
      // const current = ggbApi.current.getValue('height')
      // if (Math.abs(current - sliderValue) > 3)
      ggbApi.current.setValue('height', sliderValue)
    }
  }, [sliderValue])

  const onClickReset = () => {
    ggbApi.current?.setValue('to3D', 0)
    ggbApi.current?.setValue('height', 0)
  }

  return (
    <>
      <CenteredGGB
        isOffset={pageIndex > 1}
        width={500}
        height={500}
        materialId={'caamrxjt'}
        onApiReady={onGGBLoaded}
        pointToTrack="B"
        showOnBoarding={onPointUpdate && pageIndex == 0}
        onboardingAnimationSrc={handAnimation}
      />
      {pageIndex === 1 && (
        <VerticalSlider
          onChangePercent={onSliderChange}
          value={resetSlider ? 0 : 1}
          forceHideHandAnimation={showSliderOnboarding}
        />
      )}
      <Placetext2 isOffset={pageIndex > 1}>{pageTexts2[pageIndex]}</Placetext2>
      <PlaceText isOffset={pageIndex > 1} delay={pageIndex > 1 ? 0 : 0.5} key={pageIndex}>
        {pageTexts[pageIndex]}
      </PlaceText>

      <PageControl
        total={4}
        onChange={onPageChange}
        nextDisabled={disableNext}
        onReset={() => {
          onClickReset
          setShowSliderOnboarding(false)
          setResetSlider(true)
        }}
      />
    </>
  )
}

export const Applet00801Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '008_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Build a cylinder of height ‘h’ by stacking thin circular disks of radius ‘r’ to derive the formula for volume. "
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <AppInternal />
    </AppletContainer>
  )
}
