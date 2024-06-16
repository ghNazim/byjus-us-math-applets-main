import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Button } from '../../common/Button'
import { TextHeader } from '../../common/Header'
import { Ticker } from '../../common/Ticker'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { QnModels } from './Assets/assetLib'
import PopUp from './Assets/PopUp'
import successAnimation from './Assets/TickAnimation.json'

const TickerHolder = styled.div<{ textFade: boolean }>`
  position: absolute;
  width: 300px;
  height: 55px;
  left: 257px;
  top: 153px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  gap: 1rem;
  align-items: center;
  text-align: center;
  color: #646464;
  transition: 0.2s;
  opacity: ${(props) => (props.textFade ? 1 : 0)};
  z-index: 2;
`

const AnimationContainer = styled.video<{ frameFade: boolean }>`
  position: absolute;
  width: 600px;
  height: 600px;
  left: 50px;
  top: 60px;
  transition: 0.2s;
  opacity: ${(props) => (props.frameFade ? 1 : 0)};
`

const StyledButton = styled.button<{ active: boolean }>`
  width: 150px;
  height: 60px;
  border: 2px solid #81b3ff;
  border-radius: 10px;
  background-color: ${(props) => (props.active ? '#e8f0fe' : 'white')};
  color: #444;
  font-size: large;
  font-family: 'Nunito';
  cursor: pointer;
  &:disabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.2;
  }
  &:hover {
    background: #c0d6fd;
  }
  &:active {
    background: #e8f0fe;
  }
`

const ButtonHolder = styled.button`
  position: absolute;
  top: 580px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  background-color: white;
  border: 0px;
`

const SuccessPlayer = styled(Player)`
  position: absolute;
  margin: auto;
  width: 720px;
  height: 800px;
  pointer-events: none;
`
const StyledTicker = styled(Ticker)``

export const Applet3602Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [currentQn, setCurrentQn] = useState(QnModels[0])
  const playerRef = useRef<HTMLVideoElement>(null)
  const [tickerVal, setTickerVal] = useState(0)
  const [activeSelection, setActiveSelection] = useState(0)
  const [popup, setPopup] = useState(false)
  const [playSuccessAnimation, setPlaySuccessAnimation] = useState(false)
  const [deactivateBtn, setDeactivateBtn] = useState(true)
  const [answered, setAnswered] = useState(false)
  const [resetTicker, setResetTicker] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseClick')
  const playCorrect = useSFX('correct')
  const playIncorrect = useSFX('incorrect')

  const onChange = (e: any) => {
    setTickerVal(e)
    if (e === currentQn.totalCubes) setDeactivateBtn(false)
  }

  const checkAnswer = () => {
    if (answered) resetQn()
    else {
      if (activeSelection === currentQn.correctIndex) {
        playCorrect()
        setAnswered(true)
        setPlaySuccessAnimation(true)
      } else {
        playIncorrect()
        setPopup(true)
      }
    }
  }

  useEffect(() => {
    if (playerRef.current) playerRef.current.currentTime = 0.045 * tickerVal
  }, [tickerVal])

  const renderButtons = () => {
    return currentQn.options.map((value, index) => (
      <StyledButton
        key={index}
        disabled={deactivateBtn}
        active={activeSelection === index + 1}
        onClick={() => {
          playMouseOut()
          setActiveSelection(index + 1)
        }}
      >
        {currentQn.options[index]}
      </StyledButton>
    ))
  }

  const resetQn = () => {
    setResetTicker(true)
    const currentIndex = currentQn.index
    if (currentIndex === 3) setCurrentQn(QnModels[0])
    else setCurrentQn(QnModels[currentIndex + 1])
    setAnswered(false)
    setDeactivateBtn(true)
    setActiveSelection(0)
    setPlaySuccessAnimation(false)
  }

  useEffect(() => {
    setResetTicker(false)
  }, [tickerVal])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '36_02_PR',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Unit cubes of mass 1 mg make up the bigger cube, what is the mass of bigger cube?"
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <TickerHolder textFade={true}>
        <p>Number of unit cubes =</p>
        <StyledTicker
          min={0}
          max={currentQn.totalCubes}
          step={currentQn.step}
          onChange={onChange}
          reset={resetTicker}
          showHandOnBoarding={tickerVal === 0}
        />
      </TickerHolder>
      <AnimationContainer
        frameFade={true}
        src={currentQn.src}
        muted
        width={'50%'}
        height={'50%'}
        ref={playerRef}
      />
      <ButtonHolder>{renderButtons()}</ButtonHolder>
      <Button
        onClick={checkAnswer}
        disable={activeSelection === 0}
        type={answered ? 'tryNew' : 'check'}
      />
      {popup ? <PopUp onclick={() => setPopup(false)} /> : null}
      {playSuccessAnimation && (
        <SuccessPlayer
          // onEvent={(e) => }
          src={successAnimation}
          autoplay
          loop={false}
        />
      )}
    </AppletContainer>
  )
}
