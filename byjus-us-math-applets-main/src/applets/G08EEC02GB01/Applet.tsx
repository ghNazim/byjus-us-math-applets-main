import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FrogJump } from '@/atoms/FrogJump'
import { FrogJumpRef } from '@/atoms/FrogJump/FrogJump.types'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import ClickAnimation from '../../common/handAnimations/click.json'
import CoinImg from './assets/coin.svg'
import ResetIcon from './assets/Retry.svg'
import ButtonHolder from './components/ButtonHolder'
import { Dropdown } from './components/Select'

const answerStateColors = {
  default: '#81B3FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  disable: '#c7c7c7',
}

const problem1InitialFrogPlayerPosition = {
  left: 307,
  top: 240,
}

const JumpDistanceToRight = 225

const DropdownHolder = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${(prop) => prop.top}px;
  left: ${(prop) => prop.left}px;
`

const StyledGeogebra = styled(Geogebra)`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 500px;
  position: absolute;
  top: 105px;
  scale: 1.05;
`

const BottomTextDiv = styled.div`
  width: 100%;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  position: absolute;
  bottom: 180px;
  padding: 0 50px;
`

const NextBtnHolder = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const NextBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  font-size: 20px;
  width: 102px;
  height: 60px;
  background: #8c69ff;
  border-radius: 10px;
  color: white;
  cursor: pointer;
`

const SolutionExplanationDiv = styled.div<{ top: number; left: number; opacity: number }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: ${(prop) => prop.top}px;
  left: ${(prop) => prop.left}px;
  font-size: 20px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  align-items: center;
  opacity: ${(prop) => prop.opacity};
  justify-content: center;
`
const EquationBlocks = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  text-align: center;
`
const TryNewBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  gap: 12px;
  width: 178px;
  height: 60px;
  border: none;
  background: #8c69ff;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  cursor: pointer;
`

const ColoredSpan = styled.span<{ backgroundColor: string; color: string }>`
  color: ${(a) => a.color};
  background-color: ${(a) => a.backgroundColor};
  padding: 0 5px;
  margin: 0 5px;
  border-radius: 3px;
`

const CoinHolder = styled.img`
  position: absolute;
  left: 570px;
  top: 300px;
  pointer-events: none;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  width: 100px;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`

const FrogContainer = styled.div`
  position: absolute;
  top: ${problem1InitialFrogPlayerPosition.top + 10}px;
  left: ${problem1InitialFrogPlayerPosition.left}px;
`

const Frog = styled(FrogJump)`
  position: absolute;
  scale: 0.7;
  /* width: 80px; */
  /* left: ${problem1InitialFrogPlayerPosition.left}px; */
  /* top: ${problem1InitialFrogPlayerPosition.top}px; */
