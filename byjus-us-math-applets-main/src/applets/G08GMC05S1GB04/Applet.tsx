import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveAllDirections } from '@/assets/onboarding'
import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import nextActive from './assets/nextButton.svg'
import nextInactive from './assets/nextButtonInactive.svg'
import retry from './assets/retry.svg'
import RadioButton from './RadioButton'

const GGBcontainer = styled(Geogebra)`
  top: 105px;
  position: absolute;
  left: 50%;
  translate: -50%;
`
const CTAButton = styled.img<{ active?: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  cursor: ${(p) => (p.active ? 'pointer' : 'default')};
`
const NudgePlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
`
const FeedbackTop = styled.div`
  position: absolute;
  top: 585px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
  translate: 0 -50%;
`
const Blue = styled.span`
  height: 25px;
  display: inline-block;
  padding-left: 6px;
  padding-right: 7px;
  background-color: #e7fbff;
  color: #1cb9d9;
  border-radius: 5px;
`
const Slider = styled(AnimatedInputSlider)`
  width: 520px;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 100px;
`
const RadioHolder = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  display: flex;
  gap: 10px;
  justify-content: center;
  top: 640px;
  flex-wrap: wrap;
  width: 60%;
`
export const AppletG08GMC05S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
    ggbApi.current?.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && (e.hits[0] === 'A' || e.hits[0] === 'B' || e.hits[0] === 'C')) {
        playMouseIn()
        setNudgeOn(false)
      } else if (
        e.type === 'dragEnd' &&
        (e.target === 'A' || e.target === 'B' || e.target === 'C')
      ) {
        playMouseOut()
      }
    })
  }, [])
  const ggb = ggbApi.current
  const [frame, setFrame] = useState(0)
  const [button, setButton] = useState(0)
  const [nudgeOn, setNudgeOn] = useState(true)
  const [activeRadio, setActiveRadio] = useState(0)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('frame', () => {
        setFrame(ggb?.getValue('frame') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('next1vis', () => {
        setButton(ggb?.getValue('next1vis') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('option', () => {
        setActiveRadio(ggb?.getValue('option') || 0)
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('next1vis')
        ggbApi.current?.unregisterObjectUpdateListener('frame')
        ggbApi.current?.unregisterObjectUpdateListener('option')
      }
    }
  }, [ggbLoaded])
  function nextHandle() {
    playMouseClick()
    switch (frame) {
      case 0:
        ggb?.evalCommand('RunClickScript(Next1)')
        break
      case 2:
        ggb?.evalCommand('RunClickScript(Next2)')
        setNudgeOn(true)
        setButton(0)
        break
      case 3:
        ggb?.evalCommand('RunClickScript(next3)')
        setButton(2)
        break
    }
    ggb?.evalCommand('SelectObjects()')
  }
  function retryHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(RetryButton)')
    ggb?.evalCommand('SelectObjects()')
    setNudgeOn(true)

  }
  function handleSliderChange(value: number): void {
    if (value == 0) return
    setNudgeOn(false)
    ggb?.setValue('path', value / 100)
    value == 100 ? setButton(1) : setButton(0)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g08-gmc05-s1-gb04',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore the relation between exterior and interior angles of a triangle."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="wmzqbrw8" onApiReady={onGGBLoaded} width={700} height={440} />
      {(frame == 1 || frame == 2) && (
        <RadioHolder>
          <RadioButton
            disabled={false}
            active={activeRadio == 1}
            onClick={() => {
              playMouseClick()
              setNudgeOn(false)
              ggb?.evalCommand('RunClickScript(ABbutton)')
            }}
            text="AB"
          ></RadioButton>
          <RadioButton
            disabled={false}
            active={activeRadio == 2}
            onClick={() => {
              playMouseClick()
              setNudgeOn(false)
              ggb?.evalCommand('RunClickScript(BCbutton)')
            }}
            text="BC"
          ></RadioButton>
          <RadioButton
            disabled={false}
            active={activeRadio == 3}
            onClick={() => {
              playMouseClick()
              setNudgeOn(false)
              ggb?.evalCommand('RunClickScript(CAbutton)')
            }}
            text="CA"
          ></RadioButton>
        </RadioHolder>
      )}
      {frame == 3 && (
        <Slider animDuration={3700} forceHideHandAnimation onChangePercent={handleSliderChange} />
      )}
      {ggbLoaded && frame == 0 && (
        <FeedbackTop>Adjust the vertices to create your desired triangle.</FeedbackTop>
      )}
      {(frame == 1 || frame == 2) && (
        <FeedbackTop>Choose a side to extend and view its exterior angle.</FeedbackTop>
      )}
      {frame == 3 && (
        <FeedbackTop>Observe the relation between interior and exterior angles.</FeedbackTop>
      )}
      {frame == 4 && (
        <FeedbackTop style={{ top: '610px' }}>
          <Blue> Exterior angle </Blue> is equal to <br />
          the sum of the two interior opposite angles.
        </FeedbackTop>
      )}
      {ggbLoaded && button == 0 && <CTAButton draggable={false} src={nextInactive} />}
      {button == 1 && <CTAButton active draggable={false} src={nextActive} onClick={nextHandle} />}
      {button == 2 && <CTAButton active draggable={false} src={retry} onClick={retryHandle} />}
      {frame == 1 && <NudgePlayer left={180} top={630} src={click} autoplay loop />}
      {nudgeOn && frame == 3 && (
        <NudgePlayer left={75} top={615} src={click} autoplay loop />
      )}
      {ggbLoaded && nudgeOn && frame == 0 && (
        <NudgePlayer left={70} top={125} src={moveAllDirections} autoplay loop />
      )}
    </AppletContainer>
  )
}
