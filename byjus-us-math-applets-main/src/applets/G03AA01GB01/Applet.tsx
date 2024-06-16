import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { click, clickAndDrag } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { Math } from '@/common/Math'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { RangeInput } from '@/molecules/RangeInput'

import CheckActive from './assets/CheckActive.svg'
import CheckInactive from './assets/CheckInactive.svg'
import NL from './assets/Numberline.svg'
import Page0Background from './assets/Page0BG.svg'
import Page1Background from './assets/Page1BG.svg'
import Page1CT from './assets/Page1CorrectText.svg'
import Page1IT from './assets/Page1IncorrectText.svg'
import Page1NT from './assets/Page1NormalText.svg'
import StartBut from './assets/StartButton.svg'
import TryNewB from './assets/TryNewBut.svg'

const Slider = styled(RangeInput)<{ left: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: 630px;
  width: 40%;
`

const PageBG = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 90px;
  z-index: 0;
`

const Texts = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 520px;
  z-index: 1;
`
const NumerLineIMG = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 240px;
  z-index: 0;
`

const LineContainer = styled.div`
  position: absolute;
  top: 324px;
  left: 50%;
  translate: -50%;
  height: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  text-align: center;
  font-size: 12px;
  margin-top: -10px;
  width: 85%;
  border-left: 1px solid #888;
  border-right: 1px solid #888;
`

const LinePartition = styled.div<{ color: string; anim: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: center;
  text-align: center;
  border-left: 1px solid #888;
  border-right: 1px solid #888;
  border-top: 2px solid ${(p) => p.color};
  flex-grow: 1;
  font-size: 28px;
  animation: ${(p) =>
    p.anim == 'left'
      ? css`
          ${slideLeft} 1s forwards
        `
      : p.anim == 'right'
      ? css`
          ${slideRight} 1s forwards
        `
      : ''};
`

const LinePartitionWithLabel: FC<{
  numerator: string
  denominator: string
  color: string
  animB: string
}> = ({ numerator, denominator, color, animB }) => (
  <LinePartition color={color} anim={animB}>
    <div style={{ position: 'absolute', bottom: '30px', right: '-7px' }}>
      <Math>{String.raw`
    \frac{${numerator}}{${denominator}}
  `}</Math>
    </div>
  </LinePartition>
)

const slideLeft = keyframes`
  from {
    flex-grow: 1.5;
  }
  to {
    flex-grow: 1;
  }
  `
const slideRight = keyframes`
  from {
    flex-grow: 0.5;
  }
  to {
    flex-grow: 1;
  }
  `
const generateFractions = (denominator: number) => {
  const fractions = []
  for (let numerator = 1; numerator <= denominator; numerator++) {
    fractions.push([numerator, denominator] as const)
  }
  return fractions
}
const CheckButtonActive = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 720px;
  z-index: 1;
  cursor: pointer;
`
const CheckButtonInactive = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 720px;
  z-index: 0;
`

const StartTryNewButton = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 720px;
  z-index: 2;
  cursor: pointer;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 2;
`

export const AppletG03AA01GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [slider1Value, setSlider1Value] = useState(1)
  const [slider2Value, setSlider2Value] = useState(0)
  const [prevVal, setPrevVal] = useState(1)
  const [slider1Interacted, setSlider1Interacted] = useState(false)
  const [slider2Interacted, setSlider2Interacted] = useState(false)
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [isButtonInActive, setIsButtonInActive] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [isTryNewActive, setIsTryNewActive] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [grids, setGrids] = useState([<></>])

  const [showNormalText, setShowNormalText] = useState(false)
  const [showCorrectText, setShowCorrectText] = useState(false)
  const [showIncorrectText, setShowIncorrectText] = useState(false)
  const playCorrect = useSFX('correct')
  const playInCorrect = useSFX('incorrect')
  const playMouseClick = useSFX('mouseClick')

  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)

  const questions = [
    <div
      key={1}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '100px',

        zIndex: 1,
      }}
    >
      <div
        style={{
          fontFamily: 'Nunito',
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: '28px',
          letterSpacing: '0px',
          textAlign: 'center',
        }}
      >
        Fraction of ants doing the twist dance =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '460px' }}>
          <Math>{String.raw`
      \frac{${1}}{${4}}
    `}</Math>
        </div>
      </div>
    </div>,
    <div
      key={2}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '100px',

        zIndex: 1,
      }}
    >
      <div
        style={{
          fontFamily: 'Nunito',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '28px',
          letterSpacing: '0px',
          textAlign: 'center',
        }}
      >
        Fraction of ants doing the twist dance =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '460px' }}>
          <Math>{String.raw`
    \frac{${3}}{${5}}
  `}</Math>
        </div>
      </div>
    </div>,
    <div
      key={2}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '100px',

        zIndex: 1,
      }}
    >
      <div
        style={{
          fontFamily: 'Nunito',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '28px',
          letterSpacing: '0px',
          textAlign: 'center',
        }}
      >
        Fraction of ants doing the twist dance =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '460px' }}>
          <Math>{String.raw`
   \frac{${2}}{${5}}
 `}</Math>
        </div>
      </div>
    </div>,
    <div
      key={2}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '100px',

        zIndex: 1,
      }}
    >
      <div
        style={{
          fontFamily: 'Nunito',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '28px',
          letterSpacing: '0px',
          textAlign: 'center',
        }}
      >
        Fraction of ants doing the twist dance =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '460px' }}>
          <Math>{String.raw`
    \frac{${1}}{${3}}
  `}</Math>
        </div>
      </div>
    </div>,
    <div
      key={2}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '100px',

        zIndex: 1,
      }}
    >
      <div
        style={{
          fontFamily: 'Nunito',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '28px',
          letterSpacing: '0px',
          textAlign: 'center',
        }}
      >
        Fraction of ants doing the twist dance =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '460px' }}>
          <Math>{String.raw`
    \frac{${2}}{${3}}
  `}</Math>
        </div>
      </div>
    </div>,
    <div
      key={2}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '100px',

        zIndex: 1,
      }}
    >
      <div
        style={{
          fontFamily: 'Nunito',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '28px',
          letterSpacing: '0px',
          textAlign: 'center',
        }}
      >
        Fraction of ants doing the twist dance =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '460px' }}>
          <Math>{String.raw`
    \frac{${1}}{${2}}
  `}</Math>
        </div>
      </div>
    </div>,
  ]

  const handleSlider1Change = (value: number) => {
    setSlider1Value(value)
    setSlider1Interacted(true)
    setShowOnboarding1(false)
    if (slider1Interacted && slider2Interacted) {
      setIsButtonActive(true)
    } else {
      setIsButtonActive(false)
    }
    if (slider2Value > value) setSlider2Value(value)
  }
  const handleSlider2Change = (value: number) => {
    if (value <= slider1Value) {
      setSlider2Value(value)
      setSlider2Interacted(true)
      setShowOnboarding1(false)
      if (slider1Interacted && slider2Interacted) {
        setIsButtonActive(true)
      } else {
        setIsButtonActive(false)
      }
    }
  }

  const handleStartButtonClick = () => {
    playMouseClick()
    setCurrentPage(1)
    setShowNormalText(true)
  }

  useEffect(() => {
    if (currentPage === 1) {
      const boxes = []

      const fractions = generateFractions(slider1Value)

      for (let i = 1; i <= slider1Value; i++) {
        const [numerator, denominator] = fractions[i - 1]
        boxes.push(
          <LinePartitionWithLabel
            key={i}
            numerator={numerator.toString()}
            denominator={denominator.toString()}
            color={i <= slider2Value ? '#FF8F1F' : 'transparent'}
            animB={i == slider1Value ? '' : prevVal <= slider1Value ? 'left' : 'right'}
          />,
        )
      }
      setGrids(boxes)
      setPrevVal(slider1Value)
    }
  }, [slider1Value, currentPage, slider2Value, prevVal])

  const handleCheckButtonClick = () => {
    playMouseClick()
    setShowNormalText(false)
    if (currentQuestionIndex === 0) {
      if (slider1Value === 4 && slider2Value === 1) {
        setIsButtonActive(false)
        setIsButtonInActive(true)
        setIsTryNewActive(true)
        playCorrect()
        setShowCorrectText(true)
        setShowIncorrectText(false)
      } else {
        setShowIncorrectText(true)
        playInCorrect()
      }
    } else if (currentQuestionIndex === 1) {
      if (slider1Value === 5 && slider2Value === 3) {
        setIsButtonActive(false)
        setIsButtonInActive(true)
        setIsTryNewActive(true)
        setShowCorrectText(true)
        playCorrect()
        setShowIncorrectText(false)
      } else {
        setShowIncorrectText(true)
        playInCorrect()
      }
    } else if (currentQuestionIndex === 2) {
      if (slider1Value === 5 && slider2Value === 2) {
        setIsButtonActive(false)
        setIsButtonInActive(true)
        setIsTryNewActive(true)

        playCorrect()
        setShowIncorrectText(false)
        setShowCorrectText(true)
      } else {
        setShowIncorrectText(true)
        playInCorrect()
      }
    } else if (currentQuestionIndex === 3) {
      if (slider1Value === 3 && slider2Value === 1) {
        setIsButtonActive(false)
        setIsButtonInActive(true)
        setIsTryNewActive(true)

        playCorrect()
        setShowIncorrectText(false)
        setShowCorrectText(true)
      } else {
        setShowIncorrectText(true)
        playInCorrect()
      }
    } else if (currentQuestionIndex === 4) {
      if (slider1Value === 3 && slider2Value === 2) {
        setIsButtonActive(false)
        setIsButtonInActive(true)
        setIsTryNewActive(true)

        playCorrect()
        setShowCorrectText(true)
      } else {
        setShowIncorrectText(true)
        playInCorrect()
      }
    } else if (currentQuestionIndex === 5) {
      if (slider1Value === 2 && slider2Value === 1) {
        setIsButtonActive(false)
        setIsButtonInActive(true)
        setIsTryNewActive(true)

        playCorrect()
        setShowCorrectText(true)
      } else {
        setShowIncorrectText(true)
        playInCorrect()
      }
    }
  }

  const handleTryNewButtonClick = () => {
    playMouseClick()
    const nextQuestionIndex = (currentQuestionIndex + 1) % questions.length
    setCurrentPage(1)
    setSlider1Value(0)
    setSlider2Value(0)
    setCurrentQuestionIndex(nextQuestionIndex)
    setIsTryNewActive(false)
    setIsButtonActive(true)
    setIsButtonActive(false)
    setIsButtonInActive(true)
    setShowCorrectText(false)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g03-aa01-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Representing fractions on the number line"
        backgroundColor="#F6F6F6"
        hideButton={true}
        buttonColor="#1A1A1A"
      />
      {currentPage === 0 && (
        <div>
          <StartTryNewButton src={StartBut} onClick={handleStartButtonClick} />
          <PageBG src={Page0Background} />
          <OnboardingAnimationContainer left={290} top={690} src={click} loop autoplay />
        </div>
      )}

      {currentPage === 1 && showNormalText && <Texts src={Page1NT} />}
      {currentPage === 1 && showCorrectText && <Texts src={Page1CT} />}
      {currentPage === 1 && showIncorrectText && <Texts src={Page1IT} />}
      {currentPage === 1 && questions[currentQuestionIndex]}
      {currentPage === 1 && (
        <div>
          <Slider
            label={'Denominator'}
            min={1}
            max={10}
            left={30}
            defaultValue={1}
            value={slider1Value}
            onChange={handleSlider1Change}
            step={1}
          />
          <Slider
            label={'Numerator'}
            min={0}
            max={10}
            left={380}
            defaultValue={0}
            value={slider2Value}
            onChange={handleSlider2Change}
            step={1}
          />
          <PageBG src={Page1Background} />
          <NumerLineIMG src={NL} />

          <LineContainer>{grids}</LineContainer>
          {isButtonActive && (
            <CheckButtonActive src={CheckActive} onClick={handleCheckButtonClick} />
          )}

          {isButtonInActive && <CheckButtonInactive src={CheckInactive} />}
          {isTryNewActive && <StartTryNewButton src={TryNewB} onClick={handleTryNewButtonClick} />}
          {showOnboarding1 && (
            <OnboardingAnimationContainer left={-150} top={640} src={clickAndDrag} loop autoplay />
          )}
        </div>
      )}
    </AppletContainer>
  )
}
