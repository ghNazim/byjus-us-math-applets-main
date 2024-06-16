import { Player } from '@lottiefiles/react-lottie-player'
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import clickAnimation from '../../common/handAnimations/click.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import Animation from './041_01_GE.json'
import full from './full.svg'
import Poured from './poured.svg'
import text1 from './text1.svg'
import text3 from './text3.svg'
import text4 from './text4.svg'
import text5 from './text5.svg'

const ButtonContainer = styled.button`
  position: absolute;
  width: 86px;
  height: 36px;
  left: 193px;
  top: 435px;
  border: 0;
  background-color: #8c69ff;
  color: #fff;
  font-weight: 600;

  cursor: pointer;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }

  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`
const ConesPoured = styled.img`
  position: absolute;
  left: 350px;
  top: 460px;
`
const MainContainer = styled.div`
  position: absolute;
  top: 20px;
`
const PlayerContainer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: 0px;
  padding-top: ${(props) => props.top}px;
  pointer-events: none;
`
const NumberTextContainer = styled.div`
  position: absolute;
  left: 500px;
  top: 461px;
  font-size: 18px;
  color: black;
`

const flash = keyframes`
   from,
  50%,
  to {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 0;
  }
`
const FullContainer = styled.img`
  position: absolute;
  left: 435px;
  top: 350px;
  animation-duration: 1000ms;
  animation-timing-function: ease;
  animation-delay: 100ms;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${flash};
`

const TextsContainer = styled.div`
  /* position: absolute; */
  display: flex;
  flex-direction: column;
  align-items: center;
`
const positions = [528, 550, 592]
const TextImage = styled.img<{
  index: number
  page: number
  pos: number
  left?: number
  delay?: number
}>`
  position: absolute;
  left: ${(props) => props.left ?? 180}px;
  transition: ${(props) => (props.delay && props.index == 2 ? 'all' : 'top')} 500ms;
  transition-delay: ${(props) => props.delay ?? 0}ms;
  transition-duration: ${(props) => (props.delay && props.index == 2 ? props.delay * 1000 : 400)}ms;
  top: ${(props) =>
    props.index == props.page
      ? props.pos == 0
        ? positions[0]
        : props.pos == 1
        ? positions[1]
        : positions[2]
      : 620}px;
  opacity: ${(props) => (props.index == props.page ? 1 : 0)};
`

const initialAppState = { buttonDisable: false, conesPoured: 0, showConesPoured: 0 }
function AppReducer(state: typeof initialAppState, action: any) {
  if (action.type == 'pour') {
    state = { ...state, ...action.payload }
  }
  return state
}

const FRAMES = [116, 210, 313, 412]
export const Applet04101Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<Player>(null)
  const [appState, appStateDispatch] = useReducer(AppReducer, initialAppState)
  const [pageIndex, setPageIndex] = useState(0)
  const [lottieValue, setLottieValue] = useState(0)
  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')

  const onButtonClick = () => {
    if (playerRef.current == null) return
    appStateDispatch({
      type: 'pour',
      payload: { buttonDisable: true, conesPoured: appState.conesPoured },
    })
    onInteraction('tap')
    playClick()
  }

  const onEventHandle = () => {
    if (
      playerRef.current?.state.seeker == 57 ||
      playerRef.current?.state.seeker == 156 ||
      playerRef.current?.state.seeker == 248 ||
      playerRef.current?.state.seeker == 348
    )
      appStateDispatch({
        type: 'pour',
        payload: { showConesPoured: appState.showConesPoured + 1 },
      })
  }

  useEffect(() => {
    playerRef.current?.setSeeker(lottieValue)
  }, [lottieValue])

  useInterval(
    () => {
      FRAMES[appState.conesPoured] !== lottieValue
        ? setLottieValue((v) => v + 1)
        : appStateDispatch({
            type: 'pour',
            payload: { buttonDisable: false, conesPoured: appState.conesPoured + 1 },
          })
    },
    appState.buttonDisable ? 30 : null,
  )
  const onReset = () => {
    appStateDispatch({
      type: 'pour',
      payload: initialAppState,
    })
    setPageIndex(0)
    setLottieValue(0)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F3F7FE',
        id: '041_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Fill the sphere with water using cone of given dimensions and derive the formula for volume of sphere."
        backgroundColor="#F3F7FE"
        buttonColor="#BCD3FF"
      />
      <PageControl
        current={0}
        total={3}
        nextDisabled={appState.conesPoured !== 4}
        onChange={(e) => {
          e == 1 && lottieValue == 446 ? setLottieValue(468) : setLottieValue((v) => v)
          setPageIndex(e)
        }}
        onReset={onReset}
      />
      <PlayerContainer top={30} left={60} src={Animation} ref={playerRef} onEvent={onEventHandle} />

      {pageIndex == 0 && (
        <>
          <MainContainer>
            <ButtonContainer
              disabled={appState.buttonDisable || appState.conesPoured === 4}
              onClick={onButtonClick}
            >
              Pour
            </ButtonContainer>
          </MainContainer>
        </>
      )}
      <>
        <ConesPoured src={Poured}></ConesPoured>
        <NumberTextContainer>{appState.showConesPoured}</NumberTextContainer>
      </>
      {appState.conesPoured === 0 && !appState.buttonDisable && (
        <PlayerContainer top={430} left={160} src={clickAnimation} autoplay loop />
      )}

      <>
        <TextsContainer>
          {/* {pageIndex !== 2 && <TextImage1 src={text1} />} */}
          <TextImage
            src={text1}
            index={pageIndex}
            page={pageIndex == 1 || (pageIndex == 0 && appState.conesPoured === 4) ? pageIndex : -1}
            pos={appState.conesPoured === 4 ? (pageIndex == 0 ? 2 : pageIndex == 1 ? 1 : -1) : -1}
            left={120}
          />
          <TextImage
            src={text4}
            index={pageIndex}
            page={pageIndex == 1 || pageIndex == 2 ? pageIndex : -1}
            pos={pageIndex == 1 ? 2 : pageIndex == 2 ? 0 : -1}
          />
          <TextImage
            src={text3}
            index={pageIndex}
            page={pageIndex == 2 ? pageIndex : -1}
            pos={pageIndex == 2 ? 1 : -1}
            delay={0.9}
          />
          <TextImage
            src={text5}
            index={pageIndex}
            page={pageIndex == 2 ? pageIndex : -1}
            pos={pageIndex == 2 ? 2 : -1}
            delay={1.5}
          />
        </TextsContainer>
        {(pageIndex == 0 || pageIndex == 1 || pageIndex == 2) && appState.showConesPoured == 4 && (
          <FullContainer src={full} />
        )}
      </>
    </AppletContainer>
  )
}
