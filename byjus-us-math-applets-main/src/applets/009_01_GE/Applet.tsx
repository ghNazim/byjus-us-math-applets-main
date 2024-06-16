import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import ddEnd from '../../common/handAnimations/dragAndDropEnd.json'
import ddHold from '../../common/handAnimations/dragAndDropHold.json'
import ddStart from '../../common/handAnimations/dragAndDropStart.json'
import { TextHeader } from '../../common/Header'
import { Math } from '../../common/Math'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import trapeziumAnim from './Animation/009_01_GE Transision v3.json'

const handAnimLoopSteps = [ddStart, ddHold, ddEnd, undefined]
const handAnimLoopPoints = ['joke', `joke'`, `joke'`, 'joke']

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

const PlaceText = styled.div`
  z-index: 2;
  position: absolute;
  top: 400px;
  left: 50%;
  translate: -50%;
  width: 600px;
  color: #444;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 32px;
  text-align: center;

  /* animation-duration: 300ms;
  animation-timing-function: ease;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${fadeInRight}; */

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

const GeogebraPlayer = styled(Player)`
  position: absolute;
  top: 135px;
  left: 210px;
  width: 500px;
  height: 316px;
  pointer-events: none;
`

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  right: 13px;
  top: 144px;
  width: 495px;
  /* width: 500px;
  height: 500px; */
  transition: 0.3s;
`

const BottomSlider = styled(AnimatedInputSlider)`
  position: absolute;
  bottom: 130px;
  left: 160px;
`

const pageTexts = [
  '',
  <p key={1}>2 x (Area of the trapezoid) = Area of the parallelogram</p>,
  [
    <p key={2}>2 x (Area of the trapezoid) = Area of the parallelogram </p>,
    <p key={3}>
      2 x (Area of the trapezoid) =
      <span style={{ color: '#C882FA' }}>
        {' '}
        <b> Area of the rectangle</b>
      </span>
    </p>,
  ],
  <Math key={3} displayMode>
    {String.raw`
  \begin{align*}
  \text{Area of the trapezoid} &= \frac{1}{2} \times{\text{(Area of the rectangle)}} \\ \\
&=  \frac{1}{2} \times \text(a+b) \times \text(h)
  \end{align*}
  `}
  </Math>,
  <Math key={4} displayMode>
    {String.raw`
\begin{align*}
\text{Area of the trapezoid} &= \frac{1}{2} \times{\text{(Area of the rectangle)}} \\ \\
&=  \frac{1}{2} \times \text(a+b) \times \text(h)
\end{align*}
`}
  </Math>,
  <Math key={4} displayMode>
    {String.raw`
\begin{align*}
\text{Area of the trapezoid}
&=  \frac{1}{2} \times \text(a+b) \times \text(h)
\end{align*}
`}
  </Math>,
] as const

