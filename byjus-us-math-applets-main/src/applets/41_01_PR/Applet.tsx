import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useSound from 'use-sound'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import tickAnimation from '../../common/handAnimations/tickAnimation.json'
import { Header } from '../../common/Header'
import { IncorrectFeedback } from '../../common/IncorrectFeedback'
import { Math } from '../../common/Math'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import { approxeq } from '../../utils/math'
import ballDeflation from './Assets/ballDeflation.mp3'
import ballInflate2 from './Assets/ballInflate2.json'
import ballInflation from './Assets/ballInflation.mp3'
import Disclaimer from './Assets/Disclaimer.svg'
import tryNewButton from './Assets/tryNewButton.svg'
import { Select } from './Select/index'
import { SelectVolume } from './Select/VolumeContainer'

const TickAnimation = styled(Player)`
  position: absolute;
  top: 130px;
  left: 100px;
`
const Container = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 581px;
  height: 317px;
  top: 176px;
  left: 70px;
  border: 1px solid #c7c7c7;
  border-radius: 15px;
`
const AnimContainer = styled(Player)`
  position: absolute;
  width: 600px;
  height: 600px;
  top: -140px;
  left: -15px;
`
const Text = styled.p`
  color: #444;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  max-width: 600px;
  min-height: 40px;
  text-align: center !important;
`
const InflateButton = styled.button`
  box-sizing: border-box;
  top: 120px;
  left: 70px;
  justify-content: center;
  align-items: center;
  padding: 9.78947px 13.0526px;
  position: absolute;
  width: 150px;
  height: 50px;
  background: #ffffff;
  border: 1.63158px solid #7f5cf4;
  border-radius: 8.15789px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #7f5cf4;
  cursor: pointer;
  &:disabled {
    cursor: none;
    background-color: #e8e1ff;
  }
  &:hover:not([disabled]) {
    background-color: #7f5cf4;
    color: #d6c8ff;
  }
  &:active:not([disabled]) {
    background-color: #6549c2;
    color: #dacffd;
  }
`
const DeflateButton = styled.div`
  box-sizing: border-box;
  top: 120px;
  left: 70px;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 9.78947px 13.0526px;
  position: absolute;
  width: 150px;
  height: 50px;
  background: #ffffff;
  border: 1.63158px solid #7f5cf4;
  border-radius: 8.15789px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 28px;
  color: #7f5cf4;
  cursor: pointer;
  &:disabled {
    cursor: none;
    background-color: #e8e1ff;
  }

  &:hover:not([disabled]) {
    background-color: #7f5cf4;
    color: #d6c8ff;
  }

  &:active:not([disabled]) {
    background-color: #6549c2;
    color: #dacffd;
  }
`
const CheckButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 9px 36px;
  position: absolute;
  width: 160px;
  height: 60px;
  left: 280px;
  top: 707.69px;
  background-color: #8c69ff;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;
  &:disabled {
    cursor: none;
    background-color: #e8e1ff;
  }

  &:hover:not([disabled]) {
    background-color: #7f5cf4;
  }

  &:active:not([disabled]) {
    background-color: #6549c2;
    color: #b4a6e1;
  }
`

const answerStateColors = {
  default: '#81B3FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  disable: '#85CC29',
}

const TryNewButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 9px 18px;

  position: absolute;
  width: 160px;
  height: 60px;
  left: 280px;
  top: 708px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  background: #8c69ff;
  border-radius: 10px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;
  flex: none;
  order: 1;
  flex-grow: 0;

  &:disabled {
    cursor: none;
    background-color: #e8e1ff;
  }

  &:hover:not([disabled]) {
    background-color: #7f5cf4;
  }

  &:active:not([disabled]) {
    background-color: #6549c2;
    color: #b4a6e1;
  }
`
const PopText = styled.div`
  width: 85%;
  margin: 50px 0;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  text-align: left;
  color: #444444;
  .katex {
    .mathdefault,
    .mathnormal,
    .mord {
      font-family: 'Nunito', sans-serif !important;
    }

    .mathbf {
      font-family: 'Nunito', sans-serif !important;
    }
  }
