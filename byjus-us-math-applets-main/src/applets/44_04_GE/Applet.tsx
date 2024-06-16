import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import handPointer from '../../common/handAnimations/moveAllDirections.json'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
const HelperText = styled.div<{ bgColor: string; bottom: number }>`
  position: absolute;
  bottom: ${(props) => props.bottom}px;
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
    background: ${(props) => props.bgColor};
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
  top: 378px;
  left: -138px;
  pointer-events: none;
`
export const Applet4404Ge: React.FC<{
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
  const [xCoord, setXCoord] = useState(0)
  const onHandleGGB = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGGBLoaded(true)
      setShowHandPointer(true)
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'CXY') {
          setShowHandPointer(false)
          onInteraction('move-point')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'CXY') {
          playMouseOut()
        }
      })
      api.registerObjectUpdateListener('CXY', () => {
        setYCoord(api.getValue('y(CXY)'))
        setXCoord(api.getValue('x(CXY)'))
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: '44_04_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Move the bee on the coordinate plane to see its distances from x-axis and y-axis."
        backgroundColor="#F1EDFF"
        buttonColor="#D9CDFF"
      />
      <GGB
        width={680}
        height={680}
        materialId="p2b8cftk"
        onApiReady={onHandleGGB}
        isApplet2D={true}
      />
      {ggbLoaded && (
        <HelperText bgColor="#41d98d" bottom={110}>
          {'Distance from the origin along x-axis = '}
          <span>{xCoord}</span>
        </HelperText>
      )}
      {ggbLoaded && (
        <HelperText bgColor="#f57a7a" bottom={50}>
          {'Distance from the origin along y-axis = '}
          <span>{yCoord}</span>
        </HelperText>
      )}
      {showHandPointer && <PlacedPlayer src={handPointer} autoplay loop />}
    </AppletContainer>
  )
}
