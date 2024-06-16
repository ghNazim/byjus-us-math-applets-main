import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { click } from '@/assets/onboarding'
import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { Math } from '@/common/Math'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ConvertButton from './assets/ConvertBut.svg'
import NextActiveIMG from './assets/NexActive.svg'
import NextInactiveIMG from './assets/NexInactive.svg'
import Page0Background from './assets/Page0BG.svg'
import Page1Background from './assets/Page1BG.svg'
import Page1Q1FigureIMG from './assets/Page1Figure.svg'
import Page1NT from './assets/Page1NormalText.svg'
import Page1Q2FigureIMG from './assets/Page1Q2FigureImg.svg'
import Page2FigureIMG from './assets/Page2Figure.svg'
import Page2Q1NT from './assets/page2Q1.svg'
import Page2Q2NT from './assets/page2Q2.svg'
import Page2Q2FigureIMG from './assets/Page2Q2FigureImg.svg'
import Page3Q1FigureIMG1 from './assets/Page3Fig1.svg'
import Page3Q1FigureIMG2 from './assets/Page3Fig2.svg'
import Page3Q1FigureIMGFinal from './assets/Page3FinalImage.svg'
import Page3NT from './assets/Page3NT.svg'
import Page3Q2FigureIMG1 from './assets/Page3Q2Fig1.svg'
import Page3Q2FigureIMG2 from './assets/Page3Q2Fig2.svg'
import Page3Q2FigureIMGFinal from './assets/Page3Q2FinalImage.svg'
import Page4NCTextQ1 from './assets/Page4CT.svg'
import Page4NCTextQ2 from './assets/Page4CTQ2.svg'
import Page4CTextQ1 from './assets/Page4ICT.svg'
import Page4CTextQ2 from './assets/Page4ICTQ2.svg'
// import Page4Q1EQ from './assets/Page4Q1Equation.svg'
import Page4Q1NT from './assets/Page4Q1NormalText.svg'
// import Page4Q2EQ from './assets/Page4Q2Equation.svg'
import Page4Q2NT from './assets/Page4Q2NormalText.svg'
import reset from './assets/reset.svg'
import StartButton from './assets/StartButton.svg'
import TryNewB from './assets/TryNewBut.svg'

const PageBG = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 90px;
  z-index: 0;
`

const PageFigure = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 250px;
  z-index: 1;
`

const PageFigureImg1 = styled.img`
  position: absolute;
  left: -0%;
  translate: -0%;
  top: 250px;
  z-index: 1;
`
const PageFigureImg2 = styled.img`
  position: absolute;
  left: 80%;
  translate: -80%;
  top: 250px;
  z-index: 1;
`
const Button = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 720px;
  z-index: 2;
  cursor: pointer;
`
const Texts = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 520px;
  z-index: 1;
`
const TextFTQ1 = styled.img`
  position: absolute;
  left: 40%;
  translate: -40%;
  top: 580px;
  z-index: 1;
`
const TextFTQ2 = styled.img`
  position: absolute;
  left: 18%;
  translate: -18%;
  top: 580px;
  z-index: 1;
`
const TextFTQ2CTICT = styled.img`
  position: absolute;
  left: 13%;
  translate: -13%;
  top: 550px;
  z-index: 1;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 2;
`

const PlacedSlider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 100px;
`
interface BottomCoordContainerProps {
  isIncorrectTextActive: boolean
  isCorrectTextActive: boolean
}
const BottomCoordContainer1 = styled.label<BottomCoordContainerProps>`
  position: absolute;
  top: 522px;
  left: ${({ isIncorrectTextActive, isCorrectTextActive }) =>
    isIncorrectTextActive ? '590px' : isCorrectTextActive ? '580px' : '540px'};
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: #444444;
  justify-content: center;
  flex-direction: row;
  width: 720px;
  height: 100px;
  z-index: 2;
