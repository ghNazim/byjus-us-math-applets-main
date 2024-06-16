import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveHorizontally } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import s3 from './assets/3.svg'
import s4 from './assets/4.svg'
import s5 from './assets/5.svg'
import s6 from './assets/6.svg'
import circle from './assets/circle.svg'
import circleGreen from './assets/circleGreen.svg'
import infinity from './assets/infinity.svg'
import infinityGreen from './assets/infinityGreen.svg'
import note from './assets/note.svg'
import questionMark from './assets/questionMark.svg'
import reset from './assets/reset.svg'
import visualize from './assets/visualize.svg'
const ButtonElement = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  background: #1a1a1a;
  border-radius: 10px;
  height: 60px;
  cursor: pointer;
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`
const GridContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 120px;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto auto auto auto auto;
`
const GridItem = styled.div<{ colorTheme: string; height: number; bdrRadius: string }>`
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
  width: 220px;
  height: ${(p) => p.height}px;
  background: ${(p) => (p.colorTheme == 'green' ? '#E5FFEC' : '#ffffff')};
  color: ${(p) =>
    p.colorTheme == 'green' ? '#32A66C' : p.colorTheme == 'filled' ? '#6549C2' : '#444444'};
  border: 1px solid ${(p) => (p.colorTheme == 'green' ? '#9EFFB6' : '#f4e5ff')};
  border-radius: ${(p) => p.bdrRadius};
  span {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
`
const GGBContainer = styled.div<{ visibility: boolean }>`
  width: 815px;
  height: 700px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 50px;
  scale: 0.86;
  ${(p) => !p.visibility && 'visibility:hidden;'}
`
const OneHil = styled.div`
  position: absolute;
  left: 93%;
  top: -15px;
  width: 27px;
  height: 27px;
  background: #e7fbff;
  border: 1px solid #1cb9d9;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 27px;
  color: #1cb9d9;
  border-radius: 50%;
`
const FeedbackText = styled.div`
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  width: 700px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 540px;
  color: #444444;
`
const ColoredSpan = styled.span<{ bgColor: string; color: string }>`
  padding: 0 3px;
  background: ${(p) => p.bgColor};
  color: ${(p) => p.color};
  border-radius: 5px;
`
const ButtonDummy = styled.div<{ left: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: 633px;
  color: #444444;
  width: 120px;
  height: 65px;
  background-color: #fff;
  opacity: 0.5;
`
const MovePlayer = styled(Player)<{ top: number }>`
  position: absolute;
  left: -72px;
  top: ${(p) => p.top}px;
  pointer-events: none;
`
const ClickPlayer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
`
export const AppletG07GMC05S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [noteHil, setNoteHil] = useState(0)
  const [shape3Sides, setShape3Sides] = useState(false)
  const [shape4Sides, setShape4Sides] = useState(false)
  const [shape5Sides, setShape5Sides] = useState(false)
  const [shape6Sides, setShape6Sides] = useState(false)
  const [shapeCircle, setShapeCircle] = useState(false)
  const [showMovePoint, setShowMovePoint] = useState(false)
  const [showHandPoint, setShowHandPoint] = useState(true)
  const [topValue, setTopValue] = useState(270)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const playClick = useSFX('mouseClick')
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')
  const interaction = useContext(AnalyticsContext)
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      ggbApi.current.registerObjectUpdateListener('layer', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getValue('layer') == 1) setPageNum(0)
        if (ggbApi.current.getValue('layer') == 1.5) setPageNum(2)
        if (ggbApi.current.getValue('layer') == 2) setPageNum(3)
        if (ggbApi.current.getValue('layer') == 3) setPageNum(4)
      })
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == 'Dragger') {
          playDragStart()
          interaction('drag')
          setShowMovePoint(false)
        }
        if (event[0] == 'dragEnd' && event[1] == 'Dragger') {
          playDragEnd()
          interaction('drop')
        }
        if (
          event[0] == 'mouseDown' &&
          (event.hits[0] == 'BT0N' ||
            event.hits[0] == 'BT3N' ||
            event.hits[0] == 'BT4N' ||
            event.hits[0] == 'BT5N' ||
            event.hits[0] == 'BT6N')
        ) {
          playClick()
          interaction('tap')
          setShowHandPoint(false)
        }
      })
    },
    [ggbApi],
  )
  const onNextHandle = () => {
    playClick()
    interaction('next')
    switch (pageNum) {
      case 0:
        if (noteHil == 5) {
          setShape3Sides(false)
          setShape4Sides(false)
          setShape5Sides(false)
          setShape6Sides(false)
          setShapeCircle(false)
          setNoteHil(0)
          setShowHandPoint(true)
        } else setPageNum(1)
        break
      case 2:
        setNoteHil((h) => h + 1)
        if (ggbApi.current == null) return
        ggbApi.current.evalCommand('RunClickScript(CTANext)')
        switch (ggbApi.current.getValue('m')) {
          case 3:
            setShape3Sides(true)
            setTopValue(270)
            break
          case 4:
            setShape4Sides(true)
            setTopValue(260)
            break
          case 5:
            setShape5Sides(true)
            setTopValue(255)
            break
          case 6:
            setShape6Sides(true)
            setTopValue(250)
            break
          case 50:
            setShapeCircle(true)
            setTopValue(245)
            break
        }
        setShowMovePoint(true)
        break
      case 4:
        if (ggbApi.current == null) return
        ggbApi.current.evalCommand('RunClickScript(CTANote)')
        setPageNum(0)
        break
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc05-s1-gb04',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Form a shape that occupies the maximum area, using a thread of given length."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      {pageNum == 0 && (
        <>
          <GridContainer>
            <GridItem height={80} bdrRadius="8px 0px 0px 0px" colorTheme={''}>
              No. of sides
            </GridItem>
            <GridItem height={80} bdrRadius="0px" colorTheme={''}>
              Shape
            </GridItem>
            <GridItem height={80} bdrRadius="0px 8px 0px 0px" colorTheme={''}>
              Area (in sq.cm)
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              3
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              {<img src={s3} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={'filled'}>
              {shape3Sides ? <span>20958 sq. cm</span> : <img src={questionMark} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              4
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              {<img src={s4} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={'filled'}>
              {shape4Sides ? <span>27225 sq. cm</span> : <img src={questionMark} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              5
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              {<img src={s5} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={'filled'}>
              {shape5Sides ? <span>29978 sq. cm</span> : <img src={questionMark} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              6
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              {<img src={s6} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={'filled'}>
              {shape6Sides ? <span>31437 sq. cm</span> : <img src={questionMark} />}
            </GridItem>
            <GridItem
              height={60}
              bdrRadius="0px 0px 0px 8px"
              colorTheme={noteHil == 5 ? 'green' : ''}
            >
              {noteHil == 5 ? <img src={infinityGreen} /> : <img src={infinity} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={noteHil == 5 ? 'green' : ''}>
              {noteHil == 5 ? <img src={circleGreen} /> : <img src={circle} />}
            </GridItem>
            <GridItem
              height={60}
              bdrRadius="0px 0px 8px 0px"
              colorTheme={noteHil == 5 ? 'green' : 'filled'}
            >
              {shapeCircle ? <span>34650 sq. cm</span> : <img src={questionMark} />}
            </GridItem>
          </GridContainer>
          <FeedbackText>
            {noteHil == 0 && 'Let’s visualize the shapes to find their respective areas.'}
            {noteHil > 0 &&
              noteHil < 5 &&
              'Visualize the remaining shapes to find their respective areas.'}
            {noteHil == 5 && (
              <>
                {'As the number of sides increase, area of the shape also increases.'}
                <br />
                {'So, for a fixed perimeter, '}
                <ColoredSpan bgColor="#E5FFEC" color="#32A66C">
                  circle
                </ColoredSpan>
                {' occupies the maximum area.'}
              </>
            )}
          </FeedbackText>
        </>
      )}

      <GGBContainer visibility={pageNum > 0 ? true : false}>
        <Geogebra materialId="rjdfzzey" onApiReady={onGGBHandle} />
      </GGBContainer>
      {pageNum !== 1 && pageNum !== 3 && (
        <ButtonElement onClick={onNextHandle}>
          {pageNum == 0 &&
            (!shape3Sides || !shape4Sides || !shape5Sides || !shape6Sides || !shapeCircle) && (
              <img src={visualize} />
            )}
          {pageNum == 0 &&
            shape3Sides &&
            shape4Sides &&
            shape5Sides &&
            shape6Sides &&
            shapeCircle && <img src={reset} />}
          {pageNum == 2 && 'Next'}
          {pageNum == 4 && <img src={note} />}
          {pageNum == 4 && <OneHil>{noteHil}</OneHil>}
        </ButtonElement>
      )}
      {(pageNum == 1 || pageNum == 2) && (
        <>
          {shape3Sides && <ButtonDummy left={35} />}
          {shape4Sides && <ButtonDummy left={167} />}
          {shape5Sides && <ButtonDummy left={298} />}
          {shape6Sides && <ButtonDummy left={430} />}
          {shapeCircle && <ButtonDummy left={560} />}
        </>
      )}
      {showHandPoint && (
        <ClickPlayer
          src={click}
          loop
          autoplay
          top={pageNum == 0 ? 700 : 610}
          left={pageNum == 0 ? 300 : 40}
        />
      )}
      {showMovePoint && <MovePlayer loop autoplay src={moveHorizontally} top={topValue} />}
    </AppletContainer>
  )
}
