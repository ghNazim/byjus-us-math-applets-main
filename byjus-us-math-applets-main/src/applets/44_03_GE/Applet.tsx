import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import moveVertical from '../../common/handAnimations/moveVertically.json'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
const HelperText = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  translate: -50%;
  height: 50px;
  width: 600px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #646464;
  pointer-events: none;
  & span {
    color: #fff;
    text-align: center;
    background: #f57a7a;
    border-radius: 5px;
    padding: 3px 0px;
    width: 45px;
    display: inline-block;
  }
`
const GGB = styled(Geogebra)`
  position: absolute;
  top: 0px;
  left: 0;
  scale: 0.8;
`
const PlacedPlayer = styled(Player)`
  position: absolute;
  top: 362px;
  left: 107px;
  pointer-events: none;
`
export const Applet4403Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [showHandPointer, setShowHandPointer] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const [yCoord, setYCoord] = useState(0)

  const onHandleGGB = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGGBLoaded(true)
      setShowHandPointer(true)
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'CY') {
          setShowHandPointer(false)
          onInteraction('move-point')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'CY') {
          playMouseOut()
        }
      })
      api.registerObjectUpdateListener('CY', () => {
        setYCoord(api.getValue('y(CY)'))
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: '44_03_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Move the bee along the y-axis and observe its distance from the origin."
        backgroundColor="#F1EDFF"
        buttonColor="#D9CDFF"
      />
      <GGB
        width={680}
        height={680}
        materialId="cuvfvtya"
        onApiReady={onHandleGGB}
        isApplet2D={true}
      />
      {ggbLoaded && (
        <HelperText>
          {'Distance from the origin along y-axis = '}
          <span>{yCoord}</span>
        </HelperText>
      )}
      {showHandPointer && <PlacedPlayer src={moveVertical} autoplay loop />}
    </AppletContainer>
  )
}
