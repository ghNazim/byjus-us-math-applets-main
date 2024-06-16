import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FrogJump } from '@/atoms/FrogJump'
import { FrogJumpRef } from '@/atoms/FrogJump/FrogJump.types'
import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { StepInput } from '@/molecules/StepInput'

import ClickAnimation from '../../common/handAnimations/click.json'
import ButtonHolder from './components/BottonHolder'
import CoinImg from './images/coin.svg'
import ResetIcon from './images/tryNewSymb.svg'

const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  width: 100px;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
const problem1InitialFrogPlayerPosition = {
  left: 50,
  top: 277,
}

const JumpDistanceToRight = 270

const FrogContainer = styled.div`
  position: absolute;
  top: ${problem1InitialFrogPlayerPosition.top}px;
  left: ${problem1InitialFrogPlayerPosition.left}px;
`

const Frog = styled(FrogJump)`
  position: absolute;
  z-index: 1;
`
const BottomText = styled.div`
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
const NextButtonHolder1 = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const NextButtonStyle1 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  font-family: 'Nunito';
  font-style: normal;
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
  width: 106px;
  height: 60px;
  background: #8c69ff;
  border-radius: 10px;
  color: white;
  cursor: pointer;
`
const NextButtonHolder2 = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const NextButtonStyle2 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  font-family: 'Nunito';
  font-style: normal;
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
  width: 106px;
  height: 60px;
  background: #8c69ff;
  border-radius: 10px;
  color: white;
  cursor: pointer;
`
const JumpButtonHolder1 = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const JumpButtonStyle1 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  font-family: 'Nunito';
  font-style: normal;
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
  width: 106px;
  height: 60px;
  background: #8c69ff;
  border-radius: 10px;
  color: white;
  cursor: pointer;
`

const StepInputContainer = styled.div`
  position: absolute;
  bottom: 112px;
  margin: 0 32px;
  display: flex;
  gap: 28px;
  left: 220px;
  top: 650px;
  align-items: center;
  justify-content: center;
`

