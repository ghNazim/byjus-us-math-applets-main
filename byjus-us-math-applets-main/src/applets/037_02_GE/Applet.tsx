import { Player } from '@lottiefiles/react-lottie-player'
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import handAnime from '../../common/handAnimations/click.json'
import clickGesture from '../../common/handAnimations/clickGesture.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import riveFile from './Assets/AreaOfCompositeShapes.riv'
const PlayerContainer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  z-index: 1;
  pointer-events: none;
`

const AnimOnBoarding = styled(Player)`
  position: absolute;
  top: 690px;
  left: 320px;
  pointer-events: none;
`

const topPosition = [290, 315, 190]
const leftPosition = [185, 345, 430]
const timer = [null, 3000, 5000, 1500, null, null]
const STATE_NAME = 'animationState'
export const Applet03702Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageIndex, setPageIndex] = useState(0)
  const [nextDisable, setNextDisable] = useState(false)
  const [handPosition, setHandPosition] = useState(0)
  const [showHandPoint, setShowHandPoint] = useState(true)
  const [objectPressed, setObjectPressed] = useState(false)
  const [objectClick, setObjectClick] = useState(false)
  const playClick = useSFX('mouseClick')
  const [showClickOnboarding, setShowClickOnboarding] = useState(true)

  const onInteraction = useContext(AnalyticsContext)
  const onStateChange = useCallback((event: any) => {
    if (event.data[0] == 'trapezium' || event.data[0] == 'rectangle') {
      setShowHandPoint(false)
      setHandPosition((d) => d + 1)
      setObjectPressed(true)
      setObjectClick(true)
    } else if (event.data[0] == 'square') {
      setNextDisable(false)
      setObjectPressed(false)
      setShowHandPoint(false)
      setHandPosition(0)
      setObjectClick(true)
    }
  }, [])

  const { rive, RiveComponent: RiveComponentPlayback } = useRive({
    src: riveFile,
    autoplay: true,
    stateMachines: STATE_NAME,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onStateChange,
  })

  const forwardTrigger = useStateMachineInput(rive, STATE_NAME, 'forward')
  const backwardTrigger = useStateMachineInput(rive, STATE_NAME, 'backward')
  const retryTrigger = useStateMachineInput(rive, STATE_NAME, 'retryPressed')
  useInterval(
    () => {
      setNextDisable(false)
    },
    nextDisable ? timer[pageIndex] : null,
  )
  useInterval(
    () => {
      if (objectPressed) {
        setShowHandPoint(true)
        setObjectPressed(false)
      }
    },
    pageIndex == 4 && objectPressed ? 3000 : null,
  )
  useEffect(() => {
    if (objectClick) {
      onInteraction('tap')
      playClick()
      setObjectClick(false)
    }
  }, [objectClick])
  const onPageChange = useCallback((current: number) => setPageIndex(current), [])
  useEffect(() => {
    switch (pageIndex) {
      case 0:
        setNextDisable(false)
        break
      case 1:
        setNextDisable(true)
        break
      case 2:
        setNextDisable(true)
        break
      case 3:
        setNextDisable(true)
        setHandPosition(0)
        setShowHandPoint(true)
        break
      case 4:
        setNextDisable(true)
        break
    }
  }, [pageIndex])

  useEffect(() => {
    if (pageIndex > 0) setShowClickOnboarding(false)
  }, [pageIndex])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E7FBFF',
        id: '037_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Break down the shape of the pool into quadrilaterals to determine its area."
        backgroundColor="#E7FBFF"
        buttonColor="#A6F0FF"
      />
      <RiveComponentPlayback
        style={{
          width: '85%',
          height: '85%',
          position: 'absolute',
          top: '50px',
          left: '50%',
          translate: '-50%',
        }}
      />
      {pageIndex == 4 && showHandPoint && (
        <PlayerContainer
          src={handAnime}
          top={topPosition[handPosition]}
          left={leftPosition[handPosition]}
          autoplay
          loop
        />
      )}
      <PageControl
        total={6}
        onNext={() => forwardTrigger?.fire()}
        onBack={() => backwardTrigger?.fire()}
        onReset={() => retryTrigger?.fire()}
        onChange={onPageChange}
        nextDisabled={nextDisable}
      />
      {showClickOnboarding && <AnimOnBoarding src={clickGesture} loop autoplay />}
    </AppletContainer>
  )
}