`
const questionText = ['6 inches', '12 cm', '18 cm', '6 cm']
const options1 = [
  ['36π', '27', '9π'],
  ['36π', '288π', '216'],
  ['729', '81π', '972π'],
  ['9π', '36π', '27'],
] as const
const options2 = [
  ['in', 'in²', 'in³'],
  ['cm', 'cm²', 'cm³'],
] as const
const firstFrame = 1
const lastFrame = 27

export const Applet4101Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [qnIndex, setQnIndex] = useState(0)
  const [showTickAnimation, setShowTickAnimation] = useState(false)
  const [answerState, setAnswerState] = useState<keyof typeof answerStateColors>('default')
  const [inputValue, setInputValue] = useState<(typeof options1)[number][number] | undefined>()
  const [checkButtonDisable, setCheckButtonDisable] = useState(false)
  const [unit, setUnit] = useState<(typeof options2)[number][number] | undefined>()
  const [progress, setProgress] = useState(0)
  const [progressTarget, setProgressTarget] = useState(0)
  const [inflateClick, setInflateClick] = useState(false)
  const [deflateClick, setDeflateClick] = useState(false)
  const [inflateButtonDisable, setInflateButtonDisable] = useState(true)
  const inflateRef = useRef<Player>(null)
  const [showPop, setShowPop] = useState({ component: false, animation: false })
  const playCorrect = useSFX('correct')
  const playMouseClick = useSFX('mouseClick')
  const [playBallInflation] = useSound(ballInflation)
  const [playBallDeflation] = useSound(ballDeflation)
  const [showTryNewButton, setShowTryNewButton] = useState(false)
  const [firstDropdownOpen, setFirstDropdownOpen] = useState(false)
  const [secondDropdownOpen, setSecondDropdownOpen] = useState(false)

  const errorText = String.raw`
