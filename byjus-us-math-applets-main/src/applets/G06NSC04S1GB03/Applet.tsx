import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import mouseClick from '../../common/handAnimations/click.json'
import reset from './assets/reset.svg'
import Button, { ButtonState } from './components/Button'
const GeogebraStylized = styled(Geogebra)`
  width: 720px;
  height: 500px;
  z-index: -1;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 40px;
`
const ButtonHolder = styled.div<{ size: number }>`
  position: absolute;
  top: 560px;
  left: 50%;
  translate: -50%;
  width: ${(props) => props.size}%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`
const BottomText = styled.div<{ top: number }>`
  width: 100%;
  position: absolute;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  align-items: center;
  text-align: center;
  top: ${(a) => a.top}px;
`
const Onboarding = styled(Player)<{ top: number; left: number }>`
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  position: absolute;
  pointer-events: none;
`
const PatchForHidingPauseIcon = styled.div`
  background-color: #fff;
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 296px;
`
const ButtonContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 400px;
  height: 90px;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 100px;
  border: 1px solid #646464;
  border-radius: 12px;
  background: none;
  div {
    position: absolute;
    left: 50%;
    translate: -50%;
    top: -12px;
    width: 310px;
    height: 24px;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #1a1a1a;
    background: #ffffff;
  }
  :disabled {
    opacity: 0.3;
  }
`
const ButtonToggle = styled.button<{ highLight: string }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 164px;
  height: 60px;
  background: ${(props) => (props.highLight == 'selected' ? '#f2f2f2' : '#ffffff')};
  border: 1px solid #c7c7c7;
  border-radius: 12px;
  box-shadow: inset 0px -4px 0px #c7c7c7;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #212121;
`
const NextButton = styled.button`
  position: absolute;
  min-width: 100px;
  width: fit-content;
  height: 60px;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  border: none;
  background: #1a1a1a;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 0 15px;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`
const top = [600, 535, 535]
const left = [210, 74, 130]

export const AppletG06NSC04S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [buttonSetHighlight, setButtonSetHighlight] = useState<Array<'none' | 'selected'>>([
    'none',
    'none',
  ])
  const [question, setQuestion] = useState(0)
  const [pageNum, setPageNum] = useState(0)
  const [ggbloaded, setGgbLoaded] = useState(false)
  const [showOnBoard, setShowOnBoard] = useState(false)
  const [nextVis, setNextVis] = useState(true)
  const [currentActiveNum, setCurrentActiveNum] = useState(1)
  const [handPosition, setHandPosition] = useState(0)
  const [buttons, setButtons] = useState([1])
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const playMouseClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [isAnimationRunning, setIsAnimationRunning] = useState(false)
  const onButtonSetHandle = (value: number) => {
    if (!ggbApi.current) return
    setShowOnBoard(false)
    playMouseClick()
    onInteraction('tap')
    setButtonSetHighlight((v) => {
      let d = v
      d = ['none', 'none']
      d[value] = 'selected'
      return d
    })
    if (value == 0) {
      ggbApi.current.setValue('Number', 5)
      setQuestion(5)
      setHandPosition(1)
    } else {
      ggbApi.current.setValue('Number', 7)
      setQuestion(7)
      setHandPosition(2)
    }
  }
  const onGgbReady = useCallback((api: any) => {
    ggbApi.current = api
    if (api == null) return
    setGgbLoaded(true)
    setShowOnBoard(true)
  }, [])
  useEffect(() => {
    const updatedButtons = []
    for (let i = 1; i <= question; i++) {
      updatedButtons.push(i)
    }
    setButtons(updatedButtons)
  }, [question])
  useEffect(() => {
    switch (pageNum) {
      case 0:
        setHandPosition(0)
        setCurrentActiveNum(1)
        setQuestion(0)
        setButtonSetHighlight(['none', 'none'])
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(pic2)')
        break
      case 1:
        setShowOnBoard(true)
        setNextVis(false)
        break
      case 2:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(Next2)')
        break
    }
  }, [pageNum])
  const handleButtonClick = (val: number) => {
    if (!ggbApi.current) return
    setShowOnBoard(false)
    playMouseClick()
    onInteraction('tap')
    setIsAnimationRunning(true)
    ggbApi.current.evalCommand(`StartAnimation(run${val})`)
    setTimeout(
      () => {
        if (currentActiveNum == question) setNextVis(true)
        setIsAnimationRunning(false)
        setCurrentActiveNum((prev) => prev + 1)
      },
      question == 5
        ? currentActiveNum < 5
          ? 3500
          : 1000
        : currentActiveNum < 5
        ? 3700
        : currentActiveNum < 7
        ? 3100
        : 1000,
    )
  }
  const handleCurrentBtnState = (val: number): ButtonState => {
    if (val === currentActiveNum) {
      return isAnimationRunning ? 'selected' : 'default'
    } else if (val < currentActiveNum) {
      return question % val === 0 ? 'Correct' : 'Wrong'
    } else {
      return 'disabled'
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc04-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore divisibility of 5 and 7."
        backgroundColor="#F6F6F6"
        buttonColor="#1a1a1a"
      />
      <GeogebraStylized materialId="anrdf6v3" onApiReady={onGgbReady} />
      <PatchForHidingPauseIcon />
      {pageNum > 0 && (
        <ButtonHolder size={question == 5 ? 80 : 70}>
          {buttons.map((i) => (
            <Button
              key={i}
              onClick={handleButtonClick}
              currentBtnState={handleCurrentBtnState(i)}
              value={i}
            />
          ))}
        </ButtonHolder>
      )}
      {pageNum == 1 &&
        !isAnimationRunning &&
        (currentActiveNum > 1 ? (
          <BottomText top={505}>
            {question + ' is '}
            {question % (currentActiveNum - 1) !== 0 ? 'not' : ''}
            {' exactly divisible by ' + (currentActiveNum - 1) + '.'}
          </BottomText>
        ) : (
          <BottomText top={505}>
            {'Press the numbers one by one to check divisibility by ' + question + '!'}
          </BottomText>
        ))}
      {pageNum == 2 && (
        <BottomText top={505}>
          {question + ' has only ' + (question == 5 ? '2' : 'two') + ' factors : 1 and ' + question}
        </BottomText>
      )}
      {ggbloaded && pageNum == 0 && (
        <ButtonContainer>
          <div>Choose any of the given two numbers</div>
          <ButtonToggle
            highLight={buttonSetHighlight[0]}
            onClick={() => {
              onButtonSetHandle(0)
            }}
          >
            5
          </ButtonToggle>
          <ButtonToggle
            highLight={buttonSetHighlight[1]}
            onClick={() => {
              onButtonSetHandle(1)
            }}
          >
            7
          </ButtonToggle>
        </ButtonContainer>
      )}
      {ggbloaded && nextVis && (
        <NextButton
          disabled={question == 0 ? true : false}
          onClick={() => {
            setPageNum((p) => (p == 2 ? 0 : p + 1))
          }}
        >
          {pageNum < 2 ? 'Next' : <img src={reset} />}
        </NextButton>
      )}
      {showOnBoard && (
        <Onboarding
          src={mouseClick}
          top={top[handPosition]}
          left={left[handPosition]}
          autoplay
          loop
        />
      )}
    </AppletContainer>
  )
}
