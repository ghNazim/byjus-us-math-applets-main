import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

//VOs
import SelectAnAxisVO from './assets/G06NSC09S1GB03_1.mp3'
import OnReflectingXaxisVO from './assets/G06NSC09S1GB03_2.mp3'
import OnReflectingYaxisVO from './assets/G06NSC09S1GB03_3.mp3'
import OnReflectingXnYaxisVO from './assets/G06NSC09S1GB03_4.mp3'
import muteBtn from './assets/muteBtn.svg'
import unmuteBtn from './assets/unmuteBtn.svg'
//
import { Texts } from './Elements/Elements'
import RadioButton from './Elements/RadioButton'

const SpeakerDiv = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* background: red; */
  margin: 0 10px;
  /* left: 56px;
  bottom: 53px; */
`
const SpeakerButton = styled.img`
  /* background: blue; */
  cursor: pointer;
  z-index: 1;
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
  left: 0;
`

const Container = styled.div`
  position: absolute;
  top: 550px;
  width: 100%;

  position: absolute;
  bottom: 10px;

  display: flex;
  flex-direction: column;
  justify-content: end;
`

const ButtonContainer = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`

const TextBox = styled.div`
  text-align: center;
  color: #444444;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  width: 100%;

  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  bottom: 120px;
  z-index: 5;
`

const StyledGgb = styled(Geogebra)`
  height: 650px;
  width: 600px;
  overflow: hidden;
  position: absolute;
  left: 65px;
  top: 100px;
  z-index: -1;
`

const RippleContainer = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  left: 0;
`

const ButtonRetrieve: FC<{ handleClick: (index: number) => void; active: number }> = ({
  handleClick,
  active,
}) => {
  const texts: string[] = ['x-axis', 'y-axis', 'Both x-axis and y-axis']
  const buttons: JSX.Element[] = []

  for (let index = 0; index < 3; index++) {
    buttons.push(
      <RadioButton
        onClick={() => handleClick(index)}
        active={active === index}
        text={texts[index]}
        value={index}
      />,
    )
  }

  return <>{buttons}</>
}

export const AppletG06NSC09S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [active, setActive] = useState(3)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlay, setAudioPlay] = useState(true)

  const checkPlay = {
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
  }

  const [playSelectAxis, stopSelectAxis] = useSound(SelectAnAxisVO, checkPlay)
  const [playReflectXaxis, stopReflectXaxis] = useSound(OnReflectingXaxisVO, checkPlay)
  const [playReflectYaxis, stopReflectYaxis] = useSound(OnReflectingYaxisVO, checkPlay)
  const [playReflectXnYaxis, stopReflectXnYaxis] = useSound(OnReflectingXnYaxisVO, checkPlay)

  useEffect(() => {}, [])

  const handleClick = (index: number) => {
    setActive(index)
  }

  const handleGGBready = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setGgbLoaded(true)
    },
    [ggbApi],
  )
  const resetGgb = () => {
    if (!ggbLoaded) return
    ggbApi.current?.evalCommand('SetValue(bool1,false)')
    ggbApi.current?.evalCommand('SetValue(bool2,false)')
    ggbApi.current?.evalCommand('SetValue(bool3,false)')
  }

  useEffect(() => {
    stopReflectXaxis.stop()
    stopReflectYaxis.stop()
    stopReflectXnYaxis.stop()
    stopSelectAxis.stop()
    resetGgb()
    switch (active) {
      case 0:
        ggbApi.current?.evalCommand('SetValue(bool1,true)')
        break
      case 1:
        ggbApi.current?.evalCommand('SetValue(bool2,true)')
        break
      case 2:
        ggbApi.current?.evalCommand('SetValue(bool3,true)')
        break
    }

    if (audioPlay) {
      switch (active) {
        case 0:
          playReflectXaxis()
          break
        case 1:
          playReflectYaxis()
          break

        case 2:
          playReflectXnYaxis()
          break
        default:
          break
      }
    }
  }, [active])

  useEffect(() => {
    if (ggbLoaded) playSelectAxis()
  }, [ggbLoaded])

  useEffect(() => {
    if (!audioPlay) {
      stopReflectXaxis.stop()
      stopReflectYaxis.stop()
      stopReflectXnYaxis.stop()
      stopSelectAxis.stop()
      setIsPlaying(false)
    }
  }, [audioPlay])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc09-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore reflecting points in the coordinate plane."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <StyledGgb materialId="sgvnqurc" onApiReady={handleGGBready} />
      {ggbLoaded ? (
        <>
          <Container>
            <TextBox>
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
              {Texts[active]}
            </TextBox>
            <ButtonContainer>{ButtonRetrieve({ handleClick, active })}</ButtonContainer>
          </Container>
        </>
      ) : null}
    </AppletContainer>
  )
}