const AppInternal: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [enableNext, setEnableNext] = useState(false)
  const onPageChange = useCallback((current: number) => setPageIndex(current), [])
  const [onPointUpdate, setOnPointUpdate] = useState(true)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [showText, setShowText] = useState(false)
  const [sliderChanged, setSliderChanged] = useState(false)
  const [isReset, setIsReset] = useState(0)
  const [handAnimLoopIndex, setHandAnimLoopIndex] = useState(0)
  const [lastAnimDirection, setLastAnimDirection] = useState<1 | -1>(1)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [blinkEnable, setBlinkEnable] = useState(false)
  const [lineThickness, setLineThickness] = useState(3)
  const onInteraction = useContext(AnalyticsContext)

  useInterval(
    () => {
      setHandAnimLoopIndex((i) => (i >= 3 ? 0 : i + 1))
    },
    onPointUpdate && pageIndex == 2 ? 800 : null,
  )

  useInterval(
    () => {
      if (ggbApi.current == null) return
      setLineThickness((v) => {
        if (v < 6) return v + 1
        else return 2
      })
      // @ts-expect-error
      ggbApi.current.setLineThickness('t3', lineThickness)
    },
    blinkEnable ? 130 : null,
  )

  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 't3') {
          onInteraction('drag')
          playMouseIn()
          setBlinkEnable(false)
          api.setLineThickness('t3', 6)
        } else if (e.type === 'dragEnd' && e.target === 't3') {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  const onSliderChange = useCallback((value: number) => {
    if (ggbApi.current) {
      ggbApi.current?.setValue('master', value / 30)
    }
    setEnableNext(value === 100)
  }, [])

  const checkDrag = () => {
    if (ggbApi.current?.getXcoord('R') === 2) {
      setShowText(true)
      setEnableNext(true)
      setBlinkEnable(false)
    } else {
      setShowText(false)
      setEnableNext(false)
      setBlinkEnable(true)
    }
  }

  const onDragUpdate = () => {
    setOnPointUpdate(false)
    checkDrag()
  }

  useEffect(() => {
    if (ggbApi.current == null) return
    switch (pageIndex) {
      case 0:
        ggbApi.current.setValue('slide', 0)

        break
      case 1:
        setSliderChanged(true)
        setEnableNext(true)
        ggbApi.current.setValue('slide', 1)
        break
      case 2:
        setEnableNext(false)
        checkDrag()

        ggbApi.current.setValue('slide', 2)
        ggbApi.current.setFixed('t3', false, true)

        ggbApi.current.registerObjectUpdateListener('R', onDragUpdate)
        return () => ggbApi.current?.unregisterObjectUpdateListener('R')

      case 3:
        setBlinkEnable(false)
        setLastAnimDirection(1)
        ggbApi.current.setValue('slide', 2)
        ggbApi.current.setValue('master', 3)
        ggbApi.current.setFixed('t3', true, false)
        ggbApi.current.setValue('Rectangle', 0)
        ggbApi.current.evalCommand('SetConditionToShowObject(h,false)')
        break

      case 4:
        ggbApi.current.setValue('slide', 0)
        ggbApi.current.setValue('master', 0)
        ggbApi.current.evalCommand('SetConditionToShowObject(h,true)')
        ggbApi.current.setValue('Rectangle', 1)

        break
      case 5:
        setLastAnimDirection(-1)
        ggbApi.current.setValue('Rectangle', 1)
        break
      default:
        break
    }
  }, [pageIndex])

  const onResetHandle = () => {
    ggbApi.current = null
    setSliderChanged(false)
    setIsReset((r) => r + 1)
  }

  return (
    <>
      <StyledGeogebra
        key={isReset}
        materialId={'shbbhjsx'}
        width={490}
        height={290}
        onApiReady={onGGBLoaded}
        pointToTrack={handAnimLoopPoints[handAnimLoopIndex]}
        showOnBoarding={onPointUpdate && pageIndex == 2}
        onboardingAnimationSrc={handAnimLoopSteps[handAnimLoopIndex]}
        transition={800}
      />
      {pageIndex === 0 && (
        <BottomSlider
          onChangePercent={onSliderChange}
          value={sliderChanged ? 1 : 0}
          forceHideHandAnimation={sliderChanged}
        />
      )}
      <PlaceText>
        {pageIndex === 2 ? pageTexts[2][showText ? 1 : 0] : pageTexts[pageIndex]}
      </PlaceText>
      {/* {pageIndex === 4 && lastAnimDirection === 1 && (
        <GeogebraPlayer src={trapeziumAnim} autoplay speed={0.5} keepLastFrame />
      )} */}
      <PageControl
        total={6}
        onChange={onPageChange}
        nextDisabled={!enableNext}
        onReset={onResetHandle}
      />
    </>
  )
}

export const Applet00901Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#FAF2FF',
        id: '009_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Use two identical trapezoids and transform the resultant shape into a rectangle to derive the formula for area. "
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <AppInternal />
    </AppletContainer>
  )
}
