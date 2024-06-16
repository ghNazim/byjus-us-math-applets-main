import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { rotateBothSides } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
const GgbContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 10px;
  /* left: 50%; */
  /* translate: -50%; */
  scale: 0.7;
  display: flex;
  /* border: 1px solid red; */
  justify-content: center;
  align-items: center;
`
const PlacedPlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
`
export const AppletG07GMC04S1GB06: FC<{
  onEvent: AppletInteractionCallback
  className?: string
  onComplete: () => void
}> = ({ onEvent, className, onComplete }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [pointerL, setPointerL] = useState({ left: 0, top: 0 })
  const [pointerM, setPointerM] = useState({ left: 0, top: 0 })
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')
  const playClick = useSFX('mouseClick')
  const interaction = useContext(AnalyticsContext)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const [showHandCounter, setShowHandCounter] = useState(0)
  const [prevLayer, setPrevLayer] = useState(2)
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      ggbApi.current.registerClientListener((event: any) => {
        if (event[0] == 'dragEnd') {
          onComplete()
        }

        if (ggbApi.current === null) return
        if (
          event[0] == 'mouseDown' &&
          (event.hits[0] == 'DraggerM' || event.hits[0] == 'DraggerL')
        ) {
          playDragStart()
          interaction('drag')
          setShowHandPointer(false)
        }
        if (event[0] == 'dragEnd' && (event[1] == 'DraggerM' || event[1] == 'DraggerL')) {
          playDragEnd()
          interaction('drop')
        }
      })
      ggbApi.current.registerObjectUpdateListener('layer', () => {
        if (ggbApi.current === null) return
        setShowHandPointer(false)
        setShowHandCounter((v) => v + 1)
        if (
          prevLayer == 2 ||
          ((prevLayer == 3 || prevLayer == 4) &&
            (ggbApi.current.getValue('layer') == 5 || ggbApi.current.getValue('layer') == 6)) ||
          ((prevLayer == 5 || prevLayer == 6) &&
            (ggbApi.current.getValue('layer') == 3 || ggbApi.current.getValue('layer') == 4))
        ) {
          playClick()
          interaction('tap')
          setPrevLayer(ggbApi.current.getValue('layer'))
        }
      })
      api.registerObjectUpdateListener('L_{1}', () => setPointerL(locatePoint2d('L_{1}', api)))
      api.registerObjectUpdateListener('M_{1}', () => setPointerM(locatePoint2d('M_{1}', api)))
    },
    [ggbApi, prevLayer],
  )
  useEffect(() => {
    const api = ggbApi.current
    if (api) {
      if (api.getValue('layer') == 3 || api.getValue('layer') == 5) {
        setShowHandPointer(true)
        setPointerM(locatePoint2d('M_{1}', api))
        setPointerL(locatePoint2d('L_{1}', api))
      }
    }
  }, [showHandCounter])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc04-s1-gb06',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore pair of vertical angles."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GgbContainer>
        <Geogebra materialId="wbayqqcn" onApiReady={onGGBHandle} />
        {showHandPointer && (
          <PlacedPlayer
            src={rotateBothSides}
            top={pointerM.top - 25}
            left={pointerM.left - 200}
            autoplay
            loop
          />
        )}
        {showHandPointer && (
          <PlacedPlayer
            src={rotateBothSides}
            top={pointerL.top - 25}
            left={pointerL.left - 200}
            autoplay
            loop
          />
        )}
      </GgbContainer>
    </AppletContainer>
  )
}
function locatePoint2d(pointName: string, ggbApi: GeogebraAppApi, xOffset = 0) {
  const pointX = ggbApi.getValue(`x(${pointName})`) + xOffset
  const pointY = ggbApi.getValue(`y(${pointName})`)
  const cornor1X = ggbApi.getValue('x(Corner(1))')
  const cornor1Y = ggbApi.getValue('y(Corner(1))')
  const cornor2X = ggbApi.getValue('x(Corner(2))')
  const cornor4Y = ggbApi.getValue('y(Corner(4))')
  const heightInPixel = ggbApi.getValue('y(Corner(5))')
  const widthInPixel = ggbApi.getValue('x(Corner(5))')
  return {
    left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
    top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
  }
}
