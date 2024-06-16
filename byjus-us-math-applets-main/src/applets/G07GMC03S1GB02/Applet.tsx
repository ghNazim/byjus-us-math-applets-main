import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import clickAnimation from '../../common/handAnimations/click.json'
import angleanimation from '../../common/handAnimations/Rotatebothsides.json'
import sliderAnimation from '../../common/handAnimations/slider.json'
import restartimg from './assets/restartbutton.svg'
import nextbuttonpage1 from './assets/startbuttonpage1.svg'

const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: 45.5%;
  top: 41%;
  transform: translate(-50%, -50%);
  scale: 0.92;
`
const NextButtonPage1 = styled.img`
  position: absolute;
  left: 320px;
  top: 735px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 1;
`

const RestartButton = styled.img`
  position: absolute;
  left: 280px;
  top: 735px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 2;
`
const RadioDiv = styled.div<{ left: number; checked: boolean }>`
  box-sizing: border-box;
  padding: 2px;
  position: absolute;
  width: 121px;
  height: 51px;
  left: ${(props) => props.left}px;
  top: 670px;
  background: #ffffff;
  border: 1px solid ${(props) => (props.checked ? '#212121' : '#C7C7C7')};
  ${(props) =>
    props.checked
      ? ''
      : 'box-shadow: 0px 5px 0px #C7C7C7, inset 0px 2px 0px rgba(255, 255, 255, 0.2);'}
  border-radius: 12px;
  cursor: pointer;
