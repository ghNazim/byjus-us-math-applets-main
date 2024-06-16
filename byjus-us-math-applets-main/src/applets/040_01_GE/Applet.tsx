import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import handAnimation from '../../common/handAnimations/Rotatebothsides.json'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'

const CenteredGGB = styled(Geogebra)`
  position: absolute;
  left: 110%;
  top: 220px;
  width: 500px;
  height: 300px;
  translate: -110%;
  scale: 1.3;
  transition: 0.3s;
`
const BackgroundDiv = styled.div<{
  left: number
  bgColor?: string
  width?: number
  height?: number
}>`
  background-color: ${(props) => (props.bgColor ? props.bgColor : '#BCD3FF')};
  width: ${(props) => (props.width ? props.width : 30)}px;
  height: ${(props) => (props.height ? props.height : 37)}px;
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: ${(props) => props.left}px;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;
`
const PlaceText = styled.div<{
  left: number
  color?: string
}>`
  position: absolute;
  top: 40px;

  left: ${(props) => props.left}px;
  z-index: 1;
  width: 92px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: ${(props) => props.color};
  text-align: center;
`

const ColonPT = styled.span<{
  left: number
}>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: 0px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 30.3329px;
  line-height: 40px;
  text-align: center;
  color: #444444;
`

const Time = styled.text`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`
const TimeContainer = styled.div`
  width: 308px;
  height: 70px;
  position: absolute;
  top: 600px;
  left: 50%;
  translate: -50%;
`
const GeogebraPlayer = styled(Player)`
  position: absolute;
  top: 190px;
  left: 160px;
  pointer-events: none;
`

export const Applet04001Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [isGGBLoaded, setGGBloaded] = useState(false)
  const [onPointUpdate, setOnPointUpdate] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [clockHands, setClockHands] = useState({ h: 12, m: 0, s: 0 })

  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGGBloaded(true)

      api.registerObjectUpdateListener('A', () => {
        setClockHands({
          h: api.getValue('hour'),
          m: api.getValue('minute'),
          s: api.getValue('second'),
        })
      })

      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'A') {
          setClockHands({
            h: api.getValue('hour'),
            m: api.getValue('minute'),
            s: api.getValue('second'),
          })
          onInteraction('drag')
          setOnPointUpdate(true)

          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'A') {
          setClockHands({
            h: api.getValue('hour'),
            m: api.getValue('minute'),
            s: api.getValue('second'),
          })
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  // useEffect(() => {
  //   const api = ggbApi.current
  //   if (!isGGBLoaded || api == null) return

  // }, [isGGBLoaded])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E8F0FE',
        id: '040_01_GE',
        onEvent,
        className,
      }}
    >
      <CenteredGGB
        width={390}
        height={390}
        materialId={'ncqf7hhg'}
        onApiReady={onGGBLoaded}
        pointToTrack="A"
      />

      {isGGBLoaded && (
        <TimeContainer>
          <BackgroundDiv left={0} width={92} height={40} bgColor={'#85CC29'}>
            <Time>{clockHands.h < 10 ? '0' + clockHands.h : clockHands.h}</Time>
          </BackgroundDiv>
          <ColonPT left={91}>:</ColonPT>
          <BackgroundDiv left={100} width={92} height={40} bgColor={'#F0A000'}>
            <Time>{clockHands.m < 10 ? '0' + clockHands.m : clockHands.m}</Time>
          </BackgroundDiv>
          <ColonPT left={191}>:</ColonPT>
          <BackgroundDiv left={200} width={92} height={40} bgColor={'#F57A7A'}>
            <Time> {clockHands.s < 10 ? '0' + clockHands.s : clockHands.s}</Time>
          </BackgroundDiv>
          <PlaceText left={0} color={'#6CA621'}>
            Hour
          </PlaceText>
          <PlaceText left={100} color={'#D97A1A'}>
            Minute
          </PlaceText>
          <PlaceText left={200} color={'#F57A7A'}>
            Second
          </PlaceText>
        </TimeContainer>
      )}
      {isGGBLoaded && !onPointUpdate && <GeogebraPlayer src={handAnimation} autoplay loop />}
      <TextHeader
        text="Move the minute hand on the clock to see how the time changes."
        backgroundColor="#E8F0FE"
        buttonColor="#BCD3FF"
      />
    </AppletContainer>
  )
}
