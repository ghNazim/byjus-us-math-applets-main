import { Player, PlayerEvent, PlayerState } from '@lottiefiles/react-lottie-player'
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import styled from 'styled-components'
import { useTransition } from 'transition-hook'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import clickGesture from '../../common/handAnimations/clickGesture.json'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import glassPourCounter from './assets/glassPourCounter.svg'
import jarFilling from './assets/jarFilling.json'
import jarHolder from './assets/jarHolder.svg'
import largeGlass from './assets/largeGlass.json'
import largeGlassG from './assets/largeGlassG.svg'
import mediumGlass from './assets/mediumGlass.json'
import mediumGlassG from './assets/mediumGlassG.svg'
import pourButton from './assets/pourButton.svg'
import smallGlass from './assets/smallGlass.json'
import smallGlassG from './assets/smallGlassG.svg'
import xLGlass from './assets/xLGlass.json'
import xLGlassG from './assets/xLGlassG.svg'

const glassPours = [smallGlass, mediumGlass, largeGlass, xLGlass]
const glassProgressIncrements = [0.2, 0.25, 0.34, 0.5]
const fillTriggerFrame = [24, 26, 30, 35]
const pourEndFrames = [46, 56, 66, 76]
const handLeftPositions = [92, 196, 310, 440, 92]

const JAR_FILL_START_FRAME = 0
const JAR_FILL_END_FRAME = 52

const progressToFrame = (p: number) => {
  return Math.round(p * (JAR_FILL_END_FRAME - JAR_FILL_START_FRAME)) + JAR_FILL_START_FRAME
}

const StyledText = styled.div`
  color: #646464;
  position: absolute;
  font-family: Nunito;
  font-size: 20px;
  left: 534px;
  top: 420px;
`

const Holder = styled.img`
  position: absolute;
  top: 344px;
  left: 158px;
`

const AnimationPlayer = styled(Player)`
  position: absolute;
  top: 40px;
  left: 90px;
  width: 540px;
  height: 540px;
  pointer-events: none;
  animation-delay: 500ms;
`

const AnimOnBoarding = styled(Player)<{ left: number }>`
  position: absolute;
  top: 590px;
  left: ${(props) => props.left}px;
  pointer-events: none;
`

const ButtonsContainer = styled.div<{ opacity: number }>`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-end;
  top: 550px;
  left: 100px;
  width: 500px;
  height: 125px;
  opacity: ${(props) => props.opacity};
  transition: 500ms ease-in-out;
`
const Button = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  &:disabled {
    cursor: default;
    img {
      filter: grayscale(1);
    }
  }