`
const BottomCoordContainer2 = styled.label<BottomCoordContainerProps>`
  position: absolute;
  top: 602px;
  left: ${({ isIncorrectTextActive, isCorrectTextActive }) =>
    isIncorrectTextActive ? '590px' : isCorrectTextActive ? '580px' : '540px'};
  font-family: 'Nunito';
  font-style: normal;
  border-radius: 10px;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: #444444;
  justify-content: center;
  flex-direction: row;
  width: 720px;
  height: 100px;
  z-index: 2;
`

const AnswerInputBorder1 = styled.button<{
  isWrong?: boolean
  isCorrect?: boolean
  default?: boolean
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 8px 8px 8px;
  gap: 45px;
  border-color: ${({ isWrong, isCorrect }) =>
    isWrong ? '#CC6666' : isCorrect ? '#A3C774' : '#1a1a1a'};
  background: ${({ isWrong, isCorrect }) =>
    isWrong ? '#FFF2F2' : isCorrect ? '#ECFFD9' : '#ffffff'};
  border-radius: 20px;
  width: 76px;
  height: 60px;
  margin-bottom: 10px;

  &:disabled {
    pointer-events: none;
    background-color: #77777730;
    border: 3px solid #777777;
  }

  &:focus {
    outline: none;
  }
  z-index: 1;
`

