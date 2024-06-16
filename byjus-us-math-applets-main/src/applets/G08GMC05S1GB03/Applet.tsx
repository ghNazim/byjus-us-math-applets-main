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
  top: 90px;
`
const NudgePlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left - 65}px;
  top: ${(p) => p.top + 50}px;
  pointer-events: none;
`
const CTAButton = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
`
const Slider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 220px;
`
const Feedback = styled.div`
  position: absolute;
  bottom: 100px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
`
const StyledSpan = styled.span`
  display: inline-block;
  padding-left: 6px;
  padding-right: 7px;
  background-color: #646464;
  color: white;
  border-radius: 5px;
`
export const AppletG08GMC05S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
    if (api == null) return
    api.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'R') {
        playMouseIn()
      } else if (e.type === 'dragEnd' && e.target === 'R') {
        playMouseOut()
      }
    })
  }, [])

  const [button, setButton] = useState(1)
  const [angleShow, setAngleShow] = useState(0)
  const [lab, setLab] = useState(0)
  const [end, setEnd] = useState(false)
  const [nudgeOn, setNudgeOn] = useState(true)
  const [nudgeLocation, setNudgeLocation] = useState({ leftPixel: 0, topPixel: 0 })
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const ggb = ggbApi.current
  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('but', () => {
        setButton(ggb?.getValue('but') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('show', () => {
        setAngleShow(ggb?.getValue('show') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('lab', () => {
        setLab(ggb?.getValue('lab') || 0)
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('but')
        ggbApi.current?.unregisterObjectUpdateListener('show')
        ggbApi.current?.unregisterObjectUpdateListener('lab')
      }
    }
  }, [ggbLoaded, ggb])
  function handleSliderChange(value: number): void {
    ggb?.setValue('tr', value / 100)
    value == 100 ? setEnd(true) : setEnd(false)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'test-corr-angle',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore corresponding angles."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="k3ap9d3d" onApiReady={onGGBLoaded} width={693} height={533} />
      {0 < angleShow && angleShow < 5 && <Slider onChangePercent={handleSliderChange} />}

      {angleShow == 0 && lab == 0 && (
        <Feedback>
          Set the transverse and proceed to view <StyledSpan>corresponding angles</StyledSpan>.
        </Feedback>
      )}
      {angleShow == 5 && lab == 1 && (
        <Feedback>
          Intersection of parallel lines with a transversal <br />
          forms four pairs of <StyledSpan>corresponding angles</StyledSpan>.
        </Feedback>
      )}
      {angleShow == 5 && lab == 0 && (
        <Feedback>Select any corresponding angle and proceed.</Feedback>
      )}
      {!end && angleShow > 0 && angleShow < 5 && (
        <Feedback>
          Overlap the selected corresponding angles
          <br /> to verify if they are equal.{' '}
        </Feedback>
      )}
      {end && angleShow > 0 && angleShow < 5 && (
        <Feedback>The selected corresponding angles are equal. </Feedback>
      )}
      {button == 2 && (
        <CTAButton
          src={nextButtonActive}
          onClick={() => {
            playMouseClick()
            ggb?.evalCommand('RunClickScript(next)')
            if (nudgeOn && ggb) setNudgeLocation(locatePoint2d('B', ggb))
          }}
        />
      )}
      {button == 1 && <CTAButton src={nextButtonInactive} />}
      {button == 3 && (
        <CTAButton
          src={retryButton}
          onClick={() => {
            playMouseClick()
            ggb?.evalCommand('RunClickScript(reset)')
            setNudgeOn(false)
          }}
        />
      )}
      {angleShow == 5 && lab == 0 && nudgeOn && (
        <NudgePlayer
          src={click}
          left={nudgeLocation.leftPixel}
          top={nudgeLocation.topPixel}
          autoplay
          loop
        />
      )}
    </AppletContainer>
  )
}
