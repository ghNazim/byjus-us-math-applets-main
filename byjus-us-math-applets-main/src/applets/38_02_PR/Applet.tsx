import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { ClientListener, GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import clickDrag from '../../common/handAnimations/moveRight.json'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import correct from './Assets/correct.mp3'
import cross from './Assets/cross.png'
import disclaimer from './Assets/disclaimer.svg'
import incorrect from './Assets/incorrect.wav'
import Blast from './Assets/TickAnimation.json'
import tryNewSymb from './Assets/tryNewSymb.svg'
import { Select } from './Select'

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  top: 100px;
  left: 359px;
  translate: -50%;
`
const Cross = styled.img`
  position: absolute;
  top: -11px;
  right: 23px;
  cursor: pointer;
`
const Disclaimer = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  display: block;
`

const AnimOnBoarding = styled(Player)`
  position: absolute;
  top: 93px;
  left: -165px;
  pointer-events: none;
`
const TryNewSymbol = styled.img`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 9px 10px;

  position: absolute;
  width: 45px;
  height: 45px;
  left: 290px;
  top: 715px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
`

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
const AnswerInputContainer = styled.div`
  position: absolute;
  top: 530px;
  left: 140px;
  display: flex;
  flex-direction: row;
  gap: 20px;
`

const AnswerInputLabel = styled.p`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: #646464;
`

const PopUpBG = styled.div`
  position: absolute;
  width: 100%;
  height: 98%;
  background: rgba(0, 0, 0, 0.3);
  top: 0px;
  z-index: 1;
  border-radius: 20px;
`

const answerStateColors = {
  default: '#81B3FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  disable: '#c7c7c7',
}

const answerFillColors = {
  default: ' rgba(232, 240, 254, 0.1)',
  right: 'rgba(133, 204, 41, 0.1)',
  wrong: 'rgba(245, 122, 122, 0.1)',
  disable: 'rgba(246, 246, 246, 0.1)',
}

const AnswerInputBorder = styled.div<{ state: keyof typeof answerStateColors }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 13px 8px 13px 36px;
  gap: 8px;
  border: 3px solid ${(props) => answerStateColors[props.state]};
  background-color: ${(props) => answerFillColors[props.state]};
  transition: 0.1s;
  border-radius: 15px;
`

const AnswerInput = styled.input.attrs(() => ({
  type: 'text',
  placeholder: '?',
}))`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 34px;
  color: #444444;

  background-color: transparent;
  border: 0;

  max-width: 80px;

  &:focus {
    outline: 0;
  }
`
const AnimationPlayer = styled(Player)`
  position: absolute;
  top: 130px;
  left: 100px;
`

const PopUp = styled.div`
  position: absolute;
  width: 100%;
  height: -moz-fit-content;
  height: -webkit-fit-content;
  height: -fit-content;
  background-color: #ffffff;
  bottom: -2px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Button = styled.button`
  position: absolute;
  width: 160px;
  height: 60px;
  left: 50%;
  translate: -50%;
  bottom: 32px;
  border: none;
  background: #8c69ff;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;
  align-items: center;
  display: flex;
  justify-content: center;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
  &:hover {
    background: #7f5cf4;
  }
  &:active {
    background: #6549c2;
  }
`
const PopText = styled.div`
  width: 85%;
  margin: 80px 0;
  p {
    margin: 0;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    text-align: left;
    color: #444444;
  }
`

const options = ['cm', 'mm', 'in'] as const
const answer = [4, 45, 20, 7, 5, 6, 8]
const convAnswers = [40, 45, 20, 70, 127, 152.4, 203.2]
const altAnswer = [40, 45, 2, 70, 127]
const altUnits = ['mm', 'mm', 'cm', 'mm', 'mm']
const answerUnits = ['cm', 'mm', 'mm', 'cm', 'in', 'in', 'in']
const SnapCoord = [4.26, 4.79, 2.14, 7.42, 13.18, 15.79, 21.06]
const objectNames = ['Key', 'Eraser', 'Paper Clip', 'Pencil', 'Fork', 'Comb', 'Hammer']

export const Applet3802Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [answerState, setAnswerState] = useState<keyof typeof answerStateColors>('default')
  const [imageIndex, setImageIndex] = useState(0)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [inputValue, setInputValue] = useState<number | '' | undefined>()
  const [unit, setUnit] = useState<(typeof options)[number]>()
  const [checkButtonDisable, setCheckButtonDisable] = useState(false)
  const [showTryNewButton, setShowTryNewButton] = useState(false)
  const [showTickAnimation, setShowTickAnimation] = useState(false)
  const [showPopUp, setShowPopUp] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const [errorText, setErrorText] = useState(' ')
  const [inVal, setInVal] = useState(0)
  const playCorrect = useSFX('correct')
  const playIncorrect = useSFX('incorrect')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseClick = useSFX('mouseClick')
  const [onBoardAnim, setOnBoardAnim] = useState(true)
  const [tryNewClickCheck, setTryNewClickCheck] = useState(false)

  const onGGBReady = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return
    setGGBLoaded(true)
  }, [])

  const onImageChange = useCallback(
    () => ggbApi.current && setImageIndex(ggbApi.current.getValue('Images')),
    [],
  )

  useEffect(() => {
    if (showTickAnimation) {
      setCheckButtonDisable(true)
      setShowTryNewButton(false)
    }
  }, [showTickAnimation])

  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('Images', onImageChange)
      return () => ggbApi.current?.unregisterObjectUpdateListener('Images')
    }
  }, [ggbLoaded, onImageChange])

  const onGGBClientEvent: ClientListener = useCallback(
    (event) => {
      if (event.type === 'mouseDown' && event.hits[0] === 'E') {
        playMouseIn()
        setOnBoardAnim(false)
      } else if (event.type === 'dragEnd' && event.target === 'E') {
        playMouseOut()
        const isInSnapRange = ggbApi.current?.getValue('boolean')
        if (isInSnapRange) ggbApi.current?.setCoords('E', SnapCoord[imageIndex], 10)
      }
    },
    [imageIndex, playMouseIn, playMouseOut],
  )

  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerClientListener(onGGBClientEvent)
      return () => ggbApi.current?.unregisterClientListener(onGGBClientEvent)
    }
  }, [ggbLoaded, onGGBClientEvent])

  const onCheckClick = () => {
    playMouseClick()
    if (inputValue && !isNaN(inputValue)) {
      if (
        (inputValue === answer[imageIndex] && unit === answerUnits[imageIndex]) ||
        (inputValue === altAnswer[imageIndex] && unit === altUnits[imageIndex])
      ) {
        setAnswerState('right')
        playCorrect()
        setShowTryNewButton(true)
        setShowTickAnimation(true)
      } else {
        playIncorrect()
        setAnswerState('wrong')
        setShowPopUp(true)
      }
    }
  }

  const playerHandle = (event: any) => {
    if (event == 'complete') {
      setShowTickAnimation(false)

      setShowTryNewButton(true)
      setCheckButtonDisable(false)
    }
  }

  const onTryNewClick = useCallback(() => {
    setTryNewClickCheck(true)
    setUnit(undefined)
    setInputValue('')
    playMouseClick()
    setImageIndex((v) => (v < 6 ? v + 1 : 0))
    setShowTryNewButton(false)
  }, [playMouseClick])

  useEffect(() => {
    if (onBoardAnim) setAnswerState('disable')
    else setAnswerState('default')
  }, [ggbLoaded, onBoardAnim])

  useEffect(() => {
    if (tryNewClickCheck) {
      setAnswerState('default')
      ggbApi.current?.setValue('Images', imageIndex)
      if (imageIndex < 4) {
        ggbApi.current?.setValue('Scale', 0)
      } else if (imageIndex >= 4 && imageIndex <= 7) {
        ggbApi.current?.setValue('Images', imageIndex)
        ggbApi.current?.setValue('Scale', 1)
      }
    }
  }, [imageIndex, tryNewClickCheck])

  useEffect(() => {
    if (inputValue) {
      setAnswerState('default')
    }
  }, [inputValue])

  useEffect(() => {
    setCheckButtonDisable(
      unit == null || unit == undefined || inputValue == null || isNaN(+inputValue),
    )
  }, [inputValue, unit])

  useEffect(() => {
    if (inputValue == null || inputValue === '') return
    if (unit === 'cm') setInVal(inputValue * 10)
    else if (unit === 'in') setInVal(inputValue * 25.4)
    else if (unit === 'mm') setInVal(inputValue)
  }, [inputValue, unit])

  useEffect(() => {
    setErrorText(
      inVal < convAnswers[imageIndex]
        ? `The ${objectNames[imageIndex]} is longer than `
        : `The ${objectNames[imageIndex]} is shorter than `,
    )
  }, [imageIndex, inVal, inputValue])

  const popCloseHandle = () => {
    setUnit(undefined)
    setInputValue('')
    setAnswerState('default')
    playMouseClick()
    onInteraction('tap')
    setShowPopUp(false)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FFF6DB',
        id: '38_02_PR',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text={`Use the ruler to measure length of the ${objectNames[imageIndex]}`}
        backgroundColor="#FFF6DB"
        buttonColor="#FFDC73"
        hideButton={true}
      />
      <StyledGeogebra materialId={'hjyf7apr'} width={720} height={500} onApiReady={onGGBReady} />
      {ggbLoaded && (
        <AnswerInputContainer>
          <AnswerInputLabel>
            Length of the <span style={{ color: '#CF8B04' }}>{objectNames[imageIndex]}</span> =
          </AnswerInputLabel>
          <AnswerInputBorder state={answerState}>
            <AnswerInput
              value={inputValue}
              onChange={(e) =>
                setInputValue(e.currentTarget.value ? +e.currentTarget.value : undefined)
              }
              disabled={showTryNewButton || onBoardAnim}
            />
            <Select
              options={options}
              onValueChange={setUnit}
              state={answerState}
              onBoardAnimCheck={onBoardAnim}
            />
          </AnswerInputBorder>
        </AnswerInputContainer>
      )}
      <CheckButton onClick={onCheckClick} disabled={!ggbLoaded || checkButtonDisable}>
        Check
      </CheckButton>
      {showTryNewButton && <TryNewButton onClick={onTryNewClick}>Try New</TryNewButton>}
      {showTryNewButton && <TryNewSymbol src={tryNewSymb}></TryNewSymbol>}
      {showTickAnimation && <AnimationPlayer src={Blast} onEvent={playerHandle} autoplay />}
      {showPopUp && (
        <PopUpBG>
          <PopUp>
            <Disclaimer src={disclaimer} />
            <Cross src={cross} onClick={popCloseHandle} />
            <PopText>
              <p>
                {errorText}
                <span style={{ fontWeight: 'bold' }}>{inputValue}</span>{' '}
                <span style={{ fontWeight: 'bold', color: '#81B3FF' }}>{unit}</span>. Try again!
              </p>
            </PopText>
            <Button
              style={{
                height: '40px',
                width: '100px',
                fontSize: '16px',
                lineHeight: '24px',
                bottom: '0px',
              }}
              onClick={popCloseHandle}
            >
              Got it
            </Button>
          </PopUp>
        </PopUpBG>
      )}
      {ggbLoaded && onBoardAnim && <AnimOnBoarding src={clickDrag} loop autoplay />}
    </AppletContainer>
  )
}
