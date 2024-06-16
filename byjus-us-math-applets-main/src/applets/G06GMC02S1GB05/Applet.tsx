import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { moveAllDirections, moveRight, moveUp } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { PageControl } from '@/common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
const GgbContainer = styled.div`
  width: 873px;
  height: 740px;
  scale: 0.8;
  position: absolute;
  top: 20px;
  left: 50%;
  translate: -50%;
`
const GGB = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 0;
`
const DragPlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
`
const WhitePatch = styled.div`
  position: absolute;
  left: 0;
  top: 641px;
  background-color: #fff;
  width: 50px;
  height: 50px;
`
export const AppletG06GMC02S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [nextDisable, setNextDisable] = useState(true)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')
  const interaction = useContext(AnalyticsContext)
  const [pageNum, setPageNum] = useState(0)
  const [pointer, setPointer] = useState({ left: 0, top: 0 })
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setShowHandPointer(true)
      if (ggbApi.current.getValue('layer') == 1) setPointer(locatePoint2d('Drag', api))

      ggbApi.current.registerObjectUpdateListener('Drag', () => {
        if (ggbApi.current === null) return
        if (ggbApi.current.getValue('layer') == 1) setPointer(locatePoint2d('Drag', api))
      })
      ggbApi.current.registerObjectUpdateListener('MoveLine', () => {
        if (ggbApi.current === null) return
        if (ggbApi.current.getValue('layer') == 3) setPointer(locatePoint2d('MoveLine', api))
      })
      ggbApi.current.registerObjectUpdateListener('MoveUp', () => {
        if (ggbApi.current === null) return
        if (ggbApi.current.getValue('layer') == 5) setPointer(locatePoint2d('MoveUp', api))
      })
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == 'DragPoint') {
          playDragStart()
          interaction('drag')
          setShowHandPointer(false)
        }
        if (event[0] == 'dragEnd' && event[1] == 'DragPoint') {
          playDragEnd()
          interaction('drop')
          setNextDisable(false)
        }
      })
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == 'DragRight') {
          playDragStart()
          interaction('drag')
          setShowHandPointer(false)
        }
        if (event[0] == 'dragEnd' && event[1] == 'DragRight') {
          playDragEnd()
          interaction('drop')
        }
      })
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == 'DragUp') {
          playDragStart()
          interaction('drag')
          setShowHandPointer(false)
        }
        if (event[0] == 'dragEnd' && event[1] == 'DragUp') {
          playDragEnd()
          interaction('drop')
        }
      })
      ggbApi.current.registerObjectUpdateListener('DisableRight1', () => {
        if (ggbApi.current === null) return
        if (ggbApi.current.getValue('layer') == 3 || ggbApi.current.getValue('layer') == 4) {
          ggbApi.current.getVisible('DisableRight1') ? setNextDisable(true) : setNextDisable(false)
        }
      })
      ggbApi.current.registerObjectUpdateListener('DisableRight3_{1}', () => {
        if (ggbApi.current === null) return
        if (ggbApi.current.getValue('layer') == 5 || ggbApi.current.getValue('layer') == 6) {
          ggbApi.current.getVisible('DisableRight3_{1}')
            ? setNextDisable(true)
            : setNextDisable(false)
        }
      })
      ggbApi.current.registerObjectUpdateListener('DisableRight3', () => {
        if (ggbApi.current === null) return
        if (ggbApi.current.getValue('layer') == 8) {
          ggbApi.current.getVisible('DisableRight3') ? setNextDisable(true) : setNextDisable(false)
        }
      })
    },
    [interaction, playDragEnd, playDragStart, ggbApi],
  )
  const onNextHandle = () => {
    if (ggbApi.current === null) return
    if (pageNum == 1 || pageNum == 2) setShowHandPointer(true)
    ggbApi.current.evalCommand('RunClickScript(NavRight)')
  }
  const onBackHandle = () => {
    if (ggbApi.current === null) return
    ggbApi.current.evalCommand('RunClickScript(NavLeft)')
  }
  const onPageChange = useCallback((current: number) => {
    setPageNum(current)
  }, [])
  const onResetHandle = () => {
    if (ggbApi.current === null) return
    ggbApi.current.setValue('layer', 1)
    setShowHandPointer(true)
    setNextDisable(true)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-gmc02-s1-gb05',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Derive area of rhombus by transforming it into a rectangle."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GgbContainer>
        <GGB materialId="hanekcjb" onApiReady={onGGBHandle} />
        {showHandPointer && pageNum == 0 && (
          <DragPlayer
            src={moveAllDirections}
            autoplay
            loop
            left={pointer.left - 300}
            top={pointer.top - 160}
          />
        )}
        {showHandPointer && pageNum == 2 && (
          <DragPlayer
            src={moveRight}
            autoplay
            loop
            left={pointer.left - 200}
            top={pointer.top - 50}
          />
        )}
        {showHandPointer && pageNum == 3 && (
          <DragPlayer src={moveUp} autoplay loop left={pointer.left - 50} top={pointer.top - 200} />
        )}
      </GgbContainer>
      <WhitePatch />
      <PageControl
        total={8}
        onNext={onNextHandle}
        onBack={onBackHandle}
        onChange={onPageChange}
        nextDisabled={nextDisable}
        onReset={onResetHandle}
      />
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
