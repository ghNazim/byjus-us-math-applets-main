import {
  Alignment,
  EventCallback,
  Fit,
  Layout,
  useRive,
  useStateMachineInput,
} from '@rive-app/react-canvas'
import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useSFX } from '@/hooks/useSFX'

import RiveAnimation from '../assets/BallooonShitRive.riv'
//@ts-ignore
import screen12chairvideo from '../assets/Chairfloat.mp4'
import CutIcon from '../assets/cutIcon.svg'
import RetryIcon from '../assets/retryIcon.svg'
import screen12scooter8video from '../assets/ScooterBalloon8.mp4'
import screen12scooter14video from '../assets/ScooterBalloon14.mp4'
import screen12scooter36video from '../assets/ScooterBalloon36.mp4'
import screen12scooter45video from '../assets/ScooterBalloon45.mp4'
import Screen9 from '../assets/screen9.svg'
import Screen10 from '../assets/screen10.svg'
import Screen10Wrong from '../assets/screen10Wrong.svg'
import Screen11 from '../assets/screen11.svg'
import Screen12 from '../assets/screen12.svg'
import Screen12Table from '../assets/screen12table.svg'
import Screen12Wrong from '../assets/screen12Wrong.svg'
import Screen13 from '../assets/screen13.svg'
import Screen13Table from '../assets/screen13table.svg'
import screen9video from '../assets/Sofa.mp4'
import { Dropdown } from './Dropdown/Dropdown'
import InputField, { InputRefProps } from './InputField'

const BottomText = styled.div<{ bottom?: number }>`
  position: absolute;
  bottom: ${(a) => (a.bottom ? a.bottom : 180)}px;
  text-align: center;
  width: 100%;
  padding: 0 6%;
  //styleName: Sub heading/Bold;
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
  line-height: 150%;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 30px;
  width: 100%;
`

const Button = styled.div<{ active: boolean }>`
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border-radius: 10px;
  background: var(--interactives-090, #1a1a1a);
  color: white;
  cursor: ${(a) => (a.active ? 'pointer' : 'default')};
  transition: cubic-bezier(0.39, 0.575, 0.565, 1) 0.3s;
  opacity: ${(a) => (a.active ? 1 : 0.6)};
  :hover {
    scale: ${(a) => (a.active ? 1.03 : 1)};
  }
`

const InputContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  bottom: 120px;
`
const MainContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 100px;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 440px;
  /* width: 700px; */
  /* border: 1px solid red; */
  padding: 0 10px;
`

const ColoredSpan = styled.span<{ color: string; bg: string }>`
  background-color: ${(a) => a.bg};
  color: ${(a) => a.color};
  padding: 0 5px;
  border-radius: 8px;
  margin: 0 3px;
`

const InputContainerWithPosition = styled.div<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`
const ImageCrop = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 90%;
  margin-bottom: 5%;
  z-index: 1;
`

const OnboardAnimation = styled(OnboardingAnimation)`
  position: absolute;
  left: 287px;
  top: 676px;
`
const VideoPlayer = styled.video`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 40px;
  pointer-events: none;
`

const VideoPlayer12Constant = styled.video`
  position: absolute;
  left: 71%;
  translate: -71%;
  top: 70px;
  pointer-events: none;
  z-index: 2;
`
const VideoPlayer12WrongRight = styled.video`
  position: absolute;
  left: 59%;
  translate: -59%;
  top: 27px;
  pointer-events: none;
`
const STATE_MACHINE = 'State Machine 1'

interface props {
  onComplete: () => void
}

