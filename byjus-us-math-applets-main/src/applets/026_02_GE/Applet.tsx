import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import clickAnimation from '../../common/handAnimations/click.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import text1 from './Assets/text1.svg'
import text2 from './Assets/text2.svg'
import text3 from './Assets/text3.svg'
import pyramidAnimation from './Assets/Water_03_V5.json'

const ButtonContainer = styled.button`
  position: absolute;
  width: 86px;
  height: 36px;
  left: 171px;
  top: 520px;
  border: 0;
  background-color: #8c69ff;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  &:disabled {
    cursor: default;
    opacity: 0.2;
    color: white;
  }
`
const ConesPoured = styled.div`
  position: absolute;
  width: 187.09px;
  height: 33px;
  left: 354px;
  top: 524px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  color: #646464;
`
const MainContainer = styled.div<{ top: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  transition: top 500ms;
`
const PlayerContainer = styled(Player)<{ top: number }>`
  padding-top: ${(props) => props.top}px;
  pointer-events: none;
  transition: 500ms;
`
const HandAnimation = styled(Player)`
  position: absolute;
  left: 140px;
  bottom: 155px;
  pointer-events: none;
`
const NumberTextContainer = styled.div`
  position: absolute;
  width: 47.86px;
  height: 28px;
  left: 505.95px;
  top: 524px;
  background: #e8f0fe;
  border-radius: 5px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 29px;
  text-align: center;
  color: #444444;
`

const TextsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
`

const TextImage = styled.img<{ index: number; page: number; pos: number; top: number }>`
  position: absolute;
  transition: top 500ms;
  top: ${(props) =>
    props.index == props.page ? (props.pos == 0 ? 542 : props.page == 2 ? 629 : 591) : props.top}px;
  opacity: ${(props) => (props.index == props.page ? 1 : 0)};
  pointer-events: none;
`

const AnimOnBoarding = styled(Player)`
  position: absolute;
  top: 690px;
  left: 320px;
  pointer-events: none;
`
const initialAppState = { buttonDisable: true, conesPoured: 0, showConesPoured: 0 }
function AppReducer(state: typeof initialAppState, action: any) {
  if (action.type == 'pour') {
    state = { ...state, ...action.payload }
  }
  return state
}

const FRAMES = [260, 424, 560]

export const Applet02602Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<any>(null)
  const [appState, appStateDispatch] = useReducer(AppReducer, initialAppState)
  const [pageIndex, setPageIndex] = useState(0)
  const [lottieValue, setLottieValue] = useState(0)
  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')
  const [showClickOnboarding, setShowClickOnboarding] = useState(true)

  const onPageChange = useCallback((current: number) => setPageIndex(current), [])

  const onButtonClick = () => {
    if (playerRef.current == null) return
    appStateDispatch({
      type: 'pour',
      payload: { buttonDisable: true, conesPoured: appState.conesPoured },
    })
    onInteraction('tap')
    playClick()
  }
  useEffect(() => {
    playerRef.current?.setSeeker(lottieValue)
  }, [lottieValue])

  useEffect(() => {
    if (pageIndex > 0) setShowClickOnboarding(false)

    switch (pageIndex) {
      case 0:
        setLottieValue(27)
        break
      case 1:
        if (appState.conesPoured == 0) setLottieValue(27)
        else if (appState.conesPoured == 1) setLottieValue(260)
        else if (appState.conesPoured == 2) setLottieValue(424)
        else if (appState.conesPoured == 3) setLottieValue(560)
        break
    }
  }, [pageIndex])

  useInterval(
    () => {
      if (appState.buttonDisable && lottieValue >= 89)
        FRAMES[appState.conesPoured] !== lottieValue
          ? setLottieValue((v) => v + 1)
          : appStateDispatch({
              type: 'pour',
              payload: { buttonDisable: false, conesPoured: appState.conesPoured + 1 },
            })
      if (appState.conesPoured == 0 && lottieValue < 89) {
        setLottieValue((v) => v + 0.5)
        if (lottieValue > 88) {
          appStateDispatch({
            type: 'pour',
            payload: { buttonDisable: false },
          })
        }
      }
    },
    pageIndex == 1 ? 30 : null,
  )
  const onReset = () => {
    appStateDispatch({
      type: 'pour',
      payload: initialAppState,
    })
    setPageIndex(0)
    setLottieValue(0)
    setShowClickOnboarding(true)
  }
  const onEventHandle = () => {
    if (
      playerRef.current?.state.seeker == 190 ||
      playerRef.current?.state.seeker == 356 ||
      playerRef.current?.state.seeker == 528
    )
      appStateDispatch({
        type: 'pour',
        payload: { showConesPoured: appState.showConesPoured + 1 },
      })
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '026_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Fill the liquid in the prism using the pyramid shaped container and obtain the relation between their volumes."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <PageControl
        current={0}
        total={4}
        nextDisabled={pageIndex == 1 && appState.conesPoured != 3 ? true : false}
        onChange={onPageChange}
        onReset={onReset}
      />
      <PlayerContainer
        top={pageIndex == 2 || pageIndex == 3 ? 35 : 85}
        src={pyramidAnimation}
        ref={playerRef}
        onEvent={onEventHandle}
      />

      {pageIndex !== 0 && lottieValue > 58 && (
        <MainContainer top={pageIndex == 2 || pageIndex == 3 ? -50 : 0}>
          <ButtonContainer
            disabled={appState.buttonDisable || appState.conesPoured == 3}
            onClick={onButtonClick}
          >
            Pour
          </ButtonContainer>
          <ConesPoured>Pour count = </ConesPoured>
          <NumberTextContainer>{appState.showConesPoured}</NumberTextContainer>
        </MainContainer>
      )}
      {pageIndex == 1 && appState.conesPoured == 0 && !appState.buttonDisable && (
        <HandAnimation src={clickAnimation} autoplay loop />
      )}
      <TextsContainer>
        <TextImage
          src={text1}
          index={appState.conesPoured == 3 ? pageIndex : -1}
          page={pageIndex == 1 || pageIndex == 2 ? pageIndex : 1}
          pos={pageIndex == 1 ? 1 : 0}
          top={630}
        />
        <TextImage
          src={text2}
          index={pageIndex}
          page={pageIndex == 3 || pageIndex == 2 ? pageIndex : 2}
          pos={pageIndex == 2 ? 1 : 0}
          top={645}
        />
        <TextImage src={text3} index={pageIndex} page={3} pos={1} top={625} />
      </TextsContainer>
      {showClickOnboarding && <AnimOnBoarding src={clickAnimation} loop autoplay />}
    </AppletContainer>
  )
}