`
const RadioInnerDiv = styled.div<{ checked: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  background: ${(props) => (props.checked ? '#C7C7C7' : '#ffffff')};
  border-radius: 8px;
  pointer-events: none;
`
const RadioLabel = styled.label`
  width: 45px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  pointer-events: none;
`
const RadioButton = styled.div<{ checked: boolean }>`
  width: 22px;
  height: 22px;
  border: 2px solid #212121;
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  span {
    width: 12px;
    height: 12px;
    background-color: #212121;
    border-radius: 50%;
    display: ${(props) => (props.checked ? 'block' : 'none')};
    pointer-events: none;
  }
`
const ColorText = styled.span<{ color: string }>`
  display: inline-block;
  color: ${(props) => props.color};
  margin: 0;
  pointer-events: none;
`
const NextButton = styled.button<{ active: boolean }>`
  position: absolute;
  left: 320px;
  top: 735px;
  width: 102px;
  height: 60px;
  background-color: ${(props) => (props.active ? '#1A1A1A' : '#D1D1D1')};
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: ${(props) => (props.active ? 'none' : '1px solid transparent')};
  border-radius: 10px;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  cursor: ${(props) => (props.active ? 'pointer' : 'default')};
  pointer-events: ${(props) => (props.active ? 'auto' : 'none')};
`
const TexWrappper = styled.div`
  position: absolute;
  align-items: center;
  width: 400px;
  height: 40px;
`
const AppletText = styled.h2`
  position: absolute;
  color: var(--monotone-100, #444);
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  left: 90%;
  top: 600px;
  transform: translateX(-50%);
  white-space: nowrap;
  display: flex;
  justify-content: center;
  text-align: center;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 2;
`
export const AppletG07GMC03S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded1] = useState(false)
  const ggb = useRef<GeogebraAppApi | null>(null)
  const [showNextPage1, setShowNextPage1] = useState(true)
  const [showRestartButton, setShowRestartButton] = useState(false)
  const playMouseCLick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [option1, setOption1] = useState(false)
  const [option2, setOption2] = useState(false)
  const onInteraction = useContext(AnalyticsContext)

  const [showRadioButton, setShowRadioButton] = useState(false)
  const [isNextButtonActive, setNextButtonActive] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)

  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showOnboarding3, setShowOnboarding3] = useState(false)
  const [showOnboarding4, setShowOnboarding4] = useState(false)

  const texts = [
    'Follow the steps given for construction of the triangle.',
    '         Choose any of the given side lengths as a base.',
    '                       Join the points to draw the base.',
    '                    Now, let’s proceed to the next step.',
    '                         Measure and mark the angle 30°.',
    '                    Now, let’s proceed to the next step.',
    '                  Mark the vertex C at a length of 4 cm.',
    '                            Join vertex C with vertex B.',
    '         Great! You have constructed the given triangle.',
    '                  Mark the vertex C at a length of 5 cm.',
  ]

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGGBLoaded1(api != null)
  }, [])

  useEffect(() => {
    const api = ggb.current
    if (api != null && ggbLoaded) {
      const onGgb1Client: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'c') {
          playMouseIn()
          setShowOnboarding3(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'pic6') {
          playMouseIn()
          setShowOnboarding3(false)
        } else if (e.type === 'dragEnd' && e.target === 'c') {
          playMouseOut()
          setNextButtonActive(true)
        } else if (e.type === 'dragEnd' && e.target === 'pic6') {
          playMouseOut()
          setNextButtonActive(true)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'k') {
          playMouseIn()
          setShowOnboarding4(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'pointer2R') {
          playMouseIn()
          setShowOnboarding4(false)
        } else if (e.type === 'dragEnd' && (e.target === 'k' || e.target === 'pointer2R')) {
          playMouseOut()
          setNextButtonActive(true)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'q') {
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'q') {
          playMouseOut()
          setNextButtonActive(true)
        } else if (e.type === 'mouseDown' && e.hits[0] === 's_1') {
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 's_1') {
          playMouseOut()
          setNextButtonActive(true)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'e_2') {
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'e_2') {
          playMouseOut()
          setNextButtonActive(true)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'ibutton') {
          playMouseCLick()
        }
      }

      api.registerClientListener(onGgb1Client)

      let pageValue = 0

      api.registerObjectUpdateListener('frame', () => {
        pageValue = api.getValue('frame')
        if (pageValue === 3) {
          setCurrentFrame(3)
        } else if (pageValue === 4) {
          setCurrentFrame(4)
        } else if (pageValue === 5) {
          setCurrentFrame(5)
        } else if (pageValue === 6) {
          if (option1 === true) {
            setCurrentFrame(9)
          } else if (option2 === true) {
            setCurrentFrame(6)
          }
        } else if (pageValue === 7) {
          setCurrentFrame(7)
        } else if (pageValue === 8) {
          setShowRestartButton(true)
          setCurrentFrame(8)
        }
      })
      return () => {
        ggb.current?.unregisterClientListener(onGgb1Client)
        ggb.current?.unregisterObjectUpdateListener('frame')
      }
    }
  }, [ggbLoaded, option1, option2, playMouseCLick, playMouseIn, playMouseOut])

  const handleNextButtonClickPage1 = () => {
    playMouseCLick()
    setShowOnboarding1(false)
    if (ggb.current?.getValue('frame') === 0) {
      ggb.current?.evalCommand('RunClickScript(pic2)')
      setShowNextPage1(false)
      setShowRadioButton(true)
      setNextButtonActive(option1 || option2)
      setCurrentFrame(1)
      setShowOnboarding2(true)
    }
  }

  const handleRestartButtonClick = () => {
    playMouseCLick()
    if (ggb.current?.getValue('frame') === 8) {
      ggb.current?.evalCommand('RunClickScript(button1)')
      ggb.current?.setValue('ins1', 1)
      setShowNextPage1(true)
      setShowRestartButton(false)
      setOption1(false)
      setOption2(false)
      setShowOnboarding1(true)
      setCurrentFrame(0)
    }
  }

  const handleNextButtonClickPage2 = () => {
    playMouseCLick()
    if (ggb.current?.getValue('frame') === 1) {
      ggb.current?.evalCommand('RunClickScript(pic7)')
      setNextButtonActive(false)
      setShowRadioButton(false)
      setShowOnboarding3(true)
      setCurrentFrame(2)
    } else if (ggb.current?.getValue('frame') === 2) {
      ggb.current?.evalCommand('RunClickScript(button2)')
      setNextButtonActive(true)
    } else if (ggb.current?.getValue('frame') === 3) {
      ggb.current?.evalCommand('RunClickScript(button3)')
      setNextButtonActive(false)
      setShowOnboarding4(true)
    } else if (ggb.current?.getValue('frame') === 4) {
      ggb.current?.evalCommand('RunClickScript(button4)')
      setNextButtonActive(true)
    } else if (ggb.current?.getValue('frame') === 5) {
      ggb.current?.evalCommand('RunClickScript(button5)')
      setNextButtonActive(false)
    } else if (ggb.current?.getValue('frame') === 6) {
      ggb.current?.evalCommand('RunClickScript(button6)')
      setNextButtonActive(false)
    } else if (ggb.current?.getValue('frame') === 7) {
      ggb.current?.evalCommand('RunClickScript(button7)')
      setNextButtonActive(false)
    }
  }

  const onClickHandle = (e: any) => {
    playMouseCLick()
    onInteraction('tap')
    let selectedOption = ''
    switch (e.target.id) {
      case '1':
        selectedOption = 'option1'
        ggb.current?.evalCommand('RunClickScript(pic16)')
        setShowOnboarding2(false)
        break
      case '2':
        selectedOption = 'option2'
        ggb.current?.evalCommand('RunClickScript(pic17)')
        setShowOnboarding2(false)

        break
    }

    if (selectedOption === 'option1') {
      setOption1((prevOption1) => {
        const newOption1 = !prevOption1
        setOption2(false)
        setNextButtonActive(newOption1)

        return newOption1
      })
    } else if (selectedOption === 'option2') {
      setOption2((prevOption2) => {
        const newOption2 = !prevOption2
        setOption1(false)
        setNextButtonActive(newOption2)
        return newOption2
      })
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc03-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Construct a triangle with sides of length 4 cm and 5 cm with an included angle of 30°."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />

      <GeogebraContainer materialId="qff8vfqx" top={70} left={0} onApiReady={onGGBLoaded} />

      {showNextPage1 && ggbLoaded && (
        <>
          <NextButtonPage1
            src={nextbuttonpage1}
            onClick={handleNextButtonClickPage1}
          ></NextButtonPage1>
        </>
      )}
      {showRestartButton && (
        <RestartButton src={restartimg} onClick={handleRestartButtonClick}></RestartButton>
      )}
      {ggbLoaded && (
        <NextButton active={isNextButtonActive} onClick={handleNextButtonClickPage2}>
          Next
        </NextButton>
      )}
      {showRadioButton && (
        <>
          <RadioDiv left={235} checked={option1} id={'1'} onClick={onClickHandle}>
            <RadioInnerDiv checked={option1}>
              <RadioButton checked={option1}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>4 cm</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
          <RadioDiv left={385} checked={option2} id={'2'} onClick={onClickHandle}>
            <RadioInnerDiv checked={option2}>
              <RadioButton checked={option2}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>5 cm</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
        </>
      )}
      {ggbLoaded && (
        <TexWrappper>
          <AppletText>{texts[currentFrame]}</AppletText>
        </TexWrappper>
      )}
      {showOnboarding1 && ggbLoaded && (
        <>
          <OnboardingAnimationContainer left={300} top={700} src={clickAnimation} loop autoplay />
        </>
      )}
      {showOnboarding2 && (
        <>
          <OnboardingAnimationContainer left={230} top={640} src={clickAnimation} loop autoplay />
        </>
      )}
      {showOnboarding3 && (
        <>
          <OnboardingAnimationContainer left={195} top={385} src={sliderAnimation} loop autoplay />
        </>
      )}
      {showOnboarding4 && (
        <>
          <OnboardingAnimationContainer left={60} top={225} src={angleanimation} loop autoplay />
        </>
      )}
    </AppletContainer>
  )
}