`

const bottomTexts = {
  firstQuestion: <> Choose the right operation for the frog to hop from 8 to 14</>,
  correctButtonChosen: <>Awesome! Choose the number of hops to grab the coin.</>,
  wrongButtonChosen: (
    <>Oops! The selected operation won&apos;t get our froggy to the coin. Give another try.</>
  ),
  wrongDropDownChosen: (
    <>
      Oops! The frog didn&apos;t quite make it.
      <br /> Give it another try.
    </>
  ),
  afterAnimation: <>Great job! The frog made the perfect number of jumps and collected the coin.</>,
  afterAnimationWhenComingBack: (
    <>
      Great job! The frog made the perfect number of jumps and reached back to the starting point.
    </>
  ),
  secondQuestion: <>Choose the right operation for the frog to hop from 14 to 8.</>,
  comingBackCorrectOption: (
    <>Nice! Choose the number of hops to guide froggy back to the starting point.</>
  ),
  finalDisclaimer: (
    <>
      Fantastic! You&apos;ve just discovered that <br /> subtraction is the inverse of addition.
    </>
  ),
}

export const AppletG08EEC02GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [currentQuestionState, setCurrentQuestionState] = useState<'addition' | 'subtraction'>(
    'addition',
  )

  const [dropdownState, setDropdownState] = useState<keyof typeof answerStateColors>('default')
  const [selectedDropdownNumber, setSelectedDropdownNumber] = useState(0)
  const [showDropdownMenu, setShowDropdownMenu] = useState(false)
  const [frogAnimationplaying, setFrogAnimationplaying] = useState(false)
  const [ggbReady, setGgbReady] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [bottomText, setBottomtext] = useState(bottomTexts.firstQuestion)
  const [showNextBtn, setShowNextBtn] = useState(false)
  const [showProblem1Solution, setShowProblem1Solution] = useState(false)
  const [showProblem2Solution, setShowProblem2Solution] = useState(false)
  const [solution1TextOpacity, setSolution1TextOpacity] = useState(1)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [showSecondOnboarding, setShowSecondOnboarding] = useState(false)
  const FrogJumpRef = useRef<FrogJumpRef>(null)
  const [frogJumIndex, setFrogJumpIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timer>()

  const handleresetBtn = () => {
    ggbApi.current?.setValue('a', 8)
    ggbApi.current?.setValue('b', -14)
    setShowProblem1Solution(false)
    setShowProblem2Solution(false)
    setBottomtext(bottomTexts.firstQuestion)
    setGgbReady(true)
    setFrogAnimationplaying(false)
    setCurrentQuestionState('addition')
    setSelectedDropdownNumber(0)
    setShowOnboarding(true)
  }

  const handleSelection = (isCorrentOptionSelected: boolean) => {
    if (isCorrentOptionSelected) {
      setShowOnboarding(false)

      ggbApi.current?.setVisible('Red', false)
      ggbApi.current?.setValue('a', 8)

      if (currentQuestionState === 'subtraction') {
        setBottomtext(bottomTexts.comingBackCorrectOption)
        ggbApi.current?.setValue('a', 14)
        ggbApi.current?.setVisible('q', true)
        ggbApi.current?.setValue('b', -14)
      } else {
        setBottomtext(bottomTexts.correctButtonChosen)
        setShowSecondOnboarding(true)
        ggbApi.current?.setVisible('p', true)
      }

      setShowDropdownMenu(true)
    } else {
      ggbApi.current?.setVisible('Red', true)
      setBottomtext(bottomTexts.wrongButtonChosen)
      if (currentQuestionState === 'addition') {
        ggbApi.current?.setValue('a', 4)
      } else {
        ggbApi.current?.setValue('b', -15)
      }
    }
  }

  useEffect(() => {
    if (currentQuestionState === 'subtraction') {
      setSelectedDropdownNumber(0)
      setDropdownState('default')
    }
  }, [currentQuestionState])

  useEffect(() => {
    let animationTimeOut: NodeJS.Timeout
    //to turn off the animation once it's completed
    // eslint-disable-next-line prefer-const
    animationTimeOut = setTimeout(() => {
      if (showDropdownMenu) {
        setShowDropdownMenu(false)
      }
    }, 1000)
    return () => clearTimeout(animationTimeOut)
  }, [frogAnimationplaying])

  const onApiReady = useCallback((api: any) => {
    ggbApi.current = api
    if (api) setGgbReady(true)
    ggbApi.current?.setVisible('a', false)
    ggbApi.current?.setVisible('b', false)
  }, [])

  useEffect(() => {
    ggbApi.current?.setVisible('Green', true)
  }, [ggbReady])

  const handleValueChange = (e: number) => {
    setSelectedDropdownNumber(e)
    if (currentQuestionState === 'addition') ggbApi.current?.setValue('a', 8 + e)
    else ggbApi.current?.setValue('b', -14 + e)
  }

  useEffect(() => {
    if (selectedDropdownNumber === 6) {
      currentQuestionState === 'addition' ? setFrogJumpIndex(1) : setFrogJumpIndex(5)
      setSolution1TextOpacity((prev) => (prev === 0.3 ? 1 : prev))
      ggbApi.current?.setVisible('Green', true)
      ggbApi.current?.setVisible('Red', false)
      currentQuestionState === 'addition'
        ? setBottomtext(bottomTexts.afterAnimation)
        : setBottomtext(bottomTexts.afterAnimationWhenComingBack)
      setDropdownState('right')

      if (currentQuestionState === 'addition') {
        intervalRef.current = setInterval(() => {
          setFrogJumpIndex((prev) => {
            if (prev >= 6) {
              setShowProblem1Solution(true)
              setShowNextBtn(true)
              clearInterval(intervalRef.current)
              return prev
            }
            return prev + 1
          })
        }, 1500)
      } else {
        intervalRef.current = setInterval(() => {
          setFrogJumpIndex((prev) => {
            if (prev === 0) {
              setShowProblem2Solution(true)
              setBottomtext(bottomTexts.finalDisclaimer)
              clearInterval(intervalRef.current)
              return prev
            }
            return prev - 1
          })
        }, 1500)
      }

      setFrogAnimationplaying(true)
      currentQuestionState === 'addition' ? ggbApi.current?.setVisible('p', false) : undefined
      ggbApi.current?.setVisible('q', false)
    } else if (selectedDropdownNumber !== 0) {
      setBottomtext(bottomTexts.wrongDropDownChosen)
      ggbApi.current?.setVisible('Red', true)
      setDropdownState('wrong')
    }

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [selectedDropdownNumber])

  useEffect(() => {
    FrogJumpRef.current?.jumpTo(
      currentQuestionState === 'addition'
        ? { left: (frogJumIndex * JumpDistanceToRight) / 6, top: 0 }
        : { left: (frogJumIndex * JumpDistanceToRight) / 6, top: 0 },
    )
  }, [frogJumIndex])

  const handleNextBtn = () => {
    setSolution1TextOpacity(0.3)
    setCurrentQuestionState('subtraction')
    setFrogAnimationplaying(false)
    setShowNextBtn(false)
    setBottomtext(bottomTexts.secondQuestion)
    // ggbApi.current?.setVisible('q', true)
    ggbApi.current?.setVisible('p', false)
    setSelectedDropdownNumber(0)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: 'g08-eec02-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Guide the frog on the number line to collect coins"
        backgroundColor="#F1EDFF"
        buttonColor="#8C69FF"
      />

      <StyledGeogebra onApiReady={onApiReady} materialId="p4htm8ff" width={600} height={500} />

      {ggbReady && (
        <>
          <div style={{ position: 'absolute', left: '343px', top: '340px' }}>
            <ColoredSpan
              color="white"
              backgroundColor={currentQuestionState === 'addition' ? '#888' : '#32a66c'}
            >
              8
            </ColoredSpan>
          </div>
          <div style={{ position: 'absolute', left: '566px', top: '340px' }}>
            <ColoredSpan
              color="white"
              backgroundColor={currentQuestionState === 'addition' ? '#32a66c' : '#888'}
            >
              14
            </ColoredSpan>
          </div>

          <FrogContainer>
            <Frog ref={FrogJumpRef} height={10} />
          </FrogContainer>

          {!frogAnimationplaying && (
            <>
              <div
                style={{
                  position: 'absolute',
                  bottom: '50px',
                  display: 'flex',
                  width: '100%',
                }}
              >
                <ButtonHolder
                  correctButtonIndex={currentQuestionState === 'addition' ? 1 : 2}
                  isCorrectOptionSelected={handleSelection}
                />
              </div>
            </>
          )}

          {!showProblem1Solution && <CoinHolder src={CoinImg} />}
          {showDropdownMenu && (
            <DropdownHolder left={450} top={currentQuestionState === 'addition' ? 150 : 450}>
              <Dropdown
                options={[4, 5, 6, 7]}
                onValueChange={handleValueChange}
                state={dropdownState}
                onBoardAnimCheck={false}
                onclick={() => setShowSecondOnboarding(false)}
              />
            </DropdownHolder>
          )}
          {showSecondOnboarding && (
            <OnboardingAnimationContainer src={ClickAnimation} left={450} top={140} autoplay loop />
          )}
          <BottomTextDiv>{bottomText}</BottomTextDiv>
          {showNextBtn && (
            <NextBtnHolder>
              <NextBtn onClick={handleNextBtn}>Next</NextBtn>
            </NextBtnHolder>
          )}
          {showProblem1Solution && (
            <SolutionExplanationDiv top={152} left={420} opacity={solution1TextOpacity}>
              On adding 6
              <EquationBlocks>
                8{' '}
                <ColoredSpan color="white" backgroundColor="#32a66c">
                  + 6
                </ColoredSpan>{' '}
                = 14
              </EquationBlocks>
            </SolutionExplanationDiv>
          )}
          {showProblem2Solution && (
            <SolutionExplanationDiv top={452} left={400} opacity={1}>
              On subtracting 6
              <EquationBlocks>
                14{' '}
                <ColoredSpan color="white" backgroundColor="#32a66c">
                  - 6
                </ColoredSpan>{' '}
                = 8
              </EquationBlocks>
            </SolutionExplanationDiv>
          )}
          {showProblem1Solution && showProblem2Solution && (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                bottom: '50px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TryNewBtn onClick={handleresetBtn}>
                <img src={ResetIcon} /> Reset
              </TryNewBtn>
            </div>
          )}
          {showOnboarding && (
            <OnboardingAnimationContainer left={180} top={670} src={ClickAnimation} loop autoplay />
          )}
        </>
      )}
    </AppletContainer>
  )
}
