import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import handAnimation from '../../common/handAnimations/moveHorizontally.json'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'

const CenteredGGB = styled(Geogebra)`
  position: absolute;
  left: 110px;
  top: 120px;
  width: 495px;
  /* width: 500px;
  height: 500px; */
  transition: 0.3s;
  scale: 1.3;
`
const PlaceText = styled.div`
  z-index: 2;
  position: absolute;
  bottom: 32px;
  left: 50%;
  translate: -50%;
  width: 450px;
  color: #444;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  text-align: center;
`

const GeogebraPlayer = styled(Player)`
  position: absolute;
  top: 502px;
  left: -22px;
  pointer-events: none;
`

const HelperText = [
  '',
  'The library is 2 units away along the x-axis and 2 units away along the y-axis.',
  'The airport is 5 units away along the x-axis and 1 units away along the y-axis.',
  'The restaurant is 7 units away along the x-axis and 2 units away along the y-axis.',
  'The gas station is 5 units away along the x-axis and 5 units away along the y-axis.',
  'The hospital is 1 units away along the x-axis and 5 units away along the y-axis.',
  'The coffee shop is 3 units away along the x-axis and 7 units away along the y-axis.',
]
const AppInternal: React.FC = () => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [isGGBLoaded, setGGBloaded] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const [onPointUpdate, setOnPointUpdate] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [HelperTextUpdate, setHelperTextUpdate] = useState('')

  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGGBloaded(true)

      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'B') {
          onInteraction('drag')
          setOnPointUpdate(true)
          playMouseIn()
          api.setValue('Slider', 0)
        } else if (e.type === 'dragEnd' && e.target === 'B') {
          onInteraction('drop')
          playMouseOut()
          api.setValue('Slider', 1)
          if (api.getXcoord('B') == 2 && api.getYcoord('B') == 2) {
            setHelperTextUpdate(HelperText[1])
          } else if (api.getXcoord('B') == 5 && api.getYcoord('B') == 1) {
            setHelperTextUpdate(HelperText[2])
          } else if (api.getXcoord('B') == 7 && api.getYcoord('B') == 2) {
            setHelperTextUpdate(HelperText[3])
          } else if (api.getXcoord('B') == 5 && api.getYcoord('B') == 5) {
            setHelperTextUpdate(HelperText[4])
          } else if (api.getXcoord('B') == 1 && api.getYcoord('B') == 5) {
            setHelperTextUpdate(HelperText[5])
          } else if (api.getXcoord('B') == 3 && api.getYcoord('B') == 7) {
            setHelperTextUpdate(HelperText[6])
          } else {
            setHelperTextUpdate(HelperText[0])
          }
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  return (
    <>
      <CenteredGGB
        width={720}
        height={720}
        materialId={'awupvphp'}
        pointToTrack="B"
        onApiReady={onGGBLoaded}
        isApplet2D={false}
        // showOnBoarding={onPointUpdate && pageIndex == 0}
        onboardingAnimationSrc={handAnimation}
      />
      {isGGBLoaded && !onPointUpdate && <GeogebraPlayer src={handAnimation} autoplay loop />}
      <PlaceText>{HelperTextUpdate}</PlaceText>
    </>
  )
}

export const Applet04401Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: '044_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Move the location marker over the map to see the coordinates of various locations."
        backgroundColor="#F1EDFF"
        buttonColor="#D9CDFF"
      />
      <AppInternal />
    </AppletContainer>
  )
}
