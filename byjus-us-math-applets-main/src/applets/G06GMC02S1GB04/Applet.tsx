import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { moveAllDirections, moveHorizontally } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { PageControl } from '@/common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const GGB = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 0;
`
const GgbContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 40px;
  scale: 0.8;
  width: 870px;
  height: 750px;
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: 250px;
  top: 70px;
  pointer-events: none;
`
const HorizontalPlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left - 120}px;
  top: ${(p) => p.top - 20}px;
  pointer-events: none;
`
const Patch = styled.div`
  position: absolute;
  bottom: 80px;
  background-color: #fff;
  width: 50px;
  height: 50px;
`
export const AppletG06GMC02S1GB04: FC<{
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
      ggbApi.current.registerObjectUpdateListener('DisableRight1', () => {
        if (ggbApi.current === null) return

        if (!ggbApi.current.getVisible('DisableRight1')) {
          setNextDisable(false)
        } else setNextDisable(true)
      })
    },
    [ggbApi],
  )
  useEffect(() => {
    switch (pageNum) {
      case 1:
        setNextDisable(false)
        break

      case 2:
        setShowHandPointer(true)
        setNextDisable(true)
        break
    }
    const api = ggbApi.current
    if (api) {
      api.registerObjectUpdateListener('MoveLine', () => setPointer(locatePoint2d('MoveLine', api)))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('MoveLine')
      }
    }
  }, [pageNum])
  const onNextHandle = () => {
    if (ggbApi.current === null) return
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
    setNextDisable(true)
    setShowHandPointer(true)
    ggbApi.current.setValue('layer', 1)
    ggbApi.current.evalCommand('RunClickScript(ResetButton)')
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-gmc02-s1-gb04',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Derive area of parallelogram by transforming it into a rectangle."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GgbContainer>
        <GGB materialId="hpceymdw" onApiReady={onGGBHandle} />
        {pageNum == 2 && showHandPointer && (
          <HorizontalPlayer
            src={moveHorizontally}
            left={pointer.left * 0.8}
            top={pointer.top * 0.8}
            autoplay
            loop
          />
        )}
      </GgbContainer>

      {pageNum == 0 && showHandPointer && <HandPlayer src={moveAllDirections} autoplay loop />}
      <Patch />
      <PageControl
        total={6}
        onChange={onPageChange}
        nextDisabled={nextDisable}
        onReset={onResetHandle}
        onNext={onNextHandle}
        onBack={onBackHandle}
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