const RiveComp: FC<props> = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0)
  //this controls the whole flow of the applet,I have added
  //a useeffect to render the side effects of currentState change.
  // the state changes when pressing the button or once specific animations
  //complete

  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)

  const [bottomText, setBottomText] = useState(
    <>Cut the ropes and carefully observe to answer the question.</>,
  )
  const [buttonTitle, setButtonTitle] = useState(
    <>
      <img src={CutIcon} />
      Cut
    </>,
  )

  const inputRef = useRef<InputRefProps | null>(null)

  //
  const [dropDownValue1, setDropDownValue1] = useState<number>(0)
  const [dropDownValue2, setDropDownValue2] = useState<number>(0)
  const [dropDownValue3, setDropDownValue3] = useState<number>(0)
  const [wrongAnswerGivenForDropDowns, setWrongAnswersGivenForDropDowns] = useState(false)
  const [showVideo14, setShowVideo14] = useState(false)
  const [showVideo8, setShowVideo8] = useState(false)
  const [showVideo45, setShowVideo45] = useState(false)
  const [showVideo36, setShowVideo36] = useState(false)
  const objectVideoRef = useRef<HTMLVideoElement>(null)
  const videoPlayer12WrongRightRef = useRef(null)

  const stateMachinesForAnswerCorrect = ['introLoop', 'sackLoop', 'footbalLoop', 'catLoop']
  //this is to do changes according to statechange changes in the applet
  const handleStateChange: EventCallback | undefined = (state) => {
    if (state.data) {
      if (stateMachinesForAnswerCorrect.includes(state.data.toString())) {
        setIsAnimationPlaying(false)
        setCurrentStage((prev) => prev + 1)
      }
    }
  }

  const [userEnteredValue, setUserEnteredValue] = useState<number | undefined>(undefined)
  const { rive, RiveComponent } = useRive({
    src: RiveAnimation,
    autoplay: true,
    stateMachines: STATE_MACHINE,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.TopCenter }),
    animations: 'start',
    onStateChange: handleStateChange,
  })

  //sound
  const playMouseClick = useSFX('mouseClick')

  const cutAnimationTrigger = useStateMachineInput(rive, STATE_MACHINE, 'cut')
  const riveNextTrigger = useStateMachineInput(rive, STATE_MACHINE, 'next')
  const riveCheckTrigger = useStateMachineInput(rive, STATE_MACHINE, 'check')
  const riveIsIntroCorrectBool = useStateMachineInput(rive, STATE_MACHINE, 'isIntroCorrect')
  const riveIsCatCorrectBool = useStateMachineInput(rive, STATE_MACHINE, 'isCatCorrect')
  const riveIsFootballCorrectBool = useStateMachineInput(rive, STATE_MACHINE, 'isFootballCorrect')
  const riveIsSackCorrectBool = useStateMachineInput(rive, STATE_MACHINE, 'isSackCorrect')

  const changeBottomTextOnCheck = (corretAnswerText: JSX.Element, correctAnswer: number) => {
    if (userEnteredValue === correctAnswer) {
      setIsAnimationPlaying(true)
      setBottomText(corretAnswerText)
    } else if (userEnteredValue) {
      if (userEnteredValue < correctAnswer) {
        setBottomText(<>That’s not enough balloons!</>)
      } else {
        setBottomText(<>That’s too many balloons!</>)
      }
    }
  }

  const handleButtonForRive = () => {
    playMouseClick()
    switch (currentStage) {
      case 0:
        if (cutAnimationTrigger) cutAnimationTrigger.fire()
        setIsAnimationPlaying(true)
        break
      case 1:
        //user input- correct answer:4
        if (userEnteredValue !== 0) {
          if (riveCheckTrigger) {
            riveCheckTrigger.fire()
          }
          if (userEnteredValue === 4) {
            setButtonTitle(<>Next</>)
            setCurrentStage(2)
            setBottomText(
              <>
                Well done! In this scenario{' '}
                <ColoredSpan bg="#ebfbff" color="#1CB9D9">
                  4 balloons
                </ColoredSpan>{' '}
                per bag is the
                <ColoredSpan bg="#ececec" color="#444444">
                  unit rate
                </ColoredSpan>
                .
              </>,
            )
          } else {
            setBottomText(<>Uh-oh! Observe the bag that is floating and try again.</>)
          }
        }

        break

      case 2:
        //going to 3 bags problem
        setUserEnteredValue(0)
        //previously it was dropdown, so resetting
        setButtonTitle(<>Check</>)
        setCurrentStage(3)
        setBottomText(
          <>
            If 1 bag requires{' '}
            <ColoredSpan bg="#ebfbff" color="#1CB9D9">
              4 balloons
            </ColoredSpan>{' '}
            to float, then how many <br />
            <ColoredSpan bg="#fbe9d5" color="#D97A1A">
              balloons
            </ColoredSpan>{' '}
            do 3 bags require to float?
          </>,
        )
        if (riveNextTrigger) riveNextTrigger.fire()
        break

      case 3:
        //checking the answer: correct answer is 12
        riveCheckTrigger?.fire()

        changeBottomTextOnCheck(
          <>
            Well done! Given a unit rate of{' '}
            <ColoredSpan bg="#ebfbff" color="#1CB9D9">
              4
            </ColoredSpan>{' '}
            balloons per bag, 3 bags require 3 ×{' '}
            <ColoredSpan bg="#ebfbff" color="#1CB9D9">
              4
            </ColoredSpan>{' '}
            =
            <ColoredSpan bg="#fbe9d5" color="#D97A1A">
              12 balloons
            </ColoredSpan>{' '}
            to float.
          </>,
          12,
        )
        break

      case 4:
        if (riveNextTrigger) riveNextTrigger.fire()
        setCurrentStage(5)
        setBottomText(
          <>
            If 2 balls require{' '}
            <ColoredSpan bg="#ebfbff" color="#1CB9D9">
              5 balloons
            </ColoredSpan>{' '}
            to float, then how many <br />
            <ColoredSpan bg="#fbe9d5" color="#D97A1A">
              balloons
            </ColoredSpan>{' '}
            do 8 balls require to float?
          </>,
        )
        setButtonTitle(<>Check</>)
        inputRef.current?.reset()
        break
      case 5:
        //football problem. Correct answer is 20
        riveCheckTrigger?.fire()
        changeBottomTextOnCheck(
          <>
            Well done! Given a unit rate of{' '}
            <ColoredSpan bg="#ebfbff" color="#1CB9D9">
              2.5
            </ColoredSpan>{' '}
            balloons per ball,
            <br /> 8 balls require 8 ×{' '}
            <ColoredSpan bg="#ebfbff" color="#1CB9D9">
              2.5
            </ColoredSpan>{' '}
            =
            <ColoredSpan bg="#fbe9d5" color="#D97A1A">
              20 balloons
            </ColoredSpan>{' '}
            to float.
          </>,
          20,
        )

        break
      case 6:
        if (riveNextTrigger) riveNextTrigger.fire()
        setCurrentStage(7)
        setBottomText(
          <>
            If 3 plush toys require{' '}
            <ColoredSpan bg="#ebfbff" color="#1CB9D9">
              27
            </ColoredSpan>{' '}
            balloons to float, then how many{' '}
            <ColoredSpan bg="#fbe9d5" color="#D97A1A">
              balloons
            </ColoredSpan>{' '}
            does 1 plush toy require to float?
          </>,
        )
        inputRef.current?.reset()
        setButtonTitle(<>Check</>)
        break
      case 7:
        //plush toy problem. Correct answer is 9
        riveCheckTrigger?.fire()

        changeBottomTextOnCheck(
          <>
            Well done! Here the unit rate is <br />
            <ColoredSpan bg="#ebfbff" color="#1CB9D9">
              27
            </ColoredSpan>{' '}
            ÷ 3 ={' '}
            <ColoredSpan bg="#fbe9d5" color="#D97A1A">
              9
            </ColoredSpan>{' '}
            <br /> balloons per plush toy.
          </>,
          9,
        )

        break
      case 8:
        setCurrentStage((prev) => prev + 1)
        break
      default:
        break
    }
  }

  const handleIsButtonActiveForRive = () => {
    if (isAnimationPlaying) {
      //disabling button when animation is playing
      return false
    }

    const stagesWhereInputIsThere = [1, 3, 5, 7]

    if (stagesWhereInputIsThere.includes(currentStage)) {
      return userEnteredValue ? userEnteredValue !== 0 : false
    }

    if (currentStage === 10) {
      return dropDownValue1 !== 0 && dropDownValue2 !== 0 && dropDownValue3 !== 0
    } else if (currentStage === 12) {
      return dropDownValue1 !== 0
    }

    return true
  }

  useEffect(() => {
    if (currentStage === 1) {
      setButtonTitle(<>Check</>)
      setBottomText(<>Enter the number of balloons required to make 1 bag float.</>)
    }
  }, [currentStage])

  //this useeffcect is for the sideeffects of currentStage
  //because in some stages im waiting for the animation to
  //complete to change the currentStage.
  useEffect(() => {
    switch (currentStage) {
      case 0:
        setBottomText(<>Cut the ropes and carefully observe to answer the question.</>)
        break
      case 1:
        //waiting for the animation to complete to update the buttons
        //and text

        if (riveIsIntroCorrectBool) {
          userEnteredValue === 4
            ? (riveIsIntroCorrectBool.value = true)
            : (riveIsIntroCorrectBool.value = false)
        }
        break
      case 3:
        if (riveIsSackCorrectBool) {
          if (userEnteredValue == 12) {
            riveIsSackCorrectBool.value = true
          } else {
            riveIsSackCorrectBool.value = false
          }
        }
        break
      case 4:
        //after the animation
        setButtonTitle(<>Next</>)
        break

      case 5:
        if (riveIsFootballCorrectBool) {
          if (userEnteredValue === 20) {
            riveIsFootballCorrectBool.value = true
          } else {
            riveIsFootballCorrectBool.value = false
          }
        }
        break
      case 6:
        //after the animation
        setButtonTitle(<>Next</>)
        break
      case 7:
        if (riveIsCatCorrectBool) {
          if (userEnteredValue === 9) {
            riveIsCatCorrectBool.value = true
          } else {
            riveIsCatCorrectBool.value = false
          }
        }
        break
      case 8:
        //after the animation
        setButtonTitle(<>Next</>)

        break
      case 9:
        setBottomText(<>Find the unknown weight of the objects using unit rate.</>)
        break
      default:
        break
    }
  }, [currentStage, userEnteredValue])

  const handleButtonClickAfterRive = () => {
    switch (currentStage) {
      case 9:
        setBottomText(<>Complete the table.</>)
        setCurrentStage(10)
        break
      case 10:
        if (dropDownValue1 === 5 && dropDownValue2 === 15 && dropDownValue3 === 120) {
          setCurrentStage(11)
          setBottomText(
            <>Well done! Continue to find the number of balloons required to float a scooter.</>,
          )
        } else {
          setWrongAnswersGivenForDropDowns(true)
          setBottomText(<>Oops! You didn’t get all the answers correct.</>)
        }
        break
      case 11:
        setCurrentStage(12)
        setDropDownValue1(0)
        setWrongAnswersGivenForDropDowns(false)
        setBottomText(<>Complete the table.</>)
        break
      case 12:
        if (dropDownValue1 === 36) {
          setShowVideo36(true)
          setCurrentStage(13)
          setBottomText(<>Bravo! You’ve explored the applications of unit rates.</>)
        } else if (dropDownValue1 === 14) {
          setShowVideo14(true)
          setBottomText(() =>
            dropDownValue1 < 36 ? (
              <>Uh oh! That’s not enough balloons.</>
            ) : (
              <>That’s too many balloons!</>
            ),
          )
        } else if (dropDownValue1 === 45) {
          setShowVideo45(true)
          setBottomText(() =>
            dropDownValue1 < 36 ? (
              <>Uh oh! That’s not enough balloons.</>
            ) : (
              <>That’s too many balloons!</>
            ),
          )
        } else if (dropDownValue1 === 8) {
          setShowVideo8(true)
          setBottomText(() =>
            dropDownValue1 < 36 ? (
              <>Uh oh! That’s not enough balloons.</>
            ) : (
              <>That’s too many balloons!</>
            ),
          )
        } else {
          setWrongAnswersGivenForDropDowns(true)
          setBottomText(() =>
            dropDownValue1 < 36 ? (
              <>Uh oh! That’s not enough balloons.</>
            ) : (
              <>That’s too many balloons!</>
            ),
          )
        }
        break
      default:
        break
    }
  }

  return (
    <div>
      {currentStage < 9 ? (
        <>
          <MainContainer style={{ visibility: `${currentStage < 9 ? 'visible' : 'hidden'}` }}>
            <RiveComponent />
          </MainContainer>
          <BottomText bottom={currentStage === 0 ? 180 : currentStage == 1 ? 200 : undefined}>
            <>{bottomText}</>
          </BottomText>

          <ButtonContainer>
            <Button
              active={handleIsButtonActiveForRive()}
              onClick={handleIsButtonActiveForRive() ? handleButtonForRive : undefined}
            >
              {buttonTitle}
            </Button>
          </ButtonContainer>
          {currentStage === 1 ? (
            <InputContainer>
              <Dropdown
                dropDownArray={[1, 4, 8]}
                onValueChange={(val) => {
                  setUserEnteredValue(val)
                }}
              />
            </InputContainer>
          ) : null}

          <InputContainer>
            {currentStage === 3 || currentStage === 5 || currentStage === 7 ? (
              <InputField
                ref={inputRef}
                onChange={(val) => setUserEnteredValue(val)}
                state={isAnimationPlaying ? 'locked' : 'default'}
              />
            ) : null}
          </InputContainer>
          <OnboardingController>
            <OnboardingStep index={0}>
              <OnboardAnimation type="click" complete={currentStage > 0} />
            </OnboardingStep>
          </OnboardingController>
        </>
      ) : (
        <>
          <MainContainer>
            <>
              {currentStage === 9 ? (
                <div>
                  <VideoPlayer src={screen9video} width="680px" height="408px" autoPlay loop />
                </div>
              ) : null}

              {currentStage === 9 ? (
                <div style={{ zIndex: 1 }}>
                  <img src={Screen9}></img>
                </div>
              ) : null}

              {currentStage === 10 ? (
                <div>
                  <VideoPlayer src={screen9video} width="680px" height="408px" autoPlay loop />
                </div>
              ) : null}

              {currentStage === 10 ? (
                <div style={{ zIndex: 1 }}>
                  <img src={Screen10}></img>
                </div>
              ) : null}

              {currentStage === 11 ? (
                <ImageCrop>
                  <VideoPlayer src={screen9video} width="680px" height="408px" autoPlay loop />
                  <img src={Screen11} style={{ zIndex: 1 }} />
                </ImageCrop>
              ) : undefined}
              {currentStage === 12 ? (
                <>
                  <VideoPlayer12Constant src={screen12chairvideo} autoPlay loop />
                  {wrongAnswerGivenForDropDowns ? (
                    <img src={Screen12} />
                  ) : (
                    <>
                      <img
                        src={Screen12}
                        style={{
                          zIndex: 0,
                          left: '59%',
                          transform: 'translate(-59%)',
                          position: 'absolute',
                          top: 27,
                        }}
                      />
                      <img
                        src={Screen12Table}
                        style={{
                          zIndex: 3,
                          left: '50%',
                          transform: 'translate(-50%)',
                          position: 'absolute',
                          top: 260,
                        }}
                      />
                    </>
                  )}
                </>
              ) : null}

              {currentStage === 13 ? (
                <>
                  <img
                    src={Screen13}
                    style={{
                      zIndex: 1,
                    }}
                  />
                  <img
                    src={Screen13Table}
                    style={{
                      zIndex: 3,
                      left: 180,
                      top: 300,
                      position: 'absolute',
                    }}
                  />
                </>
              ) : null}
            </>

            {showVideo14 && currentStage === 12 && (
              <VideoPlayer12WrongRight
                src={screen12scooter14video}
                autoPlay
                onEnded={() => setShowVideo14(false)}
              />
            )}
            {showVideo8 && currentStage === 12 && (
              <VideoPlayer12WrongRight
                src={screen12scooter8video}
                autoPlay
                onEnded={() => setShowVideo8(false)}
              />
            )}
            {showVideo45 && currentStage === 12 && (
              <VideoPlayer12WrongRight
                src={screen12scooter45video}
                autoPlay
                onEnded={() => setShowVideo45(false)}
              />
            )}
            {showVideo36 && currentStage === 13 ? (
              <>
                <VideoPlayer12WrongRight
                  src={screen12scooter36video}
                  style={{
                    zIndex: 2,
                  }}
                  autoPlay
                />
                <VideoPlayer12Constant
                  src={screen12chairvideo}
                  style={{
                    zIndex: 2,
                  }}
                  autoPlay
                  loop
                />
              </>
            ) : null}
          </MainContainer>

          <ButtonContainer>
            {currentStage < 13 ? (
              <Button
                active={handleIsButtonActiveForRive()}
                onClick={handleIsButtonActiveForRive() ? handleButtonClickAfterRive : undefined}
              >
                {currentStage % 2 ? 'Next' : 'Check'}
              </Button>
            ) : (
              <Button active onClick={onComplete}>
                <img src={RetryIcon} /> Retry
              </Button>
            )}
          </ButtonContainer>

          <BottomText>{bottomText}</BottomText>

          {currentStage === 10 ? (
            <>
              <InputContainerWithPosition left={294} top={427} style={{ zIndex: 2 }}>
                <Dropdown
                  dropDownArray={[15, 19, 5, 104, 120]}
                  onValueChange={(val) => setDropDownValue1(val)}
                />
              </InputContainerWithPosition>
              <InputContainerWithPosition left={425} top={427} style={{ zIndex: 2 }}>
                <Dropdown
                  dropDownArray={[15, 19, 5, 104, 120]}
                  onValueChange={(val) => setDropDownValue2(val)}
                />
              </InputContainerWithPosition>
              <InputContainerWithPosition left={559} top={427} style={{ zIndex: 2 }}>
                <Dropdown
                  dropDownArray={[15, 19, 5, 104, 120]}
                  move
                  onValueChange={(val) => setDropDownValue3(val)}
                />
              </InputContainerWithPosition>
            </>
          ) : null}

          {currentStage == 12 ? (
            <InputContainerWithPosition left={287} top={457} style={{ zIndex: 4 }}>
              <Dropdown
                dropDownArray={[14, 8, 45, 36]}
                onValueChange={(val) => setDropDownValue1(val)}
              />
            </InputContainerWithPosition>
          ) : null}
        </>
      )}
    </div>
  )
}

export default RiveComp
