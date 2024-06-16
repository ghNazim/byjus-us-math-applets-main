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
import Animation from './020_02_GE.json'
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

  cursor: pointer;
  &:disabled {
    cursor: default;
    filter: grayscale(1);
  }

  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`
const ConesPoured = styled.img`
  position: absolute;
  left: 330px;
  top: 430px;
`
const MainContainer = styled.div`
  position: absolute;
  top: 20px;
`
const PlayerContainer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: 60px;
  padding-top: ${(props) => props.top}px;
  pointer-events: none;
`
const NumberTextContainer = styled.div`
  position: absolute;
  left: 500px;
  top: 441px;
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
  left: 412px;
  top: 340px;
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

const TextImage = styled.img<{ index: number; page: number; pos: number }>`
  position: absolute;
  transition: top 500ms;
  top: ${(props) =>
    props.index == props.page ? (props.pos == 0 ? 528 : props.page == 1 ? 588 : 558) : 600}px;
  opacity: ${(props) => (props.index == props.page ? 1 : 0)};
`
const TextImage1 = styled.img`
  position: absolute;
  transition: top 500ms;
  top: 528px;
`

const initialAppState = { buttonDisable: false, conesPoured: 0, showConesPoured: 0 }
function AppReducer(state: typeof initialAppState, action: any) {
  if (action.type == 'pour') {
    state = { ...state, ...action.payload }
  }
  return state
}

const FRAMES = [158, 317, 445]
export const Applet02002Ge: React.FC<{
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
      playerRef.current?.state.seeker == 95 ||
      playerRef.current?.state.seeker == 255 ||
      playerRef.current?.state.seeker == 405
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
        id: '020_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Fill the cylinder with water using cone of same dimensions to observe the relation between their volumes"
        backgroundColor="#F3F7FE"
        buttonColor="#BCD3FF"
      />
      <PageControl
        current={0}
        total={3}
        nextDisabled={appState.conesPoured != 3}
        onChange={(e) => {
          e == 1 && lottieValue == 446 ? setLottieValue(468) : setLottieValue((v) => v)
          setPageIndex(e)
        }}
        onReset={onReset}
      />
      <PlayerContainer top={20} left={50} src={Animation} ref={playerRef} onEvent={onEventHandle} />

      {pageIndex == 0 && (
        <MainContainer>
          <ButtonContainer
            disabled={appState.buttonDisable || appState.conesPoured == 3}
            onClick={onButtonClick}
          >
            Pour
          </ButtonContainer>
          <ConesPoured src={Poured}></ConesPoured>
          <NumberTextContainer>{appState.showConesPoured}</NumberTextContainer>
        </MainContainer>
      )}
      {appState.conesPoured == 0 && !appState.buttonDisable && (
        <PlayerContainer top={370} left={160} src={clickAnimation} autoplay loop />
      )}
      {appState.conesPoured == 3 && (
        <>
          <TextsContainer>
            {pageIndex !== 2 && <TextImage1 src={text1} />}
            <TextImage src={text4} index={pageIndex} page={1} pos={1} />
            <TextImage src={text3} index={pageIndex} page={2} pos={0} />
            <TextImage src={text5} index={pageIndex} page={2} pos={1} />
          </TextsContainer>
          {(pageIndex == 0 || pageIndex == 1) && <FullContainer src={full} />}
        </>
      )}
    </AppletContainer>
  )
}
