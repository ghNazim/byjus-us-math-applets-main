import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import Animation from '../../common/handAnimations/moveRight.json'
import { TextHeader } from '../../common/Header'
import { Math } from '../../common/Math'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import Height from './height.svg'
import Line from './line.svg'

const LineContainer = styled.img<{ top: number; left?: number; scale?: number }>`
  position: absolute;
  left: ${(props) => (props.left ? props.left : 100)}px;
  scale: ${(props) => (props.scale ? props.scale : 1)};
  top: ${(props) => props.top}px;
  pointer-events: none;
`
const GGBContainer = styled(Geogebra)`
  position: absolute;
  top: 170px;
  left: 0;
`
const TextContainer = styled.div<{
  weight: number
  top: number
  padding: number
  fontsize?: number
}>`
  position: absolute;
  width: 720px;
  top: ${(props) => props.top}px;
  text-align: center;
  color: #444;
  font-size: ${(props) => (props.fontsize ? props.fontsize : 20)}px;
  padding: 0px ${(props) => props.padding}px;
  font-weight: ${(props) => props.weight};
`

const LottieContainer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  translate: -50% -25%;
  pointer-events: none;
  z-index: 1;
`

export const Applet00802Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className = '' }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [showText, setShowText] = useState(false)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [showCylinder, setShowCylinder] = useState(true)
  const onInteraction = useContext(AnalyticsContext)

  const ggbApiHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.registerUpdateListener((e: any) => {
        if (e !== 'N') return
        onInteraction('move-point')
        api.getValue('y(N)') < 4 ? setShowCylinder(true) : setShowCylinder(false)
        setShowText(true)
      })
      setGgbLoaded(true)
      // ggbApi.current.registerClientListener((e: any) => {
      //   console.log(e)
      // })
    },
    [onInteraction],
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '008_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Transform the right circular cylinder made of thin circular disks into an oblique cylinder by sliding the pointer."
        backgroundColor={'#FAF2FF'}
        buttonColor="#EACCFF"
      />
      <GGBContainer
        width={720}
        height={450}
        materialId="b2g3rh6w"
        onApiReady={ggbApiHandle}
        pointToTrack="N"
        // showOnBoarding
        // showPointlocators
        // pointlocatorsDisabled={false}
        // animationType={Animation}
        // appletType="2D"
      />
      {ggbLoaded && (
        <>
          <LineContainer top={198} src={Line} draggable={false} />
          <LineContainer top={486} src={Line} draggable={false} />
          <LineContainer top={250} left={550} scale={1.55} src={Height} draggable={false} />
        </>
      )}
      {ggbLoaded &&
        (!showCylinder ? (
          <TextContainer weight={400} top={155} padding={100} fontsize={14}>
            Oblique Cylinder
          </TextContainer>
        ) : (
          <TextContainer weight={400} top={155} padding={100} fontsize={14}>
            Right Circular Cylinder
          </TextContainer>
        ))}
      {ggbLoaded && !showText && (
        <LottieContainer top={200} left={283} src={Animation} loop autoplay />
      )}
      {showText && (
        <div>
          <TextContainer weight={400} top={560} padding={120}>
            As the volume of the thin disks stays the same when the cylinder is made oblique, we can
            say
          </TextContainer>
          <TextContainer weight={700} top={650} padding={0}>
            Volume of oblique cylinder = Volume of right circular cylinder.
          </TextContainer>
          <TextContainer weight={700} top={685} padding={0}>
            <Math>{String.raw`\bold{=πr^2h}`}</Math>
          </TextContainer>
        </div>
      )}
    </AppletContainer>
  )
}
