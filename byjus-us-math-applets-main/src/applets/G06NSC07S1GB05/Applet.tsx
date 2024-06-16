import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { number } from 'yargs'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import resetIcon from './assets/resetIcon.svg'
import InputField, { InputRefProps, InputState } from './components/InputField'

const GeogebraContainer = styled(Geogebra)`
  display: flex;
  width: 100%;
  height: 75%;
  justify-content: center;
  align-items: flex-end;
`

const OnboardingAnim = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`

const BottomText = styled.div<{ bottom: number }>`
  width: 100%;
  bottom: ${(a) => a.bottom}px;
  position: absolute;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Btn = styled.div<{ bottom: number }>`
  position: absolute;
  bottom: ${(a) => a.bottom}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  background: #1a1a1a;
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`

const ColoredSpan = styled.span<{ color: string }>`
  color: ${(a) => a.color};
`
const InputContainer = styled.div`
  width: 100%;
  position: absolute;
  top: 290px;
  gap: 2rem;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  left: 225px;
  text-align: center;
  color: #646464;
`

const Input = styled(InputField)`
  position: absolute;
  left: 100px;
  top: 400px;
`

const OnbaordingAnim = styled(OnboardingAnimation)<{ top: number; left: number }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
`

const targetTemp = [-3, 4]

export const AppletG06NSC07S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [currentTemp, setCurrentTemp] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isCheckBtnPressed, setIsCheckBtnPressed] = useState(false)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [showCompareBtn, setShowCompareBtn] = useState(false)
  const [currentAppletStage, setCurrentAppletStage] = useState<'dragging' | 'input'>('dragging')
  //divideng the question into two parts, dragging the knob to the correct
  //temperature and then entering the value
  const [isEnteringVal, setIsEnteringVal] = useState(false)
  const [inputValue, setInputValue] = useState(0)
  const [inputState, setInputState] = useState<InputState>('default')
  const inputRef = useRef<InputRefProps | null>(null)

  //sound
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const handleResetApplet = () => {
    const api = ggbApi.current
    setCurrentQuestionIndex(0)
    setIsCheckBtnPressed(false)
    setIsAnswerCorrect(false)
    setShowCompareBtn(false)
    setCurrentAppletStage('dragging')
    setIsEnteringVal(false)
    setInputValue(0)
    setInputState('default')

    if (api) {
      api.evalCommand('SetValue(layer, 1)')
      api.evalCommand('SetValue(temp, 0.6)')
      api.evalCommand('SetValue(Tvalue, 0)')
      api.evalCommand('SetValue(I, (6, 0))')
      api.evalCommand('SetValue(Answer, 0)')
      api.evalCommand('SetValue(Marker1, (-1.15, 0.6))')
      api.evalCommand('SetValue(Marker2, (-1.15, 0.6))')
      api.evalCommand('SetFixed(CheckAnswer, false, true)')
    }
  }

  const onApiReady = useCallback((api: GeogebraAppApi | null) => {
    if (api === null) return

    ggbApi.current = api
    setGgbLoaded(true)
    let isclicked = false
    api.registerClientListener((e: any) => {
      if (e[0] === 'mouseDown' && e.hits[0] == 'Dagger') {
        isclicked = true
        playMouseIn()
        api.registerObjectUpdateListener('Tvalue', () => {
          setCurrentTemp(Math.round(api.getValue('Tvalue')))
        })
      } else if (e[0] === 'dragEnd' && isclicked) {
        playMouseOut()
        api.unregisterObjectUpdateListener('Tvalue')
      }
    })
  }, [])

  const checkBtnRoutineGgb = () => {
    const api = ggbApi.current

    if (api) {
      if (currentQuestionIndex === 0) {
        api.evalCommand('If(round(Tvalue) == -3,SetValue(layer,3))')
        api.evalCommand('SetValue(Marker1,Track)')
        api.evalCommand('SetValue(Tvalue1,Tvalue)')
        api.evalCommand('If(round(Tvalue) != -3,SetValue(layer,2))')
      } else if (currentQuestionIndex === 1) {
        api.evalCommand('If(round(Tvalue) == 4,SetValue(layer,6))')
        api.evalCommand('SetValue(Marker2,Track)')
        api.evalCommand('SetValue(Tvalue2,Tvalue)')
        api.evalCommand('If(round(Tvalue) != 4,SetValue(layer,5))')
        setShowCompareBtn(true)
      }
    }
  }

  const handleCheckBtn = () => {
    playMouseClick()
    setIsCheckBtnPressed(true)
    const api = ggbApi.current

    if (currentAppletStage === 'dragging') {
      if (currentTemp === targetTemp[currentQuestionIndex]) {
        setIsAnswerCorrect(true)
        if (currentQuestionIndex === 1) {
          setShowCompareBtn(true)
        }
      }
      checkBtnRoutineGgb()
    } else {
      if (api) {
        if (inputValue === 7) {
          api.setValue('layer', 10)
          setIsAnswerCorrect(true)
          setInputState('correct')
        } else {
          api.setValue('layer', 9)
          setInputState('wrong')
        }
        // api.evalCommand('If(Answer != 7, SetValue(layer, 9))')
        // api.evalCommand('If(Answer == 7, SetValue(layer, 10))')
        // api.evalCommand("If(Answer != 7, SetColor(CheckAnswer, '#F57A7A'))")
        // api.evalCommand("If(Answer == 7, SetColor(CheckAnswer, '#85CC29'))")
        api.evalCommand('SetFixed(CheckAnswer, true, false)')
      }
    }
  }

  const handleResetBtn = () => {
    playMouseClick()
    setIsCheckBtnPressed(false)
    if (currentAppletStage === 'dragging') {
      if (ggbApi.current) {
        if (currentQuestionIndex === 0) {
          ggbApi.current.evalCommand('SetValue(layer,1)')
        } else if (currentQuestionIndex === 1) {
          ggbApi.current.evalCommand('SetValue(layer,4)')
        }
      }
    } else {
      // setIsEnteringVal(true)
      inputRef.current?.reset()
      setInputState('default')
      if (ggbApi.current) {
        ggbApi.current.evalCommand('SetValue(layer, 8)')
        ggbApi.current.evalCommand('SetValue(Answer, 0)')
        // ggbApi.current.evalCommand('SetColor(CheckAnswer, '#888888')')
        ggbApi.current.evalCommand('SetFixed(CheckAnswer, false, true)')
      }
    }
  }

  const handleNextbtn = () => {
    playMouseClick()
    const api = ggbApi.current

    if (currentAppletStage === 'dragging') {
      if (api) {
        api.evalCommand('SetValue(layer,4)')
        setCurrentQuestionIndex((prev) => prev + 1)
        setIsCheckBtnPressed(false)
        setIsAnswerCorrect(false)
      }
    } else {
      setIsEnteringVal(true)
      if (api) {
        api.evalCommand('SetValue(layer, 8)')
        api.evalCommand('SetColor(CheckAnswer,"#888888")')
      }
    }
  }

  const handleCompare = () => {
    playMouseClick()
    setCurrentAppletStage('input')
    setIsCheckBtnPressed(false)
    setIsAnswerCorrect(false)

    if (ggbApi.current) {
      ggbApi.current.evalCommand('SetValue(layer,7)')
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-nsc07-s1-gb05',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore integers with temperature."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GeogebraContainer materialId="ydutpjxe" onApiReady={onApiReady} />
      {ggbLoaded && (
        <OnboardingController>
          {currentAppletStage === 'dragging' && (
            <>
              {isAnswerCorrect ? (
                <BottomText bottom={110}>
                  <>
                    Awesome! You got it right.
                    <br />
                    {currentQuestionIndex === 0 && (
                      <>
                        {' '}
                        The temperature here is <ColoredSpan color="#2ad3f5">3°</ColoredSpan> below
                        0°.
                        <br />
                        Please note |-3| = 3.
                      </>
                    )}
                    {currentQuestionIndex === 1 && (
                      <>
                        {' '}
                        The temperature here is <ColoredSpan color="#ff8f1f">4°</ColoredSpan> above
                        0°.
                        <br />
                        Please note |4| = 4.
                      </>
                    )}
                  </>
                </BottomText>
              ) : isCheckBtnPressed ? (
                <BottomText bottom={120}>Oops! Give it another shot.</BottomText>
              ) : (
                <BottomText bottom={120}>
                  Move the pointer to show {targetTemp[currentQuestionIndex]}°C.
                </BottomText>
              )}
              <BtnContainer>
                {isCheckBtnPressed ? (
                  isAnswerCorrect ? (
                    showCompareBtn ? (
                      <Btn bottom={30} onClick={handleCompare}>
                        Compare
                      </Btn>
                    ) : (
                      <Btn bottom={30} onClick={handleNextbtn}>
                        Next
                      </Btn>
                    )
                  ) : (
                    <Btn bottom={50} onClick={handleResetBtn}>
                      <img src={resetIcon} alt="reset" />
                      Retry
                    </Btn>
                  )
                ) : (
                  <Btn bottom={50} onClick={handleCheckBtn}>
                    Check
                  </Btn>
                )}
              </BtnContainer>
            </>
          )}
          {currentAppletStage === 'input' && (
            <>
              {isEnteringVal ? (
                isCheckBtnPressed ? (
                  isAnswerCorrect ? (
                    <BottomText bottom={100}>Awesome! You got it right.</BottomText>
                  ) : (
                    <BottomText bottom={100}>Oops! Give it another shot.</BottomText>
                  )
                ) : (
                  <BottomText bottom={100}>
                    What’s the difference between the two temperatures?
                  </BottomText>
                )
              ) : (
                <BottomText bottom={100}>
                  <>
                    <ColoredSpan color="#2ad3f5">-3</ColoredSpan>°C {'<'}{' '}
                    <ColoredSpan color="#ff8f1f">4</ColoredSpan>°C <br /> Observe that -3° is below
                    0°, while 4° is above 0°.
                  </>
                </BottomText>
              )}
              <BtnContainer>
                {isEnteringVal ? (
                  isCheckBtnPressed ? (
                    isAnswerCorrect ? (
                      <Btn bottom={30} onClick={handleResetApplet}>
                        Reset
                      </Btn>
                    ) : (
                      <Btn bottom={30} onClick={handleResetBtn}>
                        Retry
                      </Btn>
                    )
                  ) : (
                    <Btn bottom={30} onClick={handleCheckBtn}>
                      Check
                    </Btn>
                  )
                ) : (
                  <Btn bottom={30} onClick={handleNextbtn}>
                    Next
                  </Btn>
                )}
              </BtnContainer>
              <InputContainer>
                {isEnteringVal && (
                  <Input ref={inputRef} state={inputState} onChange={(val) => setInputValue(val)} />
                )}
              </InputContainer>
            </>
          )}
          <OnboardingStep index={0}>
            <OnboardingAnim
              left={416}
              top={200}
              type="moveVertically"
              complete={currentTemp !== 0}
            />
          </OnboardingStep>
          <OnboardingStep index={1}>
            <OnboardingAnim left={290} top={680} type="click" complete={isCheckBtnPressed} />
          </OnboardingStep>
        </OnboardingController>
      )}
    </AppletContainer>
  )
}