const AnswerInputBorder2 = styled.button<{
  isWrong?: boolean
  isCorrect?: boolean
  default?: boolean
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 8px 8px 8px;
  gap: 45px;
  border-color: ${({ isWrong, isCorrect }) =>
    isWrong ? '#CC6666' : isCorrect ? '#A3C774' : '#1a1a1a'};
  background: ${({ isWrong, isCorrect }) =>
    isWrong ? '#FFF2F2' : isCorrect ? '#ECFFD9' : '#ffffff'};
  border-radius: 20px;
  width: 76px;
  height: 60px;
  margin-bottom: 10px;

  &:disabled {
    pointer-events: none;
    background-color: #77777730;
    border: 3px solid #777777;
  }

  &:focus {
    outline: none;
  }
  z-index: 1;
`

const AnswerInput = styled.input`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 34px;

  color: #444444;
  background-color: transparent;
  border: 0;
  max-width: 50px;
  text-align: center; /* Center the text horizontally */
  margin: auto; /* Center the text horizontally */
  &:focus {
    outline: 0;
  }

  z-index: 2;
`
const CheckButton = styled.button<{ hasValue: boolean }>`
  position: absolute;
  top: 720px;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  width: 116px;
  height: 60px;
  background: ${({ hasValue }) => (hasValue ? '#1A1A1A' : '#777777')};
  border-radius: 10px;

  flex: none;
  order: 0;
  flex-grow: 0;
  opacity: ${({ hasValue }) => (hasValue ? '1' : '0.2')};
  transition: background-color 0.3s, opacity 0.3s;

  color: #ffffff;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 34px;
  cursor: ${({ hasValue }) => (hasValue ? 'pointer' : 'default')};

  &:focus {
    outline: none;
  }
  z-index: 2;
`

export const AppletG03AA03GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [isCheckButtonActive, setIsCheckButtonActive] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const [showNormalText, setShowNormalText] = useState(false)
  const playCorrect = useSFX('correct')
  const playInCorrect = useSFX('incorrect')
  const playMouseClick = useSFX('mouseClick')
  const [pageFigureOpacity, setPageFigureOpacity] = useState(0)

  const [sliderValue, setSliderValue] = useState(0)
  const [maxSliderValue, setMaxSliderValue] = useState(false)
  const [finalImageOpacity, setFinalImageOpacity] = useState(0)
  const [isAnswerWrong, setIsAnswerWrong] = useState(false)
  const [isAnswerRight, setIsAnswerRight] = useState(false)
  const [inputValue1, setInputValue1] = useState<number | undefined>(undefined)
  const [inputValue2, setInputValue2] = useState<number | undefined>(undefined)

  const initialLeft1 = 20
  const initialLeft2 = 90

  const [left1, setLeft1] = useState(initialLeft1)
  const [left2, setLeft2] = useState(initialLeft2)

  const handleStartButtonClick = () => {
    playMouseClick()

    if (currentPage === 0) {
      setCurrentPage(1)
      setShowNormalText(true)
    }

    if (currentPage === 1) {
      setCurrentPage(2)
      const fadeDuration = 1200
      const fadeStep = 20

      const interval = setInterval(() => {
        setPageFigureOpacity((prevOpacity) => {
          if (prevOpacity >= 1) {
            clearInterval(interval)
            return 1
          }
          return prevOpacity + fadeStep / fadeDuration
        })
      }, fadeStep)
    }

    if (currentPage === 2) {
      setCurrentPage(3)
    }
    if (currentPage === 3) {
      setCurrentPage(4)
    }
  }

  const handleInput1Click = () => {
    // Reset relevant states when the input is clicked
    setShowNormalText(true)
    setIsAnswerWrong(false)
    setIsAnswerRight(false)
  }

  const handleInput2Click = () => {
    // Reset relevant states when the input is clicked
    setShowNormalText(true)
    setIsAnswerWrong(false)
    setIsAnswerRight(false)
  }

  const questions = [
    //New1
    <div
      key={1}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '-90px',

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
        Hip hop dancers =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
          <Math>{String.raw`
      \frac{${1}}{${3}}
    `}</Math>
        </div>
      </div>
      <div
        key={1}
        style={{
          position: 'absolute',
          width: '500px',
          height: '28px',
          top: '0px',
          left: '350px',

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
          Disco dancers =
          <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
            <Math>{String.raw`
      \frac{${1}}{${2}}
    `}</Math>
          </div>
        </div>
      </div>
    </div>,
    //New2
    <div
      key={1}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '-90px',

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
        Hip hop dancers =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
          <Math>{String.raw`
    \frac{1 \times 2}{3 \times 2}
    `}</Math>
        </div>
      </div>
      <div
        key={1}
        style={{
          position: 'absolute',
          width: '500px',
          height: '28px',
          top: '0px',
          left: '350px',

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
          Disco dancers =
          <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
            <Math>{String.raw`
     \frac{1 \times 3}{2 \times 3}
    `}</Math>
          </div>
        </div>
      </div>
    </div>,
    <div
      key={1}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '-90px',

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
        Hip hop dancers =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
          <Math>{String.raw`
     \frac{${2}}{${6}}
   `}</Math>
        </div>
      </div>
      <div
        key={1}
        style={{
          position: 'absolute',
          width: '500px',
          height: '28px',
          top: '0px',
          left: '350px',

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
          Disco dancers =
          <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
            <Math>{String.raw`
     \frac{${3}}{${6}}
   `}</Math>
          </div>
        </div>
      </div>
    </div>,
    //New2
    <div
      key={3}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '-90px',

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
        Green lights =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
          <Math>{String.raw`
      \frac{${1}}{${4}}
    `}</Math>
        </div>
      </div>
      <div
        key={3}
        style={{
          position: 'absolute',
          width: '500px',
          height: '28px',
          top: '0px',
          left: '350px',

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
          Blue lights =
          <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
            <Math>{String.raw`
      \frac{${1}}{${2}}
    `}</Math>
          </div>
        </div>
      </div>
    </div>,
    //New3
    <div
      key={4}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '-90px',

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
        Green lights =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
          <Math>{String.raw`
   \frac{1 \times 1}{4 \times 1}
    `}</Math>
        </div>
      </div>
      <div
        key={4}
        style={{
          position: 'absolute',
          width: '500px',
          height: '28px',
          top: '0px',
          left: '350px',

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
          Blue lights =
          <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
            <Math>{String.raw`
     \frac{1 \times 2}{2 \times 2}
    `}</Math>
          </div>
        </div>
      </div>
    </div>,
    <div
      key={3}
      style={{
        position: 'absolute',
        width: '500px',
        height: '28px',
        top: '152px',
        left: '-90px',

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
        Green lights =
        <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
          <Math>{String.raw`
    \frac{${1}}{${4}}
  `}</Math>
        </div>
      </div>
      <div
        key={3}
        style={{
          position: 'absolute',
          width: '500px',
          height: '28px',
          top: '0px',
          left: '350px',

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
          Blue lights =
          <div style={{ position: 'absolute', fontSize: '28px', top: '0px', left: '350px' }}>
            <Math>{String.raw`
    \frac{${2}}{${4}}
  `}</Math>
          </div>
        </div>
      </div>
    </div>,
  ]

  const handleSlider1Change = (value: number) => {
    setSliderValue(value)
    if (value >= 95) {
      // When the slider is at its maximum value, hide both images.
      setLeft1(-200) // I am Set the position outside of the visible area
      setLeft2(500) //  I am Set the position outside of the visible area
      setMaxSliderValue(true)
    } else {
      const newLeft1 = initialLeft1 + (value * (initialLeft2 - initialLeft1)) / 265
      const newLeft2 = initialLeft2 - (value * (initialLeft2 - initialLeft1)) / 290

      setLeft1(newLeft1)
      setLeft2(newLeft2)
      setMaxSliderValue(false)
    }
  }

  useEffect(() => {
    if (currentPage === 3 && maxSliderValue) {
      const fadeDuration = 500
      const fadeStep = 10

      const interval = setInterval(() => {
        setFinalImageOpacity((prevOpacity) => {
          if (prevOpacity >= 1) {
            clearInterval(interval)
            return 1
          }
          return prevOpacity + fadeStep / fadeDuration
        })
      }, fadeStep)
    } else {
      setFinalImageOpacity(0)
    }
  }, [currentPage, maxSliderValue])

  const onCheckClick = () => {
    playMouseClick()
    if (currentQuestionIndex == 0) {
      if (inputValue1 == 5 && inputValue2 == 6) {
        setIsAnswerRight(true)
        setIsAnswerWrong(false) // Ensure that isAnswerWrong is set to false when the answer is correct
        setIsCheckButtonActive(false)
        setShowNormalText(false)
        playCorrect()
      } else {
        setIsAnswerRight(false) // Ensure that isAnswerRight is set to false when the answer is wrong
        setIsAnswerWrong(true)
        setShowNormalText(false)
        playInCorrect()
      }
    }

    if (currentQuestionIndex == 1) {
      if (inputValue1 == 3 && inputValue2 == 4) {
        setIsAnswerRight(true)
        setIsAnswerWrong(false) // Ensure that isAnswerWrong is set to false when the answer is correct
        setIsCheckButtonActive(false)
        setShowNormalText(false)
        playCorrect()
      } else {
        setIsAnswerRight(false) // Ensure that isAnswerRight is set to false when the answer is wrong
        setIsAnswerWrong(true)
        setShowNormalText(false)
        playInCorrect()
      }
    }
  }

  const handleTryNewButtonClick = () => {
    playMouseClick()
    setCurrentPage(0)
    const nextQuestionIndex = (currentQuestionIndex + 1) % questions.length
    setCurrentQuestionIndex(nextQuestionIndex)
    setInputValue1(undefined)
    setInputValue2(undefined)
    setIsAnswerRight(false)
    setIsCheckButtonActive(true)
    setPageFigureOpacity(0)
    setMaxSliderValue(false)
    if (currentQuestionIndex === 1) {
      setCurrentQuestionIndex(0)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g03-aa03-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Adding fractions using visualization"
        backgroundColor="#F6F6F6"
        hideButton={true}
        buttonColor="#1A1A1A"
      />
      {currentPage === 0 && (
        <div>
          <Button src={StartButton} onClick={handleStartButtonClick} />
          <PageBG src={Page0Background} />
          <OnboardingAnimationContainer left={290} top={690} src={click} loop autoplay />
        </div>
      )}

      {currentPage === 1 && showNormalText && <Texts src={Page1NT} />}
      {currentPage === 1 && <PageBG src={Page1Background} />}
      {currentPage === 1 && <Button src={ConvertButton} onClick={handleStartButtonClick} />}

      {currentPage === 1 && currentQuestionIndex === 0 && <PageFigure src={Page1Q1FigureIMG} />}
      {currentPage === 1 && currentQuestionIndex === 1 && <PageFigure src={Page1Q2FigureIMG} />}

      {currentPage === 1 && currentQuestionIndex === 0 && questions[0]}
      {currentPage === 2 && currentQuestionIndex === 0 && questions[1]}

      {currentPage === 3 && currentQuestionIndex === 0 && questions[2]}
      {currentPage === 4 && currentQuestionIndex === 0 && questions[2]}

      {currentPage === 1 && currentQuestionIndex === 1 && questions[3]}
      {currentPage === 2 && currentQuestionIndex === 1 && questions[4]}

      {currentPage === 3 && currentQuestionIndex === 1 && questions[5]}
      {currentPage === 4 && currentQuestionIndex === 1 && questions[5]}

      {currentPage === 2 && currentQuestionIndex == 0 && (
        <div>
          <PageBG src={Page1Background} />
          <PageFigure src={Page1Q1FigureIMG} />
          <div style={{ position: 'relative' }}>
            <PageFigure
              src={Page2FigureIMG}
              style={{
                opacity: pageFigureOpacity,
              }}
            />

            {pageFigureOpacity === 1 && (
              <div>
                <Button src={NextActiveIMG} onClick={handleStartButtonClick} />
                {showNormalText && <Texts src={Page2Q1NT} />}
              </div>
            )}
          </div>
        </div>
      )}

      {currentPage === 2 && currentQuestionIndex == 1 && (
        <div>
          <PageBG src={Page1Background} />
          <PageFigure src={Page1Q2FigureIMG} />
          <div style={{ position: 'relative' }}>
            <PageFigure
              src={Page2Q2FigureIMG}
              style={{
                opacity: pageFigureOpacity,
              }}
            />

            {pageFigureOpacity === 1 && (
              <div>
                <Button src={NextActiveIMG} onClick={handleStartButtonClick} />
                {showNormalText && <Texts src={Page2Q2NT} />}
              </div>
            )}
          </div>
        </div>
      )}

      {currentPage === 3 && <PageBG src={Page1Background} />}

      {currentPage === 3 && currentQuestionIndex == 0 && (
        <div style={{ position: 'relative' }}>
          <PageFigureImg1
            src={Page3Q1FigureIMG1}
            style={{
              left: `${left1}%`,
              transform: 'translateX(-26%)',
              top: '250px',
              zIndex: 1,
            }}
          />
          <PageFigureImg2
            src={Page3Q1FigureIMG2}
            style={{
              left: `${left2}%`,
              transform: 'translateX(-35%)',
              top: '250px',
              zIndex: 1,
              opacity: left2 < 69 ? 0.4 : left2 < 74 ? 0.7 : 1,
            }}
          />

          {maxSliderValue && (
            <img
              src={Page3Q1FigureIMGFinal}
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                top: '250px',
                zIndex: 1,
                opacity: finalImageOpacity,
              }}
            />
          )}
        </div>
      )}

      {currentPage === 3 && currentQuestionIndex == 1 && (
        <div style={{ position: 'relative' }}>
          <PageFigureImg1
            src={Page3Q2FigureIMG1}
            style={{
              left: `${left1}%`,
              transform: 'translateX(-26%)',
              top: '250px',
              zIndex: 1,
            }}
          />
          <PageFigureImg2
            src={Page3Q2FigureIMG2}
            style={{
              left: `${left2}%`,
              transform: 'translateX(-35%)',
              top: '250px',
              opacity: left2 < 69 ? 0.4 : left2 < 74 ? 0.7 : 1,
              zIndex: 1,
            }}
          />

          {maxSliderValue && (
            <img
              src={Page3Q2FigureIMGFinal}
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                top: '250px',
                zIndex: 1,
                opacity: finalImageOpacity,
              }}
            />
          )}
        </div>
      )}

      {currentPage === 3 && (
        <div>
          <PlacedSlider onChangePercent={handleSlider1Change} />
          <Button src={NextInactiveIMG} />
          {maxSliderValue && <Button src={NextActiveIMG} onClick={handleStartButtonClick} />}
        </div>
      )}

      {currentPage === 3 && showNormalText && <Texts src={Page3NT} />}

      {currentPage === 4 && <PageBG src={Page1Background} />}
      {currentPage === 4 && currentQuestionIndex == 0 && <PageFigure src={Page3Q1FigureIMGFinal} />}
      {currentPage === 4 && currentQuestionIndex == 1 && <PageFigure src={Page3Q2FigureIMGFinal} />}

      {currentPage === 4 && showNormalText && currentQuestionIndex == 0 && (
        <TextFTQ1 src={Page4Q1NT} />
      )}

      {currentPage === 4 && showNormalText && currentQuestionIndex == 1 && (
        <TextFTQ2 src={Page4Q2NT} />
      )}

      {/* {currentPage === 4 && currentQuestionIndex == 0 && (
        <Texts src={Page4Q1EQ} style={{ top: '585px' }} />
      )} */}

      {/* {currentPage === 4 && currentQuestionIndex == 1 && (
        <Texts src={Page4Q2EQ} style={{ top: '602px', left: '48%', translate: '-48%' }} />
      )} */}

      {currentPage === 4 && isAnswerRight && currentQuestionIndex === 0 && (
        <TextFTQ1 src={Page4NCTextQ1} />
      )}
      {currentPage === 4 && isAnswerWrong && currentQuestionIndex === 0 && (
        <TextFTQ1 src={Page4CTextQ1} />
      )}
      {currentPage === 4 && isAnswerRight && currentQuestionIndex === 1 && (
        <TextFTQ2CTICT src={Page4NCTextQ2} />
      )}
      {currentPage === 4 && isAnswerWrong && currentQuestionIndex === 1 && (
        <TextFTQ2CTICT src={Page4CTextQ2} />
      )}

      {currentPage === 4 && (
        <BottomCoordContainer1
          isIncorrectTextActive={isAnswerWrong}
          isCorrectTextActive={isAnswerRight}
        >
          <AnswerInputBorder1 isWrong={isAnswerWrong} isCorrect={isAnswerRight}>
            <AnswerInput
              value={inputValue1 ?? ''}
              onChange={(e: any) => {
                if ((e.target.value < 1000 && e.target.value > -1000) || e.target.value === '') {
                  setInputValue1(e.target.value)
                  setIsAnswerWrong(false)
                }
              }}
              onClick={handleInput1Click} // Add onClick handler
            />
          </AnswerInputBorder1>
        </BottomCoordContainer1>
      )}

      {currentPage === 4 && (
        <BottomCoordContainer2
          isIncorrectTextActive={isAnswerWrong}
          isCorrectTextActive={isAnswerRight}
        >
          <AnswerInputBorder2 isWrong={isAnswerWrong} isCorrect={isAnswerRight}>
            <AnswerInput
              value={inputValue2 ?? ''}
              onChange={(e: any) => {
                if ((e.target.value < 1000 && e.target.value > -1000) || e.target.value === '') {
                  setIsAnswerWrong(false)
                  setInputValue2(e.target.value)
                }
              }}
              onClick={handleInput2Click} // Add onClick handler
            />
          </AnswerInputBorder2>
        </BottomCoordContainer2>
      )}

      {currentPage === 4 && isCheckButtonActive && (
        <CheckButton
          hasValue={inputValue1 !== undefined || inputValue2 !== undefined}
          onClick={onCheckClick}
          disabled={inputValue1 === undefined || inputValue2 === undefined}
        >
          Check
        </CheckButton>
      )}
      {currentPage === 4 && isAnswerRight && (
        <Button
          src={currentQuestionIndex == 0 ? TryNewB : reset}
          onClick={handleTryNewButtonClick}
        />
      )}
    </AppletContainer>
  )
}
