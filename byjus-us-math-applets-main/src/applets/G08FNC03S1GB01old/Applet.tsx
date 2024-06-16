import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Stage, useTransition } from 'transition-hook'
import useSound from 'use-sound'

import { click } from '@/assets/onboarding'
import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import tooltip1 from './assets/⭐ Tooltip_1.svg'
import tooltip2 from './assets/⭐ Tooltip_2.svg'
import tooltip3 from './assets/⭐ Tooltip_3.svg'
import arrow from './assets/arrow.svg'
import both from './assets/both.mp3'
import minus2 from './assets/minus2x.json'
import muteBtn from './assets/muteBtn.svg'
import plot from './assets/plot.svg'
import plus2 from './assets/plus2x.json'
import trynew from './assets/trynew.svg'
import unmuteBtn from './assets/unmuteBtn.svg'
import zero from './assets/zero.json'

const HelperText = styled.div`
  display: flex;
  width: 650px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  position: absolute;
  top: 640px;
  left: 50%;
  translate: -50%;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`
const BlueBG = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  translate: -50%;
  width: 680px;
  height: 520px;
  background-color: #e7fbff;
`
const EquationContainer = styled.div`
  position: absolute;
  top: 220px;
  left: 50%;
  translate: -50%;
  width: 680px;
  display: flex;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`
const EquationPartOne = styled.div`
  width: 95px;
  display: flex;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 60px;
  span {
    font-family: Brioso Pro;
    font-style: italic;
  }
`
const EquationPartTwo = styled.div`
  width: 60px;
  display: flex;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 60px;
  span {
    font-family: Brioso Pro;
    font-style: italic;
    margin: 0 5px;
  }
`
const OptionsContainer = styled.button<{ stage: Stage }>`
  position: absolute;
  top: -130%;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  display: flex;
  padding: 12px;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  border: none;
  background: #c7c7c7;
  opacity: ${(props) => (props.stage !== 'enter' ? 0 : 1)};
  transition: opacity 350ms;
  z-index: 1;
  ::after {
    content: ' ';
    position: absolute;
    left: 50%;
    translate: -50%;
    top: 99%;
    border-bottom: none;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    border-top: 8px solid #c7c7c7;
  }
`
const Option = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 10px;
  border-radius: 8px;
  border: none;
  width: 44px;
  height: 44px;
  font-family: 'Nunito';
  background: #ffffff;
  color: #646464;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  cursor: pointer;
  :hover {
    background: #1a1a1a;
    color: #fff;
  }
`
const Box = styled.div<{ top: number; left: number }>`
  width: 122px;
  display: flex;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #1a1a1a;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  border-radius: 12px;
  border: 1px solid #1a1a1a;
  background: #fff;
  cursor: pointer;
  position: relative;
`
const SelectedNumber = styled.div`
  width: 77px;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #444;
  text-align: center;
  color: #1a1a1a;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 52px;
`
const ButtonElement = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  background: #1a1a1a;
  border-radius: 10px;
  height: 60px;
  cursor: pointer;
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`
const PlacedSlider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 550px;
`
const PlayerContainer = styled(Player)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 100px;
  width: 680px;
  height: 520px;
