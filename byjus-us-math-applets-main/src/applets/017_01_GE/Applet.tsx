import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import clickGesture from '../../common/handAnimations/clickGesture.json'
import ddEnd from '../../common/handAnimations/dragAndDropEnd.json'
import ddHold from '../../common/handAnimations/dragAndDropHold.json'
import ddStart from '../../common/handAnimations/dragAndDropStart.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import helperText from './Assets/helperText.svg'

const GGB = styled(Geogebra)<{ moveUp: boolean }>`
  position: absolute;
  top: ${(props) => (props.moveUp ? 80 : 170)}px;
  left: 50%;
  translate: -50%;
  transition: ${(props) => (props.moveUp ? 0.8 : 0)}s;
  scale: 1.4;

  #lottie {
    scale: 0.25;
    translate: -50% -40%;
  }
`
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

const AnimOnBoarding = styled(Player)`
  position: absolute;
  top: 690px;
  left: 320px;
  pointer-events: none;
`

const PlaceText = styled.div<{ delay: number }>`
  position: absolute;
  top: 480px;
  left: 50%;
  translate: -50%;
  width: 500px;
  color: #444;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  text-align: center;

  animation-duration: ${(props) => props.delay * 1000}ms;
  animation-timing-function: ease;
  animation-delay: ${(props) => props.delay}s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${fadeInRight};
`
const Texts = [undefined, undefined, <img src={helperText} key={2} />]
const handAnimLoopSteps = [ddStart, ddHold, ddEnd, undefined]
const handAnimLoopPoints = ['dragP', 'dropP', 'dropP', 'dragP']

export const Applet01701Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [showPageControl, setShowPageControl] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [nextDisable, setNextDisable] = useState(false)
  const [blinkEnable, setBlinkEnable] = useState(false)
  const [moveEnable, setMoveEnable] = useState(true)
  const [lineThickness, setLineThickness] = useState(3)
  const [moveUp, setMoveUp] = useState(false)
  const [showClickOnboarding, setShowClickOnboarding] = useState(true)
  const onInteraction = useContext(AnalyticsContext)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [handAnimLoopIndex, setHandAnimLoopIndex] = useState(0)

  const onPageChange = useCallback((current: number) => {
    setPageIndex(current)
  }, [])

  useInterval(
    () => {
      setHandAnimLoopIndex((i) => (i >= 3 ? 0 : i + 1))
    },
    showHandPointer && pageIndex == 1 ? 800 : null,
  )

  useEffect(() => {
    if (pageIndex > 0) setShowClickOnboarding(false)
  }, [pageIndex])

  const onHandleGGB = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (ggbApi.current == null) return
    setShowPageControl(true)
  }, [])
  useInterval(
    () => {
      if (ggbApi.current == null) return

      setLineThickness((v) => {
        if (v < 6) return v + 1
        else return 2
      })
      // @ts-expect-error
      ggbApi.current.setLineThickness('t4_{1}', lineThickness)
    },
    blinkEnable ? 130 : null,
  )
  useEffect(() => {
    const api = ggbApi.current
    if (api == null) return
    switch (pageIndex) {
      case 0:
        api.setValue('T', 0)
        setNextDisable(false)
        setShowHandPointer(false)
        break
      case 1:
        api.registerClientListener((e: any) => {
          if (e.type === 'mouseDown' && e.hits[0] === 't4_{1}') {
            onInteraction('drag')
            playMouseIn()
            setShowHandPointer(false)
            setBlinkEnable(false)
            api.setLineThickness('t4_{1}', 3)
          } else if (e.type === 'dragEnd' && e.target === 't4_{1}') {
            onInteraction('drop')
            playMouseOut()
            if (api.getValue('x(H_{1})') > 8) {
              api.setCoords('H_{1}', 12, 0)
              setNextDisable(false)
              setMoveEnable(false)
            } else {
              api.setCoords('H_{1}', 4, 0)
              setNextDisable(true)
            }
          }
        })
        api.setValue('T', 1)
        api.setValue('U', 0)
        setMoveUp(false)
        if (moveEnable) {
          setBlinkEnable(true)
          api.setCoords('H_{1}', 4, 0)
          setShowHandPointer(true)
          setNextDisable(true)
        } else setNextDisable(false)
        break
      case 2:
        api.setValue('U', 1)
        setMoveUp(true)
        break
    }
  }, [pageIndex])

  const onResetHandle = () => {
    if (ggbApi.current == null) return
    ggbApi.current.setValue('T', 0)
    ggbApi.current.setValue('U', 0)
    setMoveUp(false)
    setMoveEnable(true)
    setHandAnimLoopIndex(0)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E7FBFF',
        id: '017_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Derive the area formula for the parallelogram by transforming it into a rectangle."
        backgroundColor="#E7FBFF"
        buttonColor="#A6F0FF"
      />
      <GGB
        width={480}
        height={400}
        materialId="wgsctjh5"
        onApiReady={onHandleGGB}
        pointToTrack={handAnimLoopPoints[handAnimLoopIndex]}
        showOnBoarding={showHandPointer}
        onboardingAnimationSrc={handAnimLoopSteps[handAnimLoopIndex]}
        transition={800}
        isApplet2D={true}
        moveUp={moveUp}
      />
      <PlaceText delay={pageIndex == 2 ? 0.5 : 0} key={pageIndex}>
        {Texts[pageIndex]}
      </PlaceText>
      {showPageControl && (
        <PageControl
          total={3}
          onChange={onPageChange}
          nextDisabled={nextDisable}
          onReset={onResetHandle}
        />
      )}
      {pageIndex === 0 && showClickOnboarding && showPageControl && (
        <AnimOnBoarding src={clickGesture} loop autoplay />
      )}
    </AppletContainer>
  )
}