const ColoredSpan = styled.span<{ backgroundColor: string; color: string }>`
  color: ${(a) => a.color};
  background-color: ${(a) => a.backgroundColor};
  padding: 0 5px;
  margin: 0 5px;
  border-radius: 3px;
`
const CoinHolder1 = styled.img`
  position: absolute;
  left: 360px;
  top: 340px;
`
const CoinHolder2 = styled.img`
  position: absolute;
  left: 90px;
  top: 340px;
`
const TryNewButton = styled.button`
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
const bottomTexts = {
  firstQuestion: <>Choose the right operation for the frog to hop from 0 to 10.</>,
  correctButtonChosen: (
    <>
      Awesome!
      <br />
    </>
  ),
  StepperButtonState: (
    <>
      Choose the right number of hops and grab that coin
      <br />
    </>
  ),
  WrongStepperButtonState: (
    <>
      Oops! The frog didnt quite make it.
      <br /> Give it another try.
    </>
  ),
  RightStepperButtonState: (
    <>
      Great job! The frog made a perfect leap and collected the coin.
      <br />
    </>
  ),
  wrongButtonChosen: (
    <>Oops! The selected operation wont get our froggy to the coin. Give another try.</>
  ),
  wrongButtonChosenSecondQuestion: (
    <>
      Oops! The selected operation wont get our froggy to start point. <br />
      Give another try.
    </>
  ),

  secondQuestion: <>Choose the right operation for the frog to hop from 10 to 0.</>,
  comingBackCorrectOption: (
    <>
      Nice! Choose the perfect hop size to guide froggy <br /> back to the starting point.
    </>
  ),
  finalDisclaimer: (
    <>
      Fantastic! You&apos;ve just discovered that <br />
      Division is the inverse operation of Multiplication.
    </>
  ),
}
const DEFAULT_A = 1

export const AppletG08EEC02S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [index, setIndex] = useState(1)
  const [valueA, setValueA] = useState(DEFAULT_A)
  const [valueB, setValueB] = useState(DEFAULT_A)
  const [GGBLoaded1, setGGBLoaded1] = useState(false)
  const [GGBLoaded2, setGGBLoaded2] = useState(false)
  const ggb1 = useRef<GeogebraAppApi | null>(null)
  const ggb2 = useRef<GeogebraAppApi | null>(null)
  const [showNextButton1, setShowNextButton1] = useState(false)
  const [showResetButton, setShowResetButton] = useState(false)
  const [showJumpButton1, setShowJumpButton1] = useState(false)
  const [showButtonHolder1, setShowButtonHolder1] = useState(true)
  const [showStepperButtonHolder1, setShowStepperButtonHolder1] = useState(true)
  const [showProblem1Solution, setShowProblem1Solution] = useState(false)
  const [showProblem2Solution, setShowProblem2Solution] = useState(false)
  const [showNextButton2, setShowNextButton2] = useState(false)
  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const [bottomText, setBottomtext] = useState(bottomTexts.firstQuestion)
  const FrogJumpRef = useRef<FrogJumpRef>(null)
  const [frogAnimationplaying, setFrogAnimationplaying] = useState(false)
  const [currentQuestionState, setCurrentQuestionState] = useState<'multiplication' | 'division'>(
    'multiplication',
  )

  const onGGB1Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb1.current = api
    setGGBLoaded1(api != null)
  }, [])

  const onGGB2Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb2.current = api
    setGGBLoaded2(api != null)
  }, [])

  const handleSelection1 = (isCorrentOptionSelected: boolean) => {
    if (isCorrentOptionSelected) {
      setShowOnboarding1(false)
      setBottomtext(bottomTexts.correctButtonChosen)
      setShowNextButton1(true)
      ggb1.current?.setValue('Duplicate', 0)
      ggb1.current?.setValue('sQ1', 1)
    } else {
      setBottomtext(bottomTexts.wrongButtonChosen)
      ggb1.current?.setValue('Duplicate', 1)
      ggb1.current?.setVisible('pic81', false)
      ggb1.current?.setVisible('pic82', false)
    }
  }
  const handleSelection2 = (isCorrentOptionSelected: boolean) => {
    if (currentQuestionState == 'division' && isCorrentOptionSelected) {
      ggb2.current?.setValue('stage1', 3)
      setShowNextButton1(true)
    }
  }
  const handleNextButton1Multiplication = () => {
    setShowNextButton1(false)
    setShowButtonHolder1(false)
    setBottomtext(bottomTexts.StepperButtonState)
    setShowJumpButton1(true)
  }
  const handleNextButton1Divison = () => {
    setShowStepperButtonHolder1(true)
    setShowNextButton1(false)
  }

  const handleNextButton2Multiplication = () => {
    setShowNextButton2(false)
    setShowProblem1Solution(false)
    setIndex(0)
    setBottomtext(bottomTexts.secondQuestion)
    setCurrentQuestionState('division')
    setShowButtonHolder1(true)
    setShowProblem2Solution(true)
  }
  // const handleNextButton2Division = () => {
  //   setShowNextButton2(false)
  //   setShowProblem1Solution(false)
  //   setIndex(0)
  //   setBottomtext(bottomTexts.secondQuestion)
  //   setCurrentQuestionState('division')
  //   setShowButtonHolder1(true)
  // }

  const handleJumpBtn1 = () => {
    if (currentQuestionState === 'division') return
    if (ggb1.current?.getValue('s1') === 5) {
      FrogJumpRef.current?.jumpTo({ left: JumpDistanceToRight, top: 0 })
      setBottomtext(bottomTexts.RightStepperButtonState)
      setShowStepperButtonHolder1(false)
      setShowJumpButton1(false)
      setShowNextButton2(true)
      ggb1.current?.evalCommand('StartAnimation(CAT)')
      ggb1.current.setValue('sQ1', 0)
      setShowProblem1Solution(false)
    } else {
      setBottomtext(bottomTexts.WrongStepperButtonState)
      setShowJumpButton1(true)
      ggb1.current?.setVisible('pic60', true)
    }

    if (ggb1.current?.getValue('s1') === 1) {
      ggb1.current?.setValue('red', 1)
    }
    if (ggb1.current?.getValue('s1') === 2) {
      ggb1.current?.setValue('red', 2)
    }
    if (ggb1.current?.getValue('s1') === 3) {
      ggb1.current?.setValue('red', 3)
    }
    if (ggb1.current?.getValue('s1') === 4) {
      ggb1.current?.setValue('red', 4)
    }
    if (ggb1.current?.getValue('s1') === 6) {
      ggb1.current?.setValue('red', 5)
    }
    if (ggb1.current?.getValue('s1') === 7) {
      ggb1.current?.setValue('red', 6)
    }
  }

  const handleJumpBtn2 = () => {
    if (currentQuestionState === 'multiplication') return
    if (ggb2.current?.getValue('Stepper') === 5) {
      FrogJumpRef.current?.jumpTo({ left: 0, top: 0 })
      setBottomtext(bottomTexts.finalDisclaimer)
      setShowResetButton(true)
      ggb2.current?.evalCommand('StartAnimation(M)')
      ggb2.current.setValue('stage', 0)
      setShowJumpButton1(false)
      ggb2.current?.setFilling('pic24', 0)
      ggb2.current?.setFilling('pic26', 0)
      ggb2.current?.setFilling('pic27', 0)
      ggb2.current?.setFilling('pic28', 0)
      ggb2.current?.setFilling('pic29', 0)
      setShowStepperButtonHolder1(false)
    } else {
      setBottomtext(bottomTexts.wrongButtonChosenSecondQuestion)
    }

    if (ggb2.current?.getValue('Stepper') === 1) {
      ggb2.current?.setFilling('pic24', 1)
      ggb2.current?.setFilling('pic26', 1)
    }
    if (ggb2.current?.getValue('Stepper') === 2) {
      ggb2.current?.setFilling('pic24', 1)
      ggb2.current?.setFilling('pic26', 1)
      ggb2.current?.setFilling('pic27', 1)
    }
    if (ggb2.current?.getValue('Stepper') === 3) {
      ggb2.current?.setFilling('pic24', 1)
      ggb2.current?.setFilling('pic26', 1)
      ggb2.current?.setFilling('pic27', 1)
      ggb2.current?.setFilling('pic28', 1)
    }
    if (ggb2.current?.getValue('Stepper') === 4) {
      ggb2.current?.setFilling('pic24', 1)
      ggb2.current?.setFilling('pic26', 1)
      ggb2.current?.setFilling('pic27', 1)
      ggb2.current?.setFilling('pic28', 1)
      ggb2.current?.setFilling('pic29', 1)
    }
  }

  const onChangeStepperButton1 = (value: number) => {
    if (currentQuestionState == 'multiplication') {
      setValueA(value)
      if (ggb1.current?.getValue('s1') === 1) {
        ggb1.current?.setValue('red', 0)
      }
      if (ggb1.current?.getValue('s1') === 2) {
        ggb1.current?.setValue('red', 0)
      }
      if (ggb1.current?.getValue('s1') === 3) {
        ggb1.current?.setValue('red', 0)
      }
      if (ggb1.current?.getValue('s1') === 4) {
        ggb1.current?.setValue('red', 0)
      }
      if (ggb1.current?.getValue('s1') === 6) {
        ggb1.current?.setValue('red', 0)
      }
      if (ggb1.current?.getValue('s1') === 7) {
        ggb1.current?.setValue('red', 0)
      }
    }

    if (currentQuestionState == 'division') {
      setValueB(value)
      if (ggb2.current?.getValue('Stepper') === 1) {
        ggb2.current?.setFilling('pic24', 0)
        ggb2.current?.setFilling('pic26', 0)
      }
      if (ggb2.current?.getValue('Stepper') === 2) {
        ggb2.current?.setFilling('pic24', 0)
        ggb2.current?.setFilling('pic26', 0)
        ggb2.current?.setFilling('pic27', 0)
      }
      if (ggb2.current?.getValue('Stepper') === 3) {
        ggb2.current?.setFilling('pic24', 0)
        ggb2.current?.setFilling('pic26', 0)
        ggb2.current?.setFilling('pic27', 0)
        ggb2.current?.setFilling('pic28', 0)
      }
      if (ggb2.current?.getValue('Stepper') === 4) {
        ggb2.current?.setFilling('pic24', 0)
        ggb2.current?.setFilling('pic26', 0)
        ggb2.current?.setFilling('pic27', 0)
        ggb2.current?.setFilling('pic28', 0)
        ggb2.current?.setFilling('pic29', 0)
      }
    }
  }

  useEffect(() => {
    let animationTimeOut: NodeJS.Timeout

    // eslint-disable-next-line prefer-const
    animationTimeOut = setTimeout(() => {
      if (currentQuestionState === 'multiplication') {
        setShowProblem1Solution(true)
      }
    }, 500)
    return () => clearTimeout(animationTimeOut)
  }, [currentQuestionState, frogAnimationplaying])

  useEffect(() => ggb1.current?.setValue('s1', valueA), [valueA])

  useEffect(() => ggb2.current?.setValue('Stepper', valueB), [valueB])

  const handleresetBtn = () => {
    setCurrentQuestionState('multiplication')
    setShowResetButton(false)
    setIndex(1)
    setGGBLoaded1(true)
    setGGBLoaded2(true)
    ggb1.current?.setValue('sQ1', 0)
    ggb1.current?.setValue('s1', 1)
    ggb2.current?.setValue('Stepper', 1)
    ggb2.current?.setValue('stage1', 0)
    ggb2.current?.setCoords('M', 10, 0)
    setShowButtonHolder1(true)
    setBottomtext(bottomTexts.firstQuestion)
    setShowOnboarding1(true)
    setShowNextButton1(false)
    setShowNextButton2(false)
    setFrogAnimationplaying(false)
    setShowProblem2Solution(false)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: 'g08-eec02-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Guide the frog to collect coins on the number line,
        hopping 2 units at a time."
        backgroundColor="#F1EDFF"
        buttonColor="#EACCFF"
      />
      <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="qxszpp7k" top={110} left={20} onApiReady={onGGB2Loaded} />
      </div>
      <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="gasnyxbs" top={100} left={20} onApiReady={onGGB1Loaded} />
      </div>

      {
        <>
          {!showNextButton1 && showButtonHolder1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '100px',
                display: 'flex',
                width: '100%',
              }}
            >
              <ButtonHolder
                correctButtonIndex={currentQuestionState === 'multiplication' ? 1 : 2}
                isCorrectOptionSelected={(e) => {
                  handleSelection1(e)
                  handleSelection2(e)
                }}
              />
            </div>
          )}
          {showOnboarding1 && (
            <OnboardingAnimationContainer left={180} top={650} src={ClickAnimation} loop autoplay />
          )}
          <BottomText>{bottomText}</BottomText>
          {showNextButton1 && (
            <NextButtonHolder1>
              <NextButtonStyle1
                onClick={() => {
                  handleNextButton1Multiplication()
                  handleNextButton1Divison()
                }}
              >
                Next
              </NextButtonStyle1>
            </NextButtonHolder1>
          )}
          {showNextButton2 && (
            <NextButtonHolder2>
              <NextButtonStyle2 onClick={handleNextButton2Multiplication}>Next</NextButtonStyle2>
            </NextButtonHolder2>
          )}

          {!showButtonHolder1 && showStepperButtonHolder1 && (
            <OnboardingController>
              <StepInputContainer>
                <OnboardingStep index={0}>
                  <StepInput
                    min={1}
                    max={7}
                    defaultValue={DEFAULT_A}
                    onChange={onChangeStepperButton1}
                  />
                </OnboardingStep>
              </StepInputContainer>
            </OnboardingController>
          )}
          {GGBLoaded1 && GGBLoaded2 && (
            <>
              <div style={{ position: 'absolute', left: '85px', top: '391px' }}>
                <ColoredSpan
                  color="white"
                  backgroundColor={currentQuestionState === 'multiplication' ? '#888' : '#6595DE'}
                >
                  0
                </ColoredSpan>
              </div>
              <div style={{ position: 'absolute', left: '355px', top: '391px' }}>
                <ColoredSpan
                  color="white"
                  backgroundColor={currentQuestionState === 'multiplication' ? '#6595DE' : '#888'}
                >
                  10
                </ColoredSpan>
              </div>
            </>
          )}

          {showStepperButtonHolder1 && showJumpButton1 && (
            <JumpButtonHolder1>
              <JumpButtonStyle1
                onClick={() => {
                  handleJumpBtn1()
                  handleJumpBtn2()
                }}
              >
                Jump
              </JumpButtonStyle1>
            </JumpButtonHolder1>
          )}
        </>
      }

      <FrogContainer>
        <Frog ref={FrogJumpRef} />
      </FrogContainer>
      {showProblem1Solution && <CoinHolder1 src={CoinImg} />}
      {showProblem2Solution && <CoinHolder2 src={CoinImg} />}
      {showResetButton && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            bottom: '50px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <TryNewButton onClick={handleresetBtn}>
            <img src={ResetIcon} /> Try New
          </TryNewButton>
        </div>
      )}
    </AppletContainer>
  )
}
