import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import candyOne from './assets/candyOne.svg'
import candyTwo from './assets/candyTwo.svg'
import checkActive from './assets/check.svg'
import checkInactive from './assets/checkInactive.svg'
import tryAgain from './assets/tryagain.svg'

const CTAButton = styled.img`
  position: absolute;
  bottom: 20px;
  left: 50%;
  translate: -50%;
  &.active {
    cursor: pointer;
  }
`
const NudgePlayer = styled(Player)`
  position: absolute;
  left: 410px;
  bottom: 50px;
  pointer-events: none;
  z-index: 1;
`
const InputBox = styled.input<{ state: number }>`
  position: relative;
  width: 80px;
  height: 55px;
  margin-top: 5px;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid ${(p) => (p.state == 1 ? '#CC6666' : p.state == 0 ? '#c7c7c7' : '#32A66C')};
  font-size: 21px;
  text-align: center;
  color: ${(p) => (p.state == 1 ? '#CC6666' : p.state == 0 ? '#212121' : '#32A66C')};
  background-color: ${(p) => (p.state == 1 ? '#FFF2F2' : p.state == 0 ? 'white' : '#E5FFEC')};
  box-shadow: ${(p) => (p.state > 0 ? 'none' : '0px -4px 0px 0px #c7c7c7 inset')};
`
const Feedback = styled.div`
  position: absolute;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: Nunito;
  top: 582px;
  text-align: center;
`
const Viewbox = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  width: 680px;
  height: 440px;
  top: 100px;
  background-color: #f3f7fe;
`
const Gridbox = styled.div<{ top: number }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: ${(p) => p.top}px;
  display: grid;
  width: 500px;
  height: 200px;
  grid-template-columns: repeat(5, 1fr);
  background-color: white;
  border: 1px solid #c7c7c7;
  border-collapse: collapse;
  div {
    text-align: center;
    border: 1px solid #c7c7c7;
    border-collapse: collapse;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
const GridTable: FC<{
  top: number
  value: number
  content: any
}> = ({ top, value, content }) => {
  return (
    <Gridbox top={top}>
      {[...Array(value).keys()].map((index) => (
        <div key={index}>
          <img src={content} draggable={false} />
        </div>
      ))}
      {[...Array(10 - value).keys()].map((index) => (
        <div key={index}>
          <img src={content} draggable={false} style={{ visibility: 'hidden' }} />
        </div>
      ))}
    </Gridbox>
  )
}

export const AppletG01POCGB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [count, setCount] = useState(1)
  const [candy, setCandy] = useState(3 + Math.floor(Math.random() * 6))
  const [answer, setAnswer] = useState('')
  const [button, setButton] = useState(0)
  const [correctness, setCorrectness] = useState(0)
  const [nudgeOn, setNudgeOn] = useState(true)
  const feedbackArray = [
    'Count the number of candies and enter the value.',
    'Oops! That’s incorrect.',
    'Perfect! That’s correct.',
  ]
  const playMouseCLick = useSFX('mouseClick')
  const playCorrect = useSFX('correct')
  const playInorrect = useSFX('incorrect')
  useEffect(() => {
    if (answer != '') {
      setButton(1)
      setCorrectness(0)
    } else setButton(0)
  }, [answer])

  function checkClickHandle() {
    if (Number(answer) == candy) {
      setCorrectness(2)
      setButton(2)
      playCorrect()
    } else {
      playInorrect()
      setCorrectness(1)
      setButton(0)
    }
  }
  function tryNewHandle() {
    playMouseCLick()
    if (count < 3) {
      setCandy(3 + Math.floor(Math.random() * 8))
    } else if (count < 6) {
      setCandy(11 + Math.floor(Math.random() * 10))
    } else {
      if (count % 6 < 3) setCandy(3 + Math.floor(Math.random() * 8))
      else setCandy(11 + Math.floor(Math.random() * 10))
    }
    setAnswer('')
    setCorrectness(0)
    setButton(0)
    setCount((c) => c + 1)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'demo-counting',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader text="Counting candies" backgroundColor="#F6F6F6" buttonColor="#1A1A1A" />
      <Viewbox>
        <GridTable
          top={candy <= 10 ? 120 : 10}
          content={count % 2 == 1 ? candyOne : candyTwo}
          value={candy <= 10 ? candy : 10}
        />
        {candy > 10 && (
          <GridTable top={230} content={count % 2 == 1 ? candyOne : candyTwo} value={candy - 10} />
        )}
      </Viewbox>
      <Feedback>
        {feedbackArray[correctness]}
        <br />
        Total number of candies = &nbsp;
        <InputBox
          tabIndex={1}
          type="text"
          state={correctness}
          value={answer}
          onClick={() => {
            setNudgeOn(false)
            playMouseCLick()
          }}
          onChange={(e) => {
            setAnswer(() => e.target.value.replace(/[^0-9]/g, ''))
          }}
          disabled={correctness == 2}
        />
      </Feedback>
      {button == 1 && (
        <CTAButton
          className="active"
          draggable={false}
          src={checkActive}
          onClick={checkClickHandle}
        />
      )}
      {button == 0 && <CTAButton draggable={false} src={checkInactive} />}
      {button == 2 && (
        <CTAButton className="active" draggable={false} src={tryAgain} onClick={tryNewHandle} />
      )}
      {nudgeOn && <NudgePlayer src={click} autoplay loop />}
    </AppletContainer>
  )
}

