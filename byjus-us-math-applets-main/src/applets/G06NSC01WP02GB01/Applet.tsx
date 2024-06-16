import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Stage, useTransition } from 'transition-hook'
import useSound from 'use-sound'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import both from './assets/both.mp3'
import continueAud from './assets/continue.mp3'
import great from './assets/great.mp3'
import muteBtn from './assets/muteBtn.svg'
import resetIcon from './assets/resetIcon.svg'
import select from './assets/select.mp3'
import unmuteBtn from './assets/unmuteBtn.svg'
const BlueBG = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  translate: -50%;
  width: 680px;
  height: 520px;
  background-color: #f1fdff;
`
const BluePatch = styled.div`
  position: absolute;
  top: 570px;
  left: 25px;
  width: 50px;
  height: 50px;
  background-color: #f1fdff;
`
const MixedFraction = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  width: 212px;
  height: 140px;
`
const Box = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: ${(p) => p.left}px;
  width: 86px;
  display: flex;
  height: 60px;
  flex-direction: column;
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
`
const FractLine = styled.div`
  width: 102px;
  height: 2px;
  background-color: #212121;
  position: absolute;
  top: 69px;
  left: 96px;
`
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
const ButtonElement = styled.button<{ themeName: string }>`
  height: 60px;
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 20px;
  left: 50%;
  translate: -50%;
  border-radius: 10px;
  background: ${(p) => (p.themeName == 'black' ? '#1a1a1a' : 'none')};
  border: 2px solid #1a1a1a;
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  cursor: pointer;

  &:disabled {
    opacity: 20%;
    cursor: default;
  }

  &:hover:not([disabled]) {
    scale: 1.05;
    transition: 0.3s ease-out;
  }

  &:active:not([disabled]) {
    scale: 1.15;
    transition: 0.3s;
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
const GGBContainer = styled.div<{ visibility: boolean }>`
  scale: 0.95;
  position: absolute;
  top: 87px;
  left: 50%;
  translate: -50% 0%;
  ${(p) => !p.visibility && ' visibility: hidden;'}
`
const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const AnimatedRotatingButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  translate: -50%;
  border-radius: 10px;
  width: auto;
  padding: 8px 26px;
  height: 60px;
  border-radius: 10px;
  flex: none;
  order: 0;
  flex-grow: 0;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
  border: 2px solid #1a1a1a;
  background: #fff;
  .icon-outer {
    fill: ${(props) => props.theme.default};
  }

  &:disabled {
    opacity: 20%;
    cursor: default;
    img {
      cursor: default;
    }
    label {
      cursor: default;
    }
  }

  &:focus {
    border: 2px solid #1a1a1a;
    border-radius: 10px;
  }

  &:hover:not([disabled]) {
    scale: 1.05;
    transition: 0.3s ease-out;
    img {
      scale: 1.2;
      animation: ${rotateAnimation} 0.5s ease-in-out;
      transition: 0.3s ease-out;
    }
    label {
      scale: 1.5;
      transition: 0.5s ease-out;
    }
    .icon-outer {
      fill: ${(props) => props.theme.hover};
    }
  }

  &:active:not([disabled]) {
    scale: 1.15;
    transition: 0.3s;
  }
`
const ButtonText = styled.label`
  position: relative;
  left: 9px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #212121;
  cursor: pointer;
`
const ButtonIcon = styled.img`
  position: relative;
  top: 3px;
  left: -5px;
  width: 23px;
  height: 23px;
  border: none;
  cursor: pointer;
`
const ClickPlayer = styled(Player)`
  position: absolute;
  pointer-events: none;
  top: 200px;
  left: 205px;
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
export const AppletG06NSC01WP02GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [pageNum, setPageNum] = useState(0)
  const [displayDropDown1, setDisplayDropDown1] = useState(false)
  const [displayDropDown2, setDisplayDropDown2] = useState(false)
  const [displayDropDown3, setDisplayDropDown3] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const [nextDisable, setNextDisable] = useState(true)
  const { stage: stage1 } = useTransition(displayDropDown1, 350)
  const { stage: stage2 } = useTransition(displayDropDown2, 350)
  const { stage: stage3 } = useTransition(displayDropDown3, 350)
  const [fractValues, setFractValues] = useState({ w: 0, n: 0, d: 0 })
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlay, setAudioPlay] = useState(true)

  const checkPlay = {
    onplay: () => {
      setIsPlaying(true)
    },
    onend: () => {
      setIsPlaying(false)
    },
  }
  const [playSelect, stopSelect] = useSound(select, checkPlay)
  const [playGreat, stopGreat] = useSound(great, checkPlay)
  const [playContinueAud, stopContinueAud] = useSound(continueAud, checkPlay)
  const [playBoth, stopBoth] = useSound(both, checkPlay)

  useEffect(() => {
    stopSelect.stop()
    stopContinueAud.stop()
    stopGreat.stop()
    stopBoth.stop()
    if (audioPlay) {
      switch (pageNum) {
        case 0:
          if (nextDisable) playSelect()
          else playGreat()
          break
        case 1:
          if (!nextDisable) playContinueAud()
          break
        case 2:
          if (!nextDisable) playBoth()
          break
      }
    } else {
      setIsPlaying(false)
    }
  }, [audioPlay, pageNum, nextDisable, playSelect])

  const onHandleGGB = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.registerObjectUpdateListener('ps', () => {
        if (!ggbApi.current) return
        if (ggbApi.current.getValue('ps') == 1) {
          setNextDisable(false)
        }
      })
    },
    [ggbApi],
  )
  const optionHandler1 = (value: number) => {
    onInteraction('tap')
    playClick()
    setFractValues({ ...fractValues, w: value })
  }
  const optionHandler2 = (value: number) => {
    onInteraction('tap')
    playClick()
    setFractValues({ ...fractValues, n: value })
  }
  const optionHandler3 = (value: number) => {
    onInteraction('tap')
    playClick()
    setFractValues({ ...fractValues, d: value })
  }
  useEffect(() => {
    switch (pageNum) {
      case 0:
        if (
          fractValues.w !== 0 &&
          fractValues.n !== 0 &&
          fractValues.d !== 0 &&
          !displayDropDown1 &&
          !displayDropDown2 &&
          !displayDropDown3
        ) {
          setNextDisable(false)
        } else setNextDisable(true)
        break
      case 1:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(an1)')
        ggbApi.current.registerObjectUpdateListener("ns'", () => {
          if (!ggbApi.current) return
          if (ggbApi.current.getValue("ns'") == fractValues.n - 1) {
            setNextDisable(false)
          }
        })
        return () => ggbApi.current?.unregisterObjectUpdateListener("ns'")
        break
      case 2:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(an2)')
        break
    }
  }, [fractValues, displayDropDown1, displayDropDown2, displayDropDown3, pageNum])
  const onNextHandle = () => {
    playClick()
    switch (pageNum) {
      case 0:
        if (!ggbApi.current) return
        ggbApi.current.setValue('a', fractValues.w)
        ggbApi.current.setValue('b', fractValues.n)
        ggbApi.current.setValue('c', fractValues.d)
        setPageNum(1)
        onInteraction('next')
        setNextDisable(true)
        break
      case 1:
        if (!ggbApi.current) return
        setPageNum(2)
        onInteraction('next')
        setNextDisable(true)
        break
      case 2:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(reset)')
        setPageNum(0)
        setFractValues({ w: 0, n: 0, d: 0 })
        setShowHandPointer(true)
        onInteraction('reset')
        break
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc01-wp02-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Representation of mixed numbers and improper fractions."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      {pageNum == 0 && (
        <BlueBG>
          <MixedFraction>
            <Box
              top={30}
              left={0}
              onClick={() => {
                setShowHandPointer(false)
                onInteraction('tap')
                playClick()
                if (!displayDropDown1) {
                  setDisplayDropDown1(true)
                  setDisplayDropDown2(false)
                  setDisplayDropDown3(false)
                } else setDisplayDropDown1(false)
              }}
            >
              {fractValues.w !== 0 && fractValues.w}
              {displayDropDown1 && (
                <OptionsContainer stage={stage1}>
                  <Option
                    onClick={() => {
                      optionHandler1(1)
                    }}
                  >
                    1
                  </Option>
                  <Option
                    onClick={() => {
                      optionHandler1(2)
                    }}
                  >
                    2
                  </Option>
                  <Option
                    onClick={() => {
                      optionHandler1(3)
                    }}
                  >
                    3
                  </Option>
                </OptionsContainer>
              )}
            </Box>
            <Box
              top={0}
              left={106}
              onClick={() => {
                setShowHandPointer(false)
                onInteraction('tap')
                playClick()
                if (!displayDropDown2) {
                  setDisplayDropDown1(false)
                  setDisplayDropDown2(true)
                  setDisplayDropDown3(false)
                } else setDisplayDropDown2(false)
              }}
            >
              {fractValues.n !== 0 && fractValues.n}
              {displayDropDown2 && (
                <OptionsContainer stage={stage2}>
                  <Option
                    onClick={() => {
                      optionHandler2(1)
                    }}
                  >
                    1
                  </Option>
                  <Option
                    onClick={() => {
                      optionHandler2(2)
                    }}
                  >
                    2
                  </Option>
                  <Option
                    onClick={() => {
                      optionHandler2(3)
                    }}
                  >
                    3
                  </Option>
                  <Option
                    onClick={() => {
                      optionHandler2(4)
                    }}
                  >
                    4
                  </Option>
                  <Option
                    onClick={() => {
                      optionHandler2(5)
                    }}
                  >
                    5
                  </Option>
                </OptionsContainer>
              )}
            </Box>
            <FractLine />
            <Box
              top={80}
              left={106}
              onClick={() => {
                setShowHandPointer(false)
                onInteraction('tap')
                playClick()
                if (!displayDropDown3) {
                  setDisplayDropDown1(false)
                  setDisplayDropDown2(false)
                  setDisplayDropDown3(true)
                } else setDisplayDropDown3(false)
              }}
            >
              {fractValues.d !== 0 && fractValues.d}
              {displayDropDown3 && (
                <OptionsContainer stage={stage3}>
                  <Option
                    onClick={() => {
                      optionHandler3(6)
                    }}
                  >
                    6
                  </Option>
                  <Option
                    onClick={() => {
                      optionHandler3(7)
                    }}
                  >
                    7
                  </Option>
                  <Option
                    onClick={() => {
                      optionHandler3(8)
                    }}
                  >
                    8
                  </Option>
                  <Option
                    onClick={() => {
                      optionHandler3(9)
                    }}
                  >
                    9
                  </Option>
                </OptionsContainer>
              )}
            </Box>
          </MixedFraction>
          {showHandPointer && <ClickPlayer src={click} autoplay loop />}
        </BlueBG>
      )}
      <GGBContainer visibility={pageNum == 0 ? false : true}>
        <Geogebra materialId="wk2jgyve" onApiReady={onHandleGGB} />
      </GGBContainer>
      <BluePatch />
      {(pageNum == 0 || !nextDisable) && (
        <HelperText>
          <SpeakerDiv>
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
          </SpeakerDiv>
          <Text>
            {pageNum == 0 &&
              (fractValues.w == 0 || fractValues.n == 0 || fractValues.d == 0
                ? 'Select numbers to form a mixed fraction.'
                : 'Great! Now, proceed to see the visual representation.')}
            {pageNum == 1 &&
              !nextDisable &&
              'Continue to determine the equivalent improper fraction and it’s visual representation.'}
            {pageNum == 2 &&
              !nextDisable &&
              'Both mixed fraction and its equivalent improper fraction have the same visual representation.'}
          </Text>
        </HelperText>
      )}
      {pageNum == 2 ? (
        <AnimatedRotatingButton disabled={nextDisable} onClick={onNextHandle}>
          <ButtonIcon src={resetIcon} />
          <ButtonText>Reset</ButtonText>
        </AnimatedRotatingButton>
      ) : (
        <ButtonElement
          themeName={pageNum == 2 ? 'white' : 'black'}
          disabled={nextDisable}
          onClick={onNextHandle}
        >
          Next
        </ButtonElement>
      )}
    </AppletContainer>
  )
}
