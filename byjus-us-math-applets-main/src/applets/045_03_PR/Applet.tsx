import { Player } from '@lottiefiles/react-lottie-player'
import React, { Component, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Button } from '../../common/Button'
import { TextHeader } from '../../common/Header'
import { IncorrectFeedback } from '../../common/IncorrectFeedback'
import { AppletInteractionCallback } from '../../contexts/analytics'
import correct from './Assets/correct.mp3'
import disclaimer from './Assets/disclaimer.png'
import incorrect from './Assets/incorrect.wav'
import prism from './Assets/prism.json'
import rectangle from './Assets/Rectangle.svg'
import Blast from './Assets/TickAnimation.json'
import cop1 from './images/correct/Correct1.svg'
import cop2 from './images/correct/Correct2.svg'
import cop3 from './images/correct/Correct3.svg'
import cop4 from './images/correct/Correct4.svg'
import cop5 from './images/correct/Correct5.svg'
import cop6 from './images/correct/Correct6.svg'
import cop7 from './images/correct/Correct7.svg'
import icop1 from './images/incorrect/Incorrect1.svg'
import icop2 from './images/incorrect/Incorrect2.svg'
import icop3 from './images/incorrect/Incorrect3.svg'
import icop4 from './images/incorrect/Incorrect4.svg'
import icop5 from './images/incorrect/Incorrect5.svg'
import icop6 from './images/incorrect/Incorrect6.svg'
import icop7 from './images/incorrect/Incorrect7.svg'
import ToggleGroup from './ToggleGroup/ToggleGroup'

const CORRECT_OPTIONLIST = [cop1, cop2, cop3, cop4, cop5, cop6, cop7]
const INCORRECT_OPTIONLIST = [icop1, icop2, icop3, icop4, icop5, icop6, icop7]

const AnimationPlayer = styled(Player)`
  position: absolute;
  top: 130px;
  left: 100px;
  z-index: 1;
`

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
const answerStateColors = {
  default: '#FAF2FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  disable: '#c7c7c7',
}

const PlacedSlider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 410px;
`

const PlacedPlayer = styled(Player)`
  position: absolute;
  top: 100px;
  left: 250px;
  width: 230px;
  height: 230px;
`
const RectangleBG = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 400px;
  z-index: -1;
`

function genImageList(correctIndex: number) {
  const arr = ['', '', '']
  const sampleIncorrect = INCORRECT_OPTIONLIST.sort(() => 0.5 - Math.random()).slice(0, 2)
  const sampleCorrect = CORRECT_OPTIONLIST[Math.floor(Math.random() * CORRECT_OPTIONLIST.length)]
  for (let i = 0; i < arr.length; i++) {
    if (i === correctIndex) {
      arr[i] = sampleCorrect
    } else {
      arr[i] = sampleIncorrect.pop() ?? ''
    }
  }

  return arr
}

export const Applet04503Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<Player>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [disable, setDisable] = useState(false)
  const [checkButtonDisable, setCheckButtonDisable] = useState(true)
  const [showTryNewButton, setShowTryNewButton] = useState(false)
  const [imageList, setImageList] = useState<string[]>([])
  const [correctIndex, setCorrectIndex] = useState(-1)
  const [showTickAnimation, setShowTickAnimation] = useState(false)
  const playCorrect = useSFX('correct')
  const playIncorrect = useSFX('incorrect')
  const [answerState, setAnswerState] = useState<keyof typeof answerStateColors>('default')
  const [showPop, setShowPop] = useState({ component: false, animation: false })

  const onSliderChange = (value: number) => {
    playerRef.current?.setSeeker(Math.round((value / 100) * 30))
  }
  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId < 0) return
    setSelectedIndex(activeId)
    setCheckButtonDisable(false)
    setDisable(true)
  }, [])

  const onTryNew = () => {
    const correct = Math.floor(Math.random() * 3)
    setCorrectIndex(correct)
    setImageList(genImageList(correct))
    setShowTickAnimation(false)
    setSelectedIndex(-1)
    setDisable(false)
    setShowTryNewButton(false)
    setCheckButtonDisable(true)
    setAnswerState('default')
  }

  useEffect(onTryNew, [])

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

  const popCloseHandle = () => {
    setShowPop((p) => ({ ...p, animation: false }))
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '045_03_PR',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Select the net which could make an identical square pyramid."
        backgroundColor="#FAF2FF"
        buttonColor="#FFCCDB"
        hideButton={true}
      />

      {showTickAnimation && <AnimationPlayer src={Blast} autoplay />}
      <PlacedPlayer src={prism} ref={playerRef} />
      <PlacedSlider
        onChangePercent={(e) => {
          onSliderChange(e)
        }}
        min={0}
        max={30}
      />
      <RectangleBG src={rectangle} />
      <ToggleGroup
        images={imageList}
        onChange={handleToggleChange}
        disabled={disable}
        colorState={answerState}
      />
      {!showTryNewButton && (
        <Button disable={checkButtonDisable} onClick={onCheckClick} type={'check'} />
      )}

      {showTryNewButton && <Button onClick={onTryNew} type={'tryNew'} />}
      {showPop.component && (
        <IncorrectFeedback
          showPopAnimation={showPop.animation}
          disclaimer={disclaimer}
          onClose={popCloseHandle}
        >
          <PopText>
            <p>A square pyramid has 1 square base and 4 triangular faces.</p>
          </PopText>
        </IncorrectFeedback>
      )}
    </AppletContainer>
  )
}
