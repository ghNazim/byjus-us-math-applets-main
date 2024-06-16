import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { ClientListener, GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import ClickAnimation from '../../common/handAnimations/click.json'
import HorizontalHandAnim from '../../common/handAnimations/moveHorizontally.json'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { RestartButton } from './Buttons/Buttons'

const GeogebraHolder = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 32px;
  width: 700px;
  height: 650px;
  overflow: hidden;
  /* border: 1px solid black; */
`

const fadein = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const primaryColor = '#cf8b04'
const secondaryColor = '#2ad3f5'

const BoxForEachSlider = styled.div`
  position: absolute;
  width: 260px;
  height: 112px;
  pointer-events: none;
  background: ${(props) => props.color};
  border-radius: 9px;
  display: flex;
  flex-direction: column-reverse;
`

const TitleText = styled.div`
  position: absolute;
  font-family: 'Nunito';
  font-size: 20px;
  z-index: 12;
  padding: 0 140px;
  color: #b3b1b1;
`

const Valuelabel = styled.div`
  font-family: 'Nunito';
  display: flex;
  justify-content: center;
  align-items: center;
  color: #646464;
  text-align: center;
  font-size: 20px;
  margin: 8px 0;
`

const ColoredBg = styled.span`
  background-color: ${(props) => props.color};
  padding: 4px 21px;
  border-radius: 6px;
  margin: 0 6px;
`

const ColoredText = styled.span<{ show?: boolean }>`
  color: ${(props) => props.color};
  margin: 0 4px;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${fadein} 1s ease-in-out;

  opacity: ${(props) => (props.show ? 1 : 0)};
`

ColoredText.defaultProps = { show: true }

const Button = styled.div<{ isActive: boolean; borderColor?: string; fontColor?: string }>`
  opacity: ${(props) => (props.isActive ? '1' : '.2')};
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 8px 36px;
  font-size: 20px;
  position: absolute;
  margin: 0 auto;
  bottom: 32px;
  background: ${(props) => props.color};
  border: ${(props) => `1px solid ${props.borderColor}`};
  border-radius: 10px;
  cursor: ${(props) => (props.isActive ? 'pointer' : 'default')};
  color: ${(props) => props.fontColor};
`

const AnimatedDiv = styled.div<{ show: boolean }>`
  opacity: 0;
  animation: ${fadein} 1s ease-in-out;

  opacity: ${(props) => (props.show ? 1 : 0)};
`

export const AppletG06EEC03GB01: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [initialValue1, setInitialValue1] = useState<number>(0.5)
  const [initialValue2, setInitialValue2] = useState<number>(0.5)
  const [coords, setCoords] = useState<number[]>([0, 0])
  const [value1, setValue1] = useState(1)
  const [value2, setValue2] = useState(1)
  const [showAddBtn, setShowAddBtn] = useState(false)
  const [showResetBtn, setShowResetBtn] = useState(false)
  const [isSecondSliderActive, setIsSecondSliderActive] = useState(false)
  const [onboardingAnimation, setOnboardingAnimation] = useState([true, true])
  const [showAnswer, setShowAnswer] = useState(false)
  const [showFinalText1, setShowFinalText1] = useState(false)
  const [showFinalText2, setShowFinalText2] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')

  //for the sliders inside ggb
  const [slideU1, setSliderU1] = useState(0)
  const [slideU2, setSliderU2] = useState(0)
  const [slideV1, setSliderV1] = useState(0)
  const [slideV2, setSliderV2] = useState(0)

  const snap = (initialValue: number, value: number, intervel: number) => {
    const val =
      (value - initialValue) % intervel !== 0
        ? Math.round(value - initialValue) + initialValue
        : value
    return val
  }

  const snapPoints = () => {
    if (ggbApi.current) {
      ggbApi.current.setCoords(
        'I',
        snap(initialValue1, ggbApi.current.getXcoord('I'), 1),
        coords[1],
      )
      ggbApi.current.setCoords(
        'J',
        snap(initialValue2, ggbApi.current.getXcoord('J'), 1),
        coords[1],
      )
    }
  }

  //instant values are differnt for both
  const fetchInitialValues = () => {
    if (ggbApi.current) {
      setInitialValue1(ggbApi.current.getXcoord('I'))
      setInitialValue2(ggbApi.current.getXcoord('J'))
    }
  }

  useEffect(() => {
    if (value1 !== 1 && onboardingAnimation[0]) setOnboardingAnimation([false, true])
    if (value2 !== 1 && onboardingAnimation[1]) setOnboardingAnimation([false, false])
  }, [value1, value2])

  const fetchValues = () => {
    if (ggbApi.current) {
      snapPoints()
      const newValue1 = ggbApi.current.getXcoord('I')
      const newValue2 = ggbApi.current.getXcoord('J')
      setValue1(newValue1 + 0.5)
      setValue2(newValue2 - 5.5)
      if (newValue2 !== 6.5) setShowAddBtn(true)
    }
  }

  const releaseSecondSlider = () => {
    if (ggbApi.current) {
      ggbApi.current.setColor('J', 127, 92, 244)
      ggbApi.current.setFixed('J', false, true)
    }
  }

  const disableSecondSlider = () => {
    ggbApi.current?.setColor('J', 179, 177, 177)
    ggbApi.current?.setFixed('J', false, false)
    setIsSecondSliderActive(false)
  }

  const handleGGBReady = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api

    if (api == null) return
    setGgbLoaded(true)
  }, [])

  const onClient: ClientListener = (e) => {
    if (e.type === 'mouseDown') playMouseIn()
    if (e.type === 'dragEnd') {
      fetchValues()
      playMouseOut()
    }
  }

  useEffect(() => {
    //setting initital values
    if (ggbLoaded) {
      fetchInitialValues()
      disableSecondSlider()
      ggbApi.current?.registerClientListener(onClient)
      return () => {
        ggbApi.current?.unregisterClientListener(onClient)
      }
    }
  }, [ggbLoaded])

  const getSliderValues = () => {
    if (ggbApi.current) {
      const api = ggbApi.current
      setSliderU1((prevVal) => (prevVal !== 1 ? api.getValue('u1') : 1))
      setSliderU2((prevVal) => (prevVal !== 1 ? api.getValue('u2') : 1))
      setSliderV1((prevVal) => (prevVal !== 1 ? api.getValue('v1') : 1))
      setSliderV2((prevVal) => (prevVal !== 1 ? api.getValue('v2') : 1))
    }
  }

  let getSliderVal: ReturnType<typeof setInterval> | null = null

  const triggerAnimation = () => {
    playMouseCLick()
    setShowAddBtn(false)
    if (ggbApi.current) {
      const api = ggbApi.current
      api.evalCommand('StartAnimation(u1,true)')
      api.setVisible('I', false)
      api.setVisible('J', false)

      getSliderVal = setInterval(function () {
        getSliderValues()
      }, 300)
    }
  }

  useEffect(() => {
    if (slideV2 === 1) {
      getSliderVal !== null ? clearInterval(getSliderVal) : undefined
      setTimeout(() => setShowAnswer(true), 500)
    }
  }, [slideV2])

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  useEffect(() => {
    const showContent = async () => {
      if (showAnswer) {
        await delay(500)
        setShowFinalText1(true)
        await delay(200)
        setShowFinalText2(true)
        await delay(200)
        setShowResetBtn(true)
      }
    }
    showContent()
  }, [showAnswer])

  const handlereset = () => {
    playMouseCLick()
    if (ggbApi.current) {
      const api = ggbApi.current
      api.setValue('u1', 0)
      api.setValue('u2', 0)
      api.setValue('v1', 0)
      api.setValue('v2', 0)

      api.setVisible('I', true)
      api.setVisible('J', true)

      api.setCoords('I', initialValue1, coords[1])
      api.setCoords('J', initialValue2, coords[1])

      setValue1(1)
      setValue2(1)

      setSliderU1(0)
      setSliderU2(0)
      setSliderV1(0)
      setSliderV2(0)

      setShowResetBtn(false)
      disableSecondSlider()
      setOnboardingAnimation([true, true])
      setShowAnswer(false)
      setShowFinalText1(false)
      setShowFinalText2(false)
    }
  }

  useEffect(() => {
    if (value1 !== 1 && !isSecondSliderActive) {
      releaseSecondSlider()
      setIsSecondSliderActive(true)
    }
  }, [value1])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'G06EEC03GB01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Modify the length of the strips and join them in different ways to understand the commutative property of addition."
        backgroundColor=" #F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraHolder>
        <Geogebra materialId="bjtahmd3" onApiReady={handleGGBReady} />
      </GeogebraHolder>
      {ggbLoaded ? (
        <>
          <BoxForEachSlider
            color="rgba(255, 191, 0, 0.15)"
            style={{
              left: '87px',
              top: '550px',
              border: '1px solid rgba(240, 160, 0, 0.5)',
            }}
          >
            {onboardingAnimation[0] ? (
              <Player
                src={HorizontalHandAnim}
                loop
                autoplay
                style={{
                  position: 'absolute',
                  left: '-130px',
                  top: '-10px',
                }}
              />
            ) : undefined}
            <Valuelabel>
              <ColoredText color={primaryColor}> a </ColoredText> ={' '}
              <ColoredBg color="#FFEDB8">{value1}</ColoredBg>
            </Valuelabel>
          </BoxForEachSlider>

          <BoxForEachSlider
            color="rgba(42, 211, 245, 0.12)"
            style={{
              right: '98px',
              top: '550px',
              border: '1px solid #2AD3F5',
            }}
          >
            {onboardingAnimation[1] && !onboardingAnimation[0] ? (
              <Player
                src={HorizontalHandAnim}
                loop
                autoplay
                style={{
                  position: 'absolute',
                  left: '-130px',
                  top: '-10px',
                }}
              />
            ) : undefined}

            <Valuelabel>
              <ColoredText color={secondaryColor}> b </ColoredText> ={' '}
              <ColoredBg color="#D1F7FF">{value2}</ColoredBg>
            </Valuelabel>
          </BoxForEachSlider>

          <TitleText style={{ top: '170px' }}>
            <ColoredText color={slideU1 === 1 ? primaryColor : '#B3B1B1'}>a</ColoredText>
            <ColoredText color={slideU1 === 1 ? '#444' : '#B3B1B1'}>+</ColoredText>
            <ColoredText color={slideU2 === 1 ? secondaryColor : '#B3B1B1'}>b</ColoredText>
            {showAnswer ? (
              <ColoredText show={showAnswer} color="#444">
                = {value1 + value2}
              </ColoredText>
            ) : undefined}
          </TitleText>

          <TitleText style={{ top: '305px' }}>
            <ColoredText color={slideV1 === 1 ? secondaryColor : '#B3B1B1'}>b</ColoredText>
            <ColoredText color={slideV1 === 1 ? '#444' : '#B3B1B1'}>+</ColoredText>
            <ColoredText color={slideV2 === 1 ? primaryColor : '#B3B1B1'}>a</ColoredText>
            {showAnswer ? (
              <ColoredText show={showAnswer} color="#444">
                = {value1 + value2}
              </ColoredText>
            ) : undefined}
          </TitleText>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              color=" #1A1A1A"
              isActive={showAddBtn}
              onClick={showAddBtn ? triggerAnimation : undefined}
              fontColor=" #FFFFFF"
            >
              Add
            </Button>
          </div>
          {showAddBtn ? (
            <Player
              src={ClickAnimation}
              loop
              autoplay
              style={{
                position: 'absolute',
                left: '280px',
                bottom: '-50px',
                pointerEvents: 'none',
              }}
            />
          ) : undefined}
          {showFinalText1 && (
            <AnimatedDiv
              show={showFinalText1}
              style={{
                top: '410px',
                color: '#646464',
                textAlign: 'center',
                position: 'absolute',
                fontFamily: 'Nunito',
                fontSize: '20px',
                width: '100%',
              }}
            >
              <ColoredBg
                color="#FFF2F2"
                style={{
                  width: '300px',
                  height: '43px',
                  // padding: 'auto 15px',
                  margin: '0px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ textAlign: 'center', width: '120px' }}>
                  <ColoredText color="#F57A7A">Arithmetic</ColoredText>
                </div>
                <div>
                  <ColoredText color={primaryColor}>{value1}</ColoredText>+
                  <ColoredText color={secondaryColor}>{value2}</ColoredText>&nbsp;=&nbsp;
                  <ColoredText color={secondaryColor}>{value2}</ColoredText>+
                  <ColoredText color={primaryColor}>{value1}</ColoredText>
                </div>
              </ColoredBg>
              {showFinalText2 && (
                <AnimatedDiv show={showFinalText2} style={{ marginTop: '20px' }}>
                  <ColoredBg
                    color="#FFF2F2"
                    style={{
                      width: '300px',
                      height: '43px',
                      padding: 'auto 15px',
                      margin: '0px auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ textAlign: 'center', width: '120px' }}>
                      <ColoredText color="#F57A7A">Algebra </ColoredText>
                    </div>
                    <div>
                      <ColoredText color={primaryColor}>a</ColoredText>+
                      <ColoredText color={secondaryColor}>b</ColoredText>&nbsp;=&nbsp;
                      <ColoredText color={secondaryColor}>b</ColoredText>+
                      <ColoredText color={primaryColor}>a</ColoredText>
                    </div>
                  </ColoredBg>
                </AnimatedDiv>
              )}
            </AnimatedDiv>
          )}
          {showResetBtn ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'absolute',
                bottom: '32px',
                width: '100%',
              }}
            >
              <RestartButton onClick={handlereset} />
            </div>
          ) : undefined}
        </>
      ) : undefined}
    </AppletContainer>
  )
}