\begin{align*}
\text{Volume of air}  &= \space \text{Volume of Spherical ball}\\
&= \space\frac {4}{3}  × \pi × \text{(radius)}^{3} \\
\end{align*}
`
  useInterval(
    () => {
      setProgress((p) => {
        if (p > progressTarget) return p - 0.01
        if (p < progressTarget) return p + 0.01
        return p
      })
    },
    approxeq(progress, progressTarget, 0.01) ? null : 10,
  )

  useEffect(() => {
    if (inflateRef.current == null) return
    inflateRef.current.setSeeker(progress * (lastFrame - firstFrame) + firstFrame)
  }, [deflateClick, inflateClick, progress])

  useEffect(() => {
    if (inflateClick) setProgressTarget(1)
    if (deflateClick) setProgressTarget(0)
  }, [deflateClick, inflateClick])

  const onCheckClick = () => {
    playMouseClick()
    setFirstDropdownOpen(false)
    setSecondDropdownOpen(false)
    switch (qnIndex) {
      case 0:
        if (inputValue == options1[qnIndex][0] && unit == options2[0][2]) {
          playCorrect()
          setAnswerState('right')
          setShowTickAnimation(true)
        } else {
          setAnswerState('wrong')
          setShowPop({ component: true, animation: true })
        }
        break
      case 1:
        if (inputValue == options1[qnIndex][1] && unit == options2[1][2]) {
          playCorrect()
          setAnswerState('right')
          setShowTickAnimation(true)
        } else {
          setAnswerState('wrong')
          setShowPop({ component: true, animation: true })
        }
        break
      case 2:
        if (inputValue == options1[qnIndex][2] && unit == options2[1][2]) {
          playCorrect()
          setAnswerState('right')
          setShowTickAnimation(true)
        } else {
          setAnswerState('wrong')
          setShowPop({ component: true, animation: true })
        }
        break
      case 3:
        if (inputValue == options1[qnIndex][1] && unit == options2[1][2]) {
          playCorrect()
          setAnswerState('right')
          setShowTickAnimation(true)
        } else {
          setAnswerState('wrong')
          setShowPop({ component: true, animation: true })
        }
        break
    }
  }

  const onTryNewClick = () => {
    setFirstDropdownOpen(false)
    setSecondDropdownOpen(false)
    playMouseClick()
    setQnIndex((v) => (v < 3 ? v + 1 : 0))
    setUnit(undefined)
    setInputValue(undefined)
    setAnswerState('default')
    setShowTryNewButton(false)
  }

  const onInflateClick = () => {
    playBallInflation()
    playMouseClick()
    setInflateClick(true)
    setDeflateClick(false)
    setInflateButtonDisable(false)
  }
  const onDeflateClick = () => {
    playBallDeflation()
    playMouseClick()
    setInflateClick(false)
    setDeflateClick(true)
    setInflateButtonDisable(true)
  }
  const popCloseHandle = () => {
    setUnit(undefined)
    setInputValue(undefined)
    setAnswerState('default')
    setShowPop((p) => ({ ...p, animation: false }))
  }
  const playerHandle = useCallback((event: any) => {
    if (event == 'complete') {
      setShowTickAnimation(false)
      setCheckButtonDisable(true)
      setShowTryNewButton(true)
    } else if (event !== 'complete') {
      setCheckButtonDisable(true)
    }
  }, [])

  useEffect(() => {
    if (inputValue) {
      setAnswerState('default')
    }
  }, [inputValue])

  useEffect(() => {
    setCheckButtonDisable(unit == null || unit == undefined || inputValue == null)
  }, [inputValue, unit])

  const toggleFirstDropdown = () => {
    setFirstDropdownOpen((prevState) => !prevState)
    setSecondDropdownOpen(false)
  }
  const toggleSecondDropdown = () => {
    setSecondDropdownOpen((prevState) => !prevState)
    setFirstDropdownOpen(false)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F3F7FE',
        id: '41_01_PR',
        onEvent,
        className,
      }}
    >
      <Header backgroundColor="#F3F7FE" buttonColor="#BCD3FF">
        <Text>
          What is the volume of air needed to fully inflate the ball below that has a diameter of{' '}
          <span style={{ color: '#6595DE' }}>{questionText[qnIndex]}</span>?
        </Text>
      </Header>
      <Container>
        <AnimContainer src={ballInflate2} ref={inflateRef}></AnimContainer>
      </Container>
      {inflateButtonDisable && (
        <InflateButton onClick={onInflateClick}>Inflate the ball</InflateButton>
      )}
      {!inflateButtonDisable && (
        <DeflateButton onClick={onDeflateClick}>Deflate the ball</DeflateButton>
      )}
      <CheckButton onClick={onCheckClick} disabled={checkButtonDisable}>
        Check
      </CheckButton>
      {showTryNewButton && (
        <TryNewButton onClick={onTryNewClick}>
          <img src={tryNewButton} />{' '}
        </TryNewButton>
      )}
      <SelectVolume
        options={options1[qnIndex]}
        onValueChange={setInputValue}
        state={answerState}
        disabled={answerState == 'right'}
        isOpen={firstDropdownOpen}
        toggleDropdown={toggleFirstDropdown}
      ></SelectVolume>
      <Select
        options={options2[qnIndex >= 1 ? 1 : 0]}
        onValueChange={setUnit}
        state={answerState}
        disabled={answerState == 'right'}
        isOpen={secondDropdownOpen}
        toggleDropdown={toggleSecondDropdown}
      />
      {showTickAnimation && (
        <TickAnimation src={tickAnimation} autoplay onEvent={playerHandle}></TickAnimation>
      )}
      {showPop.component && (
        <IncorrectFeedback
          showPopAnimation={showPop.animation}
          disclaimer={Disclaimer}
          onClose={popCloseHandle}
        >
          <PopText>
            <Math displayMode>{errorText}</Math>
          </PopText>
        </IncorrectFeedback>
      )}
    </AppletContainer>
  )
}
