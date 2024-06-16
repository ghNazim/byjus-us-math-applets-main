import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Button } from '../../common/Button'
import { TextHeader } from '../../common/Header'
import { IncorrectFeedback } from '../../common/IncorrectFeedback'
import { Ticker } from '../../common/Ticker'
import { TogglesGroup } from '../../common/TogglesGroup'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { useRandomIndex } from '../../hooks/useRandomIndex'
import Animation1 from './Assets/Card_01/anim1.mp4'
import Animation2 from './Assets/Card_02/anim2.mp4'
import Animation3 from './Assets/Card_03/anim3.mp4'
import Animation4 from './Assets/Card_04/anim4.mp4'
import Animation5 from './Assets/Card_05/anim5.mp4'
import correct from './Assets/correct.mp3'
import cross from './Assets/cross.png'
import disclaimer from './Assets/disclaimer.png'
import incorrect from './Assets/incorrect.wav'
import Blast from './Assets/TickAnimation.json'

const AnimationPlayer = styled(Player)`
  position: absolute;
  top: 130px;
  left: 100px;
  z-index: 1;
  pointer-events: none;
`

const LottiePlayer = styled(Player)`
  position: absolute;
  bottom: 100px;
  left: 70px;
  pointer-events: none;
`
const PlacedPlayer = styled.video`
  position: absolute;
  top: 50px;
  left: 180px;
`
const TickerContainer = styled.div<{ firstLoad: boolean }>`
  display: flex;
  position: absolute;
  top: 430px;
  left: 220px;
`
const TickerLabel = styled.span`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  color: #646464;
  padding: 0 5px;
`
const answerStateColors = {
  default: '#FAF2FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  disable: '#c7c7c7',
}
const PopText = styled.div`
  width: 85%;
  margin: 80px 0;
  p {
    margin: 0;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    color: #444444;
  }
`
const CorrectOptions = [40, 27, 20, 36, 16]
const IncorrectOptions = ['35', '4', '12', '13', '1', '21', '15', '74', '19', '89']
const animations = [Animation1, Animation2, Animation3, Animation4, Animation5]
export const Applet4301Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<HTMLVideoElement>(null)
  const [loadAnime, setLoadAnime] = useState(false)
  const [tickerLength, setTickerLength] = useState(0)
  const [optionList, setOptionList] = useState<string[]>([''])
  const [animation, setAnimation] = useState<string>('')
  const [tickerMax, setTickerMax] = useState(0)
  const [showHand, setShowHand] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showPop, setShowPop] = useState({ component: false, animation: false })
  const [answerState, setAnswerState] = useState<keyof typeof answerStateColors>('default')
  const [checkButtonDisable, setCheckButtonDisable] = useState(true)
  const [showTryNewButton, setShowTryNewButton] = useState(false)
  const [resetToggle, setResetToggle] = useState(false)
  const [correctIndex, setCorrectIndex] = useState(-1)
  const [showTickAnimation, setShowTickAnimation] = useState(false)
  const [resetTicker, setResetTicker] = useState(0)
  const playCorrect = useSFX('correct')
  const playIncorrect = useSFX('incorrect')
  const onChange = (value: number) => {
    setTickerLength(value)
  }

  const getRandomIndex = useRandomIndex(animations.length)

  function genOptionList() {
    const sampleIncorrect = IncorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 2)
    const sampleIndex = getRandomIndex()

    const correctOptionIndex = Math.floor(Math.random() * 3)
    setCorrectIndex(correctOptionIndex)

    const options = ['', '', '']
    const sampleCorrect = CorrectOptions[sampleIndex]
    for (let i = 0; i < options.length; i++) {
      if (i === correctOptionIndex) {
        options[i] = sampleCorrect.toString()
      } else {
        options[i] = sampleIncorrect.pop() ?? ''
      }
    }

    setOptionList(options)
    setAnimation(animations[sampleIndex])
    setTickerMax(CorrectOptions[sampleIndex])
  }
  const popCloseHandle = () => {
    setShowPop((p) => ({ ...p, animation: false }))
    setCheckButtonDisable(true)
    setSelectedIndex(-1)
    setResetToggle(true)
    setAnswerState('default')
  }

  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId < 0) return
    setSelectedIndex(activeId)
    setCheckButtonDisable(false)
    setResetToggle(true)
  }, [])

  useEffect(() => {
    if (playerRef.current == null) return
    const progress = tickerLength != 0 ? tickerLength / CorrectOptions[correctIndex] : 0
    const duration = playerRef.current.duration

    playerRef.current.currentTime = isFinite(duration) ? progress * duration : 0
  }, [tickerLength, correctIndex])

  useEffect(() => {
    if (resetToggle) {
      setResetToggle(false)
    }
  }, [resetToggle])

  const onCheckClick = () => {
    if (selectedIndex === correctIndex) {
      setShowTickAnimation(true)
      setCheckButtonDisable(false)
      setShowTryNewButton(true)
      playCorrect()
      setAnswerState('right')
    } else {
      setShowPop({ component: true, animation: true })
      playIncorrect()
      setAnswerState('wrong')
    }
  }

  const onTryNew = () => {
    setShowTickAnimation(false)

    genOptionList()
    setSelectedIndex(-1)
    setResetToggle(true)
    setShowTryNewButton(false)
    setCheckButtonDisable(true)
    setAnswerState('default')
    setResetTicker((t) => t + 1)
  }

  useEffect(() => {
    onTryNew()
  }, [])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FFF6DB',
        id: '43_01_PR',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="What is the volume of below prism ?"
        backgroundColor="#FFF6DB"
        buttonColor="#D1F7FF"
        hideButton={true}
      />
      <PlacedPlayer src={animation} muted width={'50%'} height={'50%'} ref={playerRef} />

      <TickerContainer firstLoad={loadAnime}>
        <TickerLabel>Number of unit cubes = </TickerLabel>
        <Ticker
          key={resetTicker}
          value={0}
          min={0}
          max={tickerMax}
          onChange={onChange}
          showHandDefault={showHand}
        />
      </TickerContainer>

      <TogglesGroup
        optionArray={optionList}
        onChange={handleToggleChange}
        dimensions={{ width: 457, height: 60 }}
        position={{ left: 125, top: 530 }}
        childDimensions={{ width: 147, height: 60 }}
        disabled={resetToggle}
        showOnBoarding={false}
        isImage={false}
        textColor={'#444444'}
        colorState={answerState}
        highlightColor={'#E8F0FE'}
      />

      {showPop.component && (
        <IncorrectFeedback
          showPopAnimation={showPop.animation}
          disclaimer={disclaimer}
          onClose={popCloseHandle}
        >
          <PopText>
            <p>Count the total number of unit cubes that can fit inside the rectangular prism.</p>
          </PopText>
        </IncorrectFeedback>
      )}
      {!showTryNewButton && (
        <Button disable={checkButtonDisable} onClick={onCheckClick} type={'check'} />
      )}

      {showTryNewButton && <Button onClick={onTryNew} type={'tryNew'} />}
      {showTickAnimation && <AnimationPlayer src={Blast} autoplay />}
    </AppletContainer>
  )
}
