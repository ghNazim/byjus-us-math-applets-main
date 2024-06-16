import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click } from '@/assets/onboarding'
import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { locatePoint2d } from '@/common/Geogebra/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import nextButtonActive from './assets/nextButton.svg'
import nextButtonInactive from './assets/nextButtonInactive.svg'
import retryButton from './assets/retryButton.svg'

const GGBcontainer = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 20px;
  scale: 0.8;
`
const NudgePlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left - 75}px;
  top: ${(p) => p.top + 40}px;
  pointer-events: none;
`
const CTAButton = styled.img<{ active?: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  cursor: ${(p) => (p.active ? 'pointer' : 'default')};
`
const Slider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 220px;
`
const Feedback = styled.div`
  position: absolute;
  bottom: 125px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
  translate: 0 50%;
`
const StyledSpan = styled.span`
  display: inline-block;
  padding-left: 6px;
  padding-right: 7px;
  background-color: #ffe9d4;
  color: #d97a1a;
  border-radius: 5px;
`

export const AppletG08GMC05S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [frame, setFrame] = useState(1)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
    if (api == null) return
    api.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'Dagger') {
        playMouseIn()
      } else if (e.type === 'dragEnd' && e.target === 'Dagger') {
        playMouseOut()
      }

    })
  }, [])


  const [animEnded, setAnimEnded] = useState(0)
  const [nudgeOn, setNudgeOn] = useState(true)
  const [nudgeLocation, setNudgeLocation] = useState({ leftPixel: 0, topPixel: 0 })
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const ggb = ggbApi.current
  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('layer', () => {
        setFrame(ggb?.getValue('layer') || 0)
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('layer')
      }
    }
  }, [ggbLoaded, ggb])
  useEffect(()=>{
    if(ggbLoaded){
      ggbApi.current?.registerClientListener((e: any) => {

        if (
          frame== 4 && e.type === 'mouseDown' &&
          (e.hits[0] === 'Angle1' ||
            e.hits[0] === 'Angle2' ||
            e.hits[0] === 'Angle3' ||
            e.hits[0] === 'Angle4')

        ) {
          playMouseClick()
          setNudgeOn(false)
        }
      })
    }

  },[frame])
  function handleNext() {
    playMouseClick()
    if (ggb && nudgeOn) setNudgeLocation(locatePoint2d('Int2', ggb))
    switch (frame) {
      case 2:
        ggb?.evalCommand('RunClickScript(Next1)')

        break
      case 3:
        ggb?.evalCommand('RunClickScript(Next2)')
        break
    }
  }
  function handleReset() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(Retry)')
  }
  function handleSliderChange(value: number) {
    if (frame == 5) ggb?.setValue('RotateAngle1', (Math.PI * value) / 100)
    else if (frame == 6) ggb?.setValue('RotateAngle2', (Math.PI * value) / 100)
    setAnimEnded(value == 100 ? 1 : 0)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#a7a7a7',
        id: 'g08-gmc05-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore alternate exterior angles."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="tngfhfpf" onApiReady={onGGBLoaded} width={871} height={670} />
      {(frame == 2 || frame == 3) && (
        <CTAButton draggable={false} active src={nextButtonActive} onClick={handleNext} />
      )}
      {(frame == 5 || frame == 6) && animEnded == 1 && (
        <CTAButton draggable={false} active src={retryButton} onClick={handleReset} />
      )}
      {(frame == 1 || frame == 4) && <CTAButton draggable={false} src={nextButtonInactive} />}
      {(frame == 5 || frame == 6) && <Slider onChangePercent={handleSliderChange} />}
      {frame <= 2 && (
        <Feedback>
          Set the transverse and proceed to view <StyledSpan>alternate exterior angles</StyledSpan>.
        </Feedback>
      )}
      {frame == 3 && (
        <Feedback>
          Intersection of parallel lines with a transversal <br />
          forms two pairs of <StyledSpan> alternate exterior angles </StyledSpan>.
        </Feedback>
      )}
      {frame == 4 && <Feedback>Select any alternate exterior angle and proceed.</Feedback>}
      {animEnded == 0 && frame >= 5 && (
        <Feedback>
          Overlap the selected alternate exterior angles
          <br /> to verify if they are equal.{' '}
        </Feedback>
      )}
      {animEnded == 1 && frame >= 5 && (
        <Feedback>The selected alternate exterior angles are equal. </Feedback>
      )}
      {nudgeOn && frame == 4 && (
        <NudgePlayer
          src={click}
          left={nudgeLocation.leftPixel * 0.83}
          top={nudgeLocation.topPixel * 0.83}
          autoplay
          loop
        />
      )}
    </AppletContainer>
  )
}
