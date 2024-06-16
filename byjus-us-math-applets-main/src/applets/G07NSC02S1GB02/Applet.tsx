import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ResetIcon from './assets/reset.svg'
import InputField, { InputState } from './components/InputField'

const StyledGgb = styled(Geogebra)`
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const BottomText = styled.div<{ bottom: number }>`
  font-family: 'Nunito';
  width: 100%;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #444444;
  justify-content: center;
  position: absolute;
  bottom: ${(a) => a.bottom}px;
`

const ButtonContainer = styled.div<{ bottom: number }>`
  position: absolute;
  bottom: ${(a) => a.bottom}px;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
`

const Button = styled.div<{ isActive: boolean }>`
  padding: 10px 20px;
  background: #1a1a1a;
  border-radius: 10px;
  opacity: ${(a) => (a.isActive ? 1 : 0.3)};
  cursor: ${(a) => (a.isActive ? 'pointer' : 'default')};
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ffffff;
`

const Input = styled.div`
  position: absolute;
  top: 327px;
  left: 444px;
`

const ResetBtn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  width: 148px;
  height: 60px;
  background: #ffffff;
  border: 2px solid #1a1a1a;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  color: #212121;
  cursor: pointer;
`

const OnBoardingAnim = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
`

export const AppletG07NSC02S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [currentAppletState, setCurrentAppletState] = useState<'dragging' | 'input'>('dragging')
  const [currentSubject, setCurrentSubject] = useState<'human' | 'fish'>('human')
  const [isCheckButtonActive, setIsCheckButtonActive] = useState(false)
  const [showRetryBtn, setShowRetryBtn] = useState(false)
  const [humanPosition, setHumanPosition] = useState(0)
  const [fishPosition, setFishPosition] = useState(0)
  const [showNextBtn, setShowNextBtn] = useState(false)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playCorrectAnswer = useSFX('correct')
  const playWrongAnswer = useSFX('incorrect')

  const [inputVal, setInputVal] = useState(0)
  const [inputState, setInputState] = useState<InputState>('default')
  const [showResetBtn, setShowResetBtn] = useState(false)
  const [isPictureSelected, setisPictureSelected] = useState(false) //for sound while dragging

  const correctAnswer = currentSubject === 'human' ? 70 : -50

  const onGgbReady = useCallback((api: GeogebraAppApi | null) => {
    if (api === null) {
      return
    }

    ggbApi.current = api
    setGgbLoaded(true)
  }, [])

  const onGGBClientEvent = useCallback(
    (event: any) => {
      if (event[0] === 'select' && (event[1] === 'pic19' || event[1] === 'pic6')) {
        setisPictureSelected(true)
        playMouseIn()
      } else if (event[0] === 'mouseDown' && event[1] === '') {
        setisPictureSelected(false)
      }

      if (event[0] === 'mouseDown' && isPictureSelected) {
        playMouseIn()
      } else if (event.type === 'dragEnd' && (event[1] === 'pic19' || event[1] === 'pic6')) {
        playMouseOut()
      }
    },
    [isPictureSelected],
  )

  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerClientListener(onGGBClientEvent)
      return () => ggbApi.current?.unregisterClientListener(onGGBClientEvent)
    }
  }, [ggbLoaded, onGGBClientEvent])

  useEffect(() => {
    if (ggbApi.current === null) return

    const api = ggbApi.current

    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('HumanPointanswerint', () => {
        setHumanPosition(api.getValue('HumanPointanswerint'))
        setIsCheckButtonActive(true)
      })

      api.registerObjectUpdateListener('FishPointPositive', () => {
        setFishPosition(-api.getValue('FishPointPositive'))
        setIsCheckButtonActive(true)
      })
    }

    return () => {
      api.unregisterObjectUpdateListener('HumanPointanswerint')
      api.unregisterObjectUpdateListener('FishPointPositive')
    }
  }, [ggbLoaded])

  const handleCheckBtn = () => {
    if (currentAppletState === 'dragging') {
      ggbApi.current?.setValue(`check${currentSubject === 'human' ? '1' : '2'}`, 1)
      if ((currentSubject === 'human' ? humanPosition : fishPosition) === correctAnswer) {
        setShowNextBtn(true)
      } else {
        setShowRetryBtn(true)
      }
      playMouseClick()
    } else {
      if (inputVal === 120) {
        //correct answer
        ggbApi.current?.setValue('check4correct', 1)
        setInputState('correct')
        playCorrectAnswer()
        setShowResetBtn(true)
      } else {
        ggbApi.current?.setValue('check4wrong', 1)
        setInputState('wrong')
        playWrongAnswer()
      }
    }
  }

  const handleRetryBtn = () => {
    if (ggbApi.current) {
      ggbApi.current.setValue(`check${currentSubject === 'human' ? '1' : '2'}`, 0)
      setShowRetryBtn(false)
    }
    playMouseClick()
  }

  const handleNextBtn = () => {
    if (currentSubject === 'human') {
      setCurrentSubject('fish')
      ggbApi.current?.evalCommand('SetValue(Qcounter,Qcounter+1)')
      setShowNextBtn(false)
      setIsCheckButtonActive(false)
    } else {
      setCurrentAppletState('input')
      ggbApi.current?.evalCommand('SetValue(Qcounter,Qcounter+2)')
    }
    playMouseClick()
  }

  const handleInputChange = (val: number) => {
    setInputVal(val)
  }

  const handleResetBtn = () => {
    ggbApi.current?.evalCommand(' SetValue(Qcounter,1)')
    ggbApi.current?.evalCommand('SetValue(check1,false)')
    ggbApi.current?.evalCommand('SetValue(check2,false)')
    ggbApi.current?.evalCommand('SetValue(compare,false)')
    ggbApi.current?.evalCommand('SetValue(check4correct,false)')
    ggbApi.current?.evalCommand('SetValue(check4wrong,false)')
    ggbApi.current?.evalCommand('SetValue(compareslider,0)')
    ggbApi.current?.evalCommand('SetValue(Interactive1_1,Point(f))')
    ggbApi.current?.evalCommand('SetValue(Interactive2_{2},Point(g))')
    ggbApi.current?.evalCommand('SetColor(InputBox1,"#888888")')
    ggbApi.current?.evalCommand('SetValue(moved,false)')

    setCurrentAppletState('dragging')
    setCurrentSubject('human')
    setFishPosition(0)
    setHumanPosition(0)
    setIsCheckButtonActive(false)
    setShowNextBtn(false)
    setInputState('default')
    setShowResetBtn(false)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-nsc02-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore integers with sea level"
        backgroundColor="#f6f6f6"
        buttonColor="#1A1A1A"
      />
      <StyledGgb materialId="kjjt7a76" onApiReady={onGgbReady} />

      {ggbLoaded && (
        <>
          <OnboardingController>
            {currentAppletState === 'dragging' ? (
              <>
                <BottomText bottom={120}>
                  {!showNextBtn ? (
                    <>
                      {!showRetryBtn ? (
                        <>
                          Move the pointer to place {currentSubject === 'human' ? 'Jack ' : 'fish '}{' '}
                          at an elevation <br />
                          of {Math.abs(correctAnswer)} meters{' '}
                          {correctAnswer > 0 ? 'above ' : 'below '} sea level.
                        </>
                      ) : (
                        <>
                          Oops! Try placing Jack at a{' '}
                          {humanPosition < correctAnswer ? 'higher ' : 'lower '}
                          elevation.
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      Awesome! You got it right.
                      <br />|{correctAnswer}| = {Math.abs(correctAnswer)}
                    </>
                  )}
                </BottomText>

                <ButtonContainer bottom={50}>
                  {showNextBtn ? (
                    <Button onClick={handleNextBtn} isActive>
                      Next
                    </Button>
                  ) : !showRetryBtn ? (
                    <Button
                      onClick={isCheckButtonActive ? handleCheckBtn : undefined}
                      isActive={isCheckButtonActive}
                    >
                      Check
                    </Button>
                  ) : (
                    <Button onClick={handleRetryBtn} isActive>
                      Retry
                    </Button>
                  )}
                </ButtonContainer>
              </>
            ) : (
              <>
                <BottomText bottom={140}>
                  {!showResetBtn ? (
                    <>What is the distance between Jack and the Fish?</>
                  ) : (
                    <>
                      Awesome! You got it right. <br /> The distance between Jack and Fish is 120
                      meters.
                    </>
                  )}
                </BottomText>
                <ButtonContainer bottom={50}>
                  {!showResetBtn ? (
                    <Button isActive onClick={handleCheckBtn}>
                      Check
                    </Button>
                  ) : (
                    <ResetBtn onClick={handleResetBtn}>
                      <img src={ResetIcon} /> Reset
                    </ResetBtn>
                  )}
                </ButtonContainer>
                <Input>
                  <InputField state={inputState} onChange={handleInputChange} />
                </Input>
              </>
            )}

            <OnboardingStep index={0}>
              <OnBoardingAnim top={320} type="moveUp" left={42} complete={humanPosition !== 0} />
            </OnboardingStep>
            <OnboardingStep index={1}>
              <OnBoardingAnim
                top={664}
                type="click"
                left={290}
                complete={showNextBtn || showRetryBtn}
              />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}