`

const initialActiveGlass = {
  showButtons: true,
  currentGlassIndex: -1,
  progress: 0,
  textDisplay: '',
  glassComplete: [false, false, false, false],
}

type ActiveGlassReducerAction =
  | { type: 'select'; selectedIndex: number }
  | { type: 'pour'; incrementProgress: number }

function activeGlassReducer(state: typeof initialActiveGlass, action: ActiveGlassReducerAction) {
  if (action.type === 'pour') {
    const p = Math.min(state.progress + action.incrementProgress, 1)
    if (p === 1) {
      state.glassComplete[state.currentGlassIndex] = true
      state.textDisplay = 'Full'
    }

    return {
      ...state,
      progress: p,
      showButtons: p === 1,
    }
  }

  if (action.type === 'select') {
    return {
      ...state,
      showButtons: false,
      progress: 0,
      textDisplay: '',
      currentGlassIndex: action.selectedIndex,
    }
  }
  return state
}

function getPourCount(state: typeof initialActiveGlass) {
  const increment = glassProgressIncrements[state.currentGlassIndex]
  return increment ? (state.progress / increment).toFixed(0) : '-'
}

export const Applet02402Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [activeGlass, dispatchActiveGlass] = useReducer(activeGlassReducer, initialActiveGlass)
  const { shouldMount, stage } = useTransition(activeGlass.showButtons, 500)
  const jarPlayer = useRef<Player>(null)
  const pourPlayer = useRef<Player>(null)
  const [pourDisabled, setPourDisabled] = useState(false)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [leftVar, setLeftVar] = useState(92)

  const onGlassClickGen = (index: number) => {
    return () => {
      dispatchActiveGlass({ type: 'select', selectedIndex: index })
      onInteraction('tap')
      playClick()
    }
  }

  const onPourClick = () => {
    if (pourPlayer.current?.state.playerState === PlayerState.Playing) return
    pourPlayer.current?.play()
    playClick()
    onInteraction('tap')
    setPourDisabled(true)
  }

  const onPourEvent = (e: PlayerEvent) => {
    if (e === PlayerEvent.Frame) {
      if (!pourDisabled) return
      const frameNumber = pourPlayer.current?.state.seeker
      const triggerFrameNumber = fillTriggerFrame[activeGlass.currentGlassIndex]
      const endFrameNumber = pourEndFrames[activeGlass.currentGlassIndex]
      if (frameNumber && frameNumber > fillTriggerFrame[activeGlass.currentGlassIndex]) {
        const pourEndProgress =
          (frameNumber - triggerFrameNumber) / (endFrameNumber - triggerFrameNumber)
        const jarProgress =
          activeGlass.progress +
          pourEndProgress * glassProgressIncrements[activeGlass.currentGlassIndex]
        jarPlayer.current?.setSeeker(progressToFrame(jarProgress))
      }
    }

    if (e === PlayerEvent.Complete) {
      setPourDisabled(false)
      dispatchActiveGlass({
        type: 'pour',
        incrementProgress: glassProgressIncrements[activeGlass.currentGlassIndex],
      })
    }
  }

  useEffect(() => {
    if (activeGlass.progress === 0) jarPlayer.current?.setSeeker(0)
  }, [activeGlass.progress])

  useEffect(() => {
    setLeftVar(handLeftPositions[activeGlass.currentGlassIndex + 1])
  }, [activeGlass.currentGlassIndex])

  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#E7FBFF',
        id: '024_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Try filling a jar with various-sized glasses of water to check if it requires the same amount of glasses each time."
        backgroundColor="#E7FBFF"
        buttonColor="#A6F0FF"
      />
      <AnimationPlayer src={jarFilling} ref={jarPlayer} />
      <AnimationPlayer
        src={glassPours[activeGlass.currentGlassIndex]}
        onEvent={onPourEvent}
        ref={pourPlayer}
      />
      <Holder src={jarHolder} style={{ top: '345px', left: '159px' }} />
      <Holder src={glassPourCounter} style={{ top: '410px', left: '358px' }} />
      {shouldMount && (
        <ButtonsContainer opacity={stage === 'enter' ? 1 : 0}>
          <Button disabled={activeGlass.glassComplete[0]} onClick={onGlassClickGen(0)}>
            <img src={smallGlassG} />
          </Button>
          <Button disabled={activeGlass.glassComplete[1]} onClick={onGlassClickGen(1)}>
            <img src={mediumGlassG} />
          </Button>
          <Button disabled={activeGlass.glassComplete[2]} onClick={onGlassClickGen(2)}>
            <img src={largeGlassG} />
          </Button>
          <Button disabled={activeGlass.glassComplete[3]} onClick={onGlassClickGen(3)}>
            <img src={xLGlassG} />
          </Button>
        </ButtonsContainer>
      )}
      <StyledText>{getPourCount(activeGlass)}</StyledText>
      <StyledText style={{ color: 'white', top: '315px', left: '455px' }}>
        {activeGlass.textDisplay}
      </StyledText>
      {activeGlass.showButtons && activeGlass.glassComplete.some((complete) => !complete) && (
        <AnimOnBoarding left={leftVar} src={clickGesture} loop autoplay />
      )}
      <Button disabled={activeGlass.showButtons || pourDisabled} onClick={onPourClick}>
        <Holder src={pourButton} style={{ top: '370px', left: '155px' }} />
      </Button>
    </AppletContainer>
  )
}