`
const ClickPlayer = styled(Player)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 200px;
  pointer-events: none;
`
const Tooltip = styled.img<{ top: number; left: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
`
const SpeakerDiv = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`
const SpeakerButton = styled.img`
  cursor: pointer;
  z-index: 1;
`
const RippleContainer = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  left: -50%;
`
const ripple = keyframes`
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`
const Ripple = styled.span`
  position: absolute;
  width: 50px;
  height: 50px;
  opacity: 0;
  border-radius: 50px;
  animation: ${ripple} 1s infinite;
  background-color: #000000;
  :nth-child(2) {
    animation-delay: 0.5s;
  }
`
const Text = styled.div`
  margin-top: 10px;
  max-width: 570px;
`
const ColoredSpan = styled.span<{ bgColor: string; color: string; fontStyle: string }>`
  background-color: ${(p) => p.bgColor};
  color: ${(p) => p.color};
  font-family: ${(p) => p.fontStyle};
  margin: 0 5px;
  padding: 0 5px;
  border-radius: 5px;
`
const playerSrc = [minus2, zero, plus2]
const tooltips = [tooltip1, tooltip2, tooltip3]
const leftVal = [125, 488, 412]
const topVal = [205, 228, 205]
export const AppletG08FNC03S1GB01old: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [displayDropDown, setDisplayDropDown] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const [coefficient, setCoefficient] = useState(-5)
  const [option, setOption] = useState(-1)
  const [pageNum, setPageNum] = useState(0)
  const { stage } = useTransition(displayDropDown, 350)
  const [nextDisabled, setNextDisabled] = useState(true)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const playerRef = useRef<Player>(null)
  // const [isPlaying, setIsPlaying] = useState(false)
  // const [audioPlay, setAudioPlay] = useState(true)
  // const checkPlay = {
  //   onplay: () => {
  //     setIsPlaying(true)
  //   },
  //   onend: () => {
  //     setIsPlaying(false)
  //   },
  // }
  // const [playSelect, stopSelect] = useSound(both, checkPlay)
  // const [playDecreasing, stopDecreasing] = useSound(both, checkPlay)
  // const [playIncreasing, stopIncreasing] = useSound(both, checkPlay)
  // const [playConstant, stopConstant] = useSound(both, checkPlay)
  // useEffect(() => {
  //   stopSelect.stop()
  //   stopIncreasing.stop()
  //   stopDecreasing.stop()
  //   stopConstant.stop()
  //   if (audioPlay) {
  //     switch (pageNum) {
  //       case 0:
  //         playSelect()
  //         break
  //       case 1:
  //         if (!nextDisabled) {
  //           switch (option) {
  //             case 0:
  //               playDecreasing()
  //               break
  //             case 1:
  //               playConstant()
  //               break
  //             case 2:
  //               playIncreasing()
  //               break
  //           }
  //         }
  //         break
  //     }
  //   } else {
  //     setIsPlaying(false)
  //   }
  // }, [pageNum, nextDisabled, audioPlay, playSelect])
  useEffect(() => {
    switch (pageNum) {
      case 0:
        if (coefficient != -5) setNextDisabled(false)
        else setNextDisabled(true)
        break
      case 1:
        setNextDisabled(true)
        break
    }
  }, [pageNum, coefficient])
  const onNextHandle = () => {
    if (pageNum == 0) setPageNum(1)
    else {
      setPageNum(0)
      setCoefficient(-5)
      setOption(-1)
      setShowHandPointer(true)
    }
  }
  const onChangeHandle = (value: number) => {
    if (value == 100) setNextDisabled(false)
    playerRef.current?.setSeeker(value * 1.8)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-fnc03-s1-gb01old',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Discover the characteristics of increasing, decreasing, and constant functions based on their equations."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      {pageNum == 0 && (
        <BlueBG>
          <EquationContainer>
            <EquationPartOne>
              <span>y</span> &nbsp;
              {'= f('}
              <span>x</span>
              {') = '}
            </EquationPartOne>
            <Box
              top={30}
              left={0}
              onClick={() => {
                setShowHandPointer(false)
                onInteraction('tap')
                playClick()
                if (!displayDropDown) {
                  setDisplayDropDown(true)
                } else setDisplayDropDown(false)
              }}
            >
              <SelectedNumber> {coefficient !== -5 && coefficient}</SelectedNumber>
              <img src={arrow} />
              {displayDropDown && (
                <OptionsContainer stage={stage}>
                  <Option
                    onClick={() => {
                      setCoefficient(-2)
                      setOption(0)
                    }}
                  >
                    -2
                  </Option>
                  <Option
                    onClick={() => {
                      setCoefficient(0)
                      setOption(1)
                    }}
                  >
                    0
                  </Option>
                  <Option
                    onClick={() => {
                      setCoefficient(2)
                      setOption(2)
                    }}
                  >
                    2
                  </Option>
                </OptionsContainer>
              )}
            </Box>
            <EquationPartTwo>
              <span>x</span>
              {' + 1'}
            </EquationPartTwo>
          </EquationContainer>
          {showHandPointer && <ClickPlayer src={click} autoplay loop />}
        </BlueBG>
      )}
      {pageNum == 1 && <PlayerContainer src={playerSrc[option]} ref={playerRef} />}
      {pageNum == 1 && (
        <Tooltip src={tooltips[option]} top={topVal[option]} left={leftVal[option]} />
      )}
      {pageNum == 1 && <PlacedSlider min={0} max={81} onChangePercent={onChangeHandle} />}
      {(pageNum == 0 || !nextDisabled) && (
        <HelperText>
          {/* <SpeakerDiv>
            {isPlaying && (
              <RippleContainer>
                <Ripple />
                <Ripple />
              </RippleContainer>
            )}
            <SpeakerButton
              src={audioPlay ? muteBtn : unmuteBtn}
              onClick={() => {
                setAudioPlay((d) => !d)
              }}
            />
          </SpeakerDiv> */}
          <Text>
            {pageNum == 0 && 'Select the slope and plot its graph.'}
            {pageNum == 1 && !nextDisabled && (
              <>
                The value of
                <ColoredSpan bgColor="#FFF2E5" color="#FF8F1F" fontStyle="Brioso Pro">
                  y
                </ColoredSpan>
                {option == 0
                  ? 'decreases with increase in value of'
                  : option == 2
                  ? 'increases with increase in value of'
                  : 'is constant with increase in value of'}
                <ColoredSpan bgColor="#FAF2FF" color="#AA5EE0" fontStyle="Brioso Pro">
                  x
                </ColoredSpan>
                . It is a
                <ColoredSpan bgColor="#686868" color="#F6F6F6" fontStyle="Nunito">
                  {option == 0
                    ? 'decreasing function.'
                    : option == 2
                    ? 'increasing function.'
                    : 'constant function.'}
                </ColoredSpan>
              </>
            )}
          </Text>
        </HelperText>
      )}
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {pageNum == 0 && <img src={plot} />}
        {pageNum == 1 && <img src={trynew} />}
      </ButtonElement>
    </AppletContainer>
  )
}
