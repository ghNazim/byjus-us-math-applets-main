import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveAllDirections } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

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
const Feedback = styled.div`
  position: absolute;
  bottom: 40px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
`
const G = styled.span`
  display: inline-block;
  padding-left: 6px;
  padding-right: 7px;
  background-color: #428c94;
  color: white;
  border-radius: 5px;
`
export const AppletG08GMC05S1GB06: FC<{
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
      if (e.type === 'mouseDown' && (e.hits[0] === 'G' || e.hits[0] === 'aa')) {
        playMouseIn()
        setNudgeOn(false)
      } else if (e.type === 'dragEnd' && e.target === 'G') {
        playMouseOut()
        setNudgeOn(true)
      } else if (e.type === 'dragEnd' && e.target === 'aa') {
        playMouseOut()
      } else if (
        e.type === 'mouseDown' &&
        (e.hits[0] === 'Play' || e.hits[0] === 'Pause' || e.hits[0] === 'Retry')
      ) {
        playMouseClick()
        setNudgeOn(false)
      }
    })
  }, [])
  const [frame, setFrame] = useState(0)
  const [nudgeOn, setNudgeOn] = useState(true)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseClick = useSFX('mouseClick')
  const ggb = ggbApi.current
  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('frame', () => {
        setFrame(ggb?.getValue('frame') || 0)
        if (frame == 2) setNudgeOn(true)
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('frame')
      }
    }
  }, [ggbLoaded, ggb])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g08-gmc05-s1-gb06',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore the sum of the interior angles of a triangle."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="y8tpmvjz" onApiReady={onGGBLoaded} width={690} height={617} />
      {ggbLoaded && frame == 0 && <Feedback>Move the vertex to create a triangle of your choice.</Feedback>}
      {frame == 1 && <Feedback>Tap to find the sum of the interior angles.</Feedback>}
      {frame == 2 && (
        <Feedback>
          The sum of measures of the <G> interior angles </G> is <G> 180° </G>.
        </Feedback>
      )}
      {ggbLoaded && frame == 0 && nudgeOn && (
        <NudgePlayer left={120} top={-40} src={moveAllDirections} autoplay loop />
      )}
      {frame == 1 && nudgeOn && <NudgePlayer left={140} top={550} src={click} autoplay loop />}
    </AppletContainer>
  )
}
