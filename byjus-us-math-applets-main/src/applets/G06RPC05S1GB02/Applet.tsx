import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveAllDirections } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
const GGB = styled(Geogebra)`
  position: absolute;
  top: 80px;
  scale: 0.95;
  left: 50%;
  translate: -50%;
`
const ClickPlayer = styled(Player)`
  position: absolute;
  top: 335px;
  left: 390px;
  pointer-events: none;
`
const Patch = styled.div`
  position: absolute;
  bottom: 20px;
  left: 10px;
  background-color: #fff;
  width: 50px;
  height: 50px;
`
const MovePlayer = styled(Player)`
  position: absolute;
  top: 356px;
  left: -223px;
  pointer-events: none;
`
const GridContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 107px;
  display: grid;
  grid-template-columns: 218px 140px 140px 140px;
  grid-template-rows: 60px 60px;
  width: 642px;
  height: 112px;
  background-color: #e7fbff;
`
const GridItem = styled.div<{ colorTheme: string; bdrRadius: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  background: ${(p) =>
    p.colorTheme == 'green' ? '#ECFFD9' : p.colorTheme == 'blue' ? '#F3F7FE' : '#ffffff'};
  color: ${(p) => (p.colorTheme == 'green' ? '#6CA621' : '#444444')};
  border: 1px solid #bcd3ff;
  border-radius: ${(p) => p.bdrRadius};
`
export const AppletG06RPC05S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [showClickHand, setShowClickHand] = useState(true)
  const [showMoveHand, setShowMoveHand] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [plotPoints, setPlotPoints] = useState({ a: false, b: false, c: false })
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGgbHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (!api) return
      api.registerClientListener((e: any) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'OptionOneSelected' ||
            e.hits[0] === 'OptionOneSelected' ||
            e.hits[0] === 'FirstOption1' ||
            e.hits[0] === 'FirstOption2' ||
            e.hits[0] === 'FirstOption3' ||
            e.hits[0] === 'FirstOption4' ||
            e.hits[0] === 'FirstOption5' ||
            e.hits[0] === 'OptionTwoSelected' ||
            e.hits[0] === 'SecondOption1' ||
            e.hits[0] === 'SecondOption2' ||
            e.hits[0] === 'SecondOption3' ||
            e.hits[0] === 'SecondOption4' ||
            e.hits[0] === 'SecondOption5')
        ) {
          onInteraction('tap')
          playMouseClick()
          setShowClickHand(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Next') {
          onInteraction('next')
          playMouseClick()
          setShowMoveHand(true)
          setShowTable(true)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Plot') {
          onInteraction('next')
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Retry') {
          onInteraction('reset')
          playMouseClick()
          setShowClickHand(true)
          setShowTable(false)
          setPlotPoints({ a: false, b: false, c: false })
        } else if (e.type === 'mouseDown' && e.hits[0] === 'D') {
          onInteraction('drag')
          playMouseIn()
          setShowMoveHand(false)
        } else if (e.type === 'dragEnd' && e.target === 'D') {
          onInteraction('drop')
          playMouseOut()
        }
      })
      api.registerObjectUpdateListener('a', () => {
        if (api.getValue('a')) setPlotPoints({ ...plotPoints, a: true })
      })
      api.registerObjectUpdateListener('b', () => {
        if (api.getValue('b')) setPlotPoints({ ...plotPoints, b: true })
      })
      api.registerObjectUpdateListener('c', () => {
        if (api.getValue('c')) setPlotPoints({ ...plotPoints, c: true })
      })
    },
    [ggbApi, plotPoints],
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-rpc05-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Complete the table and graph the data."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GGB materialId="jvtdp45n" onApiReady={onGgbHandle} />
      {showTable && (
        <GridContainer>
          <GridItem colorTheme="blue" bdrRadius="8px 0px 0px 0px">
            Number of soda bottles
          </GridItem>
          <GridItem colorTheme={plotPoints.a ? 'green' : 'default'} bdrRadius="0px">
            60
          </GridItem>
          <GridItem colorTheme={plotPoints.b ? 'green' : 'default'} bdrRadius="0px">
            180
          </GridItem>
          <GridItem colorTheme={plotPoints.c ? 'green' : 'default'} bdrRadius="0px 8px 0px 0px">
            300
          </GridItem>
          <GridItem colorTheme="blue" bdrRadius="0px 0px 0px 8px">
            Time (in minutes)
          </GridItem>
          <GridItem colorTheme={plotPoints.a ? 'green' : 'default'} bdrRadius="0px">
            30
          </GridItem>
          <GridItem colorTheme={plotPoints.b ? 'green' : 'default'} bdrRadius="0px">
            90
          </GridItem>
          <GridItem colorTheme={plotPoints.c ? 'green' : 'default'} bdrRadius="0px 0px 8px 0px">
            150
          </GridItem>
        </GridContainer>
      )}
      <Patch />
      {showClickHand && <ClickPlayer src={click} autoplay loop />}
      {showMoveHand && <MovePlayer src={moveAllDirections} autoplay loop />}
    </AppletContainer>
  )
}
