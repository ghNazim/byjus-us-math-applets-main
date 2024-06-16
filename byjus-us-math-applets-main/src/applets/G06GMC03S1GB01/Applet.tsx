import { Player } from '@lottiefiles/react-lottie-player'
import { help } from 'mathjs'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { moveAllDirections, moveHorizontally } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { PageControl } from '@/common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
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
  top: 60px;
  scale: 0.85;
  width: 798px;
  height: 498.75px;
`
const HelperText = styled.div<{ top: number }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: ${(p) => p.top}px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  pointer-events: none;
`
const ColouredSpan = styled.span<{ bgColor: string; color: string }>`
  padding: 0 3px;
  margin: 0 3px;
  background: ${(p) => p.bgColor};
  color: ${(p) => p.color};
  border-radius: 5px;
`
const Fraction = styled.div`
  width: fit-content;
  min-width: 24px;
  height: 60px;
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
  margin: 0 5px;
`
const FractionText = styled.div`
  width: 100%;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #444444;
  text-align: center;
  padding: 0 3px;
`
const FractionLine = styled.div`
  width: 100%;
  height: 0px;
  border: 2px solid #444444;
  border-radius: 25px;
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: 53px;
  top: 100px;
  pointer-events: none;
`
const HorizontalPlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
`
const Patch = styled.div`
  position: absolute;
  top: 468px;
  left: 20px;
  background-color: #f3f7fe;
  width: 50px;
  height: 50px;
`
export const AppletG06GMC03S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [nextDisable, setNextDisable] = useState(true)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const [backDisable, setBackDisable] = useState(false)
  const [timer, setTimer] = useState(false)
  const [counter, setCounter] = useState(4000)
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')
  const interaction = useContext(AnalyticsContext)
  const [helperText, setHelperText] = useState(0)
  const [pageNum, setPageNum] = useState(0)
  const [pointer, setPointer] = useState({ left: 0, top: 0 })

  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setShowHandPointer(true)
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == 'c_1') {
          playDragStart()
          interaction('drag')
          setShowHandPointer(false)
        }
        if (event[0] == 'dragEnd' && event[1] == 'c_1') {
          playDragEnd()
          interaction('drop')
          setNextDisable(false)
        }
      })
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == 'd_1') {
          playDragStart()
          interaction('drag')
          setShowHandPointer(false)
        }
        if (event[0] == 'dragEnd' && event[1] == 'd_1') {
          playDragEnd()
          interaction('drop')
        }
      })
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == 't4') {
          playDragStart()
          interaction('drag')
        }
        if (event[0] == 'dragEnd' && event[1] == 't4') {
          playDragEnd()
          interaction('drop')
          setShowHandPointer(false)
        }
      })
      ggbApi.current.registerObjectUpdateListener('w', () => {
        if (ggbApi.current === null) return

        if (ggbApi.current.getVisible('w')) {
          setTimer(true)
          setBackDisable(true)
        }
      })
    },
    [ggbApi],
  )

  useInterval(
    () => {
      if (pageNum == 2) {
        setNextDisable(false)
        setBackDisable(false)
        setTimer(false)
      } else if (pageNum == 3) {
        if (helperText == 0) {
          setHelperText(1)
          setCounter(600)
        } else if (helperText == 1) {
          setHelperText(2)
          setNextDisable(false)
          setBackDisable(false)
          setTimer(false)
        }
      } else if (pageNum == 4) {
        if (helperText == 2) {
          setHelperText(3)
          setCounter(800)
        } else if (helperText == 3) {
          setHelperText(4)
          setNextDisable(false)
          setBackDisable(false)
          setTimer(false)
        }
      } else if (pageNum == 5) {
        if (helperText == 4) {
          setHelperText(5)
          setTimer(false)
          setNextDisable(false)
          setBackDisable(false)
        }
      } else if (pageNum == 6) {
        if (helperText == 5) {
          setHelperText(6)
          setNextDisable(false)
          setBackDisable(false)
          setTimer(false)
        }
      }
    },
    timer ? counter : null,
  )
  const onNextHandle = () => {
    switch (pageNum) {
      case 0:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(button2)')
        break
      case 1:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(Nxt2)')
        setBackDisable(true)
        setNextDisable(true)
        setTimer(true)
        setCounter(4000)
        break
      case 2:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(Nxt3)')
        setNextDisable(true)
        setBackDisable(true)
        setTimer(true)
        setCounter(4500)
        setHelperText(0)
        setShowHandPointer(true)
        break
      case 3:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(Nxt4)')
        setNextDisable(true)
        setCounter(1250)
        setHelperText(2)
        break
      case 4:
        setHelperText(4)
        setTimer(true)
        setNextDisable(true)
        setBackDisable(true)
        break
      case 5:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(Nxt5)')
        setNextDisable(true)
        setBackDisable(true)
        setTimer(true)
        setHelperText(5)
        break
      case 6:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(Nxt6)')
        break
    }
  }
  const onBackHandle = () => {
    switch (pageNum) {
      case 1:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(back1)')
        setNextDisable(false)
        break
      case 2:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(Back2)')
        setNextDisable(false)
        break
      case 3:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(Back3)')
        setNextDisable(false)
        break
      case 4:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(Back4)')
        setNextDisable(false)
        setHelperText(2)
        break
      case 5:
        setNextDisable(false)
        setHelperText(4)
        break
      case 6:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(Back5)')
        setNextDisable(false)
        setBackDisable(false)
        setHelperText(5)
        break
      case 7:
        if (ggbApi.current === null) return
        ggbApi.current.evalCommand('RunClickScript(Back6)')
        setNextDisable(false)
        break
    }
  }
  const onPageChange = useCallback((current: number) => {
    setPageNum(current)
  }, [])
  const onResetHandle = () => {
    if (ggbApi.current === null) return
    ggbApi.current.evalCommand('RunClickScript(Reset)')
    setHelperText(0)
    setNextDisable(true)
    setShowHandPointer(true)
  }
  useEffect(() => {
    const api = ggbApi.current
    if (api) {
      api.registerObjectUpdateListener('AAAT', () => setPointer(locatePoint2d('AAAT', api)))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('AAAT')
      }
    }
  }, [pageNum])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-gmc03-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Derive area of triangle by transforming it into a rectangle."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GgbContainer>
        <GGB materialId="t3hq4z6j" onApiReady={onGGBHandle} />
        {pageNum == 4 && showHandPointer && (
          <HorizontalPlayer
            src={moveHorizontally}
            left={pointer.left * 0.85 - 130}
            top={pointer.top * 0.85 - 25}
            autoplay
            loop
          />
        )}
      </GgbContainer>

      {pageNum == 0 && showHandPointer && <HandPlayer src={moveAllDirections} loop autoplay />}
      <HelperText top={576}>
        {pageNum == 0 && 'Move the vertex to create a triangle of your choice.'}
        {pageNum == 1 && 'Good job! Now create an identical triangle.'}
        {pageNum == 2 && (
          <>
            {'Flip and join the new triangle to the original to form a '}
            <ColouredSpan bgColor="#FFF2E5" color="#FF8F1F">
              parallelogram.
            </ColouredSpan>
          </>
        )}
        {pageNum == 4 && helperText == 2 && (
          <>
            {'To create rectangle, move the selected triangle to the '}
            <ColouredSpan bgColor="#F4E5FF" color="#AA5EE0">
              marked region
            </ColouredSpan>
            {'.'}
          </>
        )}
        {pageNum == 7 && (
          <>
            {'Area of the '}
            <ColouredSpan bgColor="#E7FBFF" color="#1CB9D9">
              triangle
            </ColouredSpan>{' '}
            {' = '}
            <Fraction>
              <FractionText>1</FractionText>
              <FractionLine />
              <FractionText>2</FractionText>
            </Fraction>
            {' x '}
            <ColouredSpan bgColor="#7F5CF4" color="#FFFFFF">
              base
            </ColouredSpan>
            {' x '}
            <ColouredSpan bgColor="#F4E5FF" color="#AA5EE0">
              height
            </ColouredSpan>
          </>
        )}
      </HelperText>
      <HelperText top={550}>
        {pageNum == 3 && helperText >= 1 && (
          <>
            {'Length of the '}
            <ColouredSpan bgColor="#FFF2E5" color="#FF8F1F">
              parallelogram
            </ColouredSpan>
            {' = '}
            <ColouredSpan bgColor="#7F5CF4" color="#FFFFFF">
              base of triangle
            </ColouredSpan>
          </>
        )}
        {pageNum == 4 && helperText >= 3 && (
          <>{'Since, this rectangle is composed of 2 identical triangle.'}</>
        )}
        {pageNum == 5 && (
          <>
            {'Area of the '}
            <ColouredSpan bgColor="#E7FBFF" color="#1CB9D9">
              triangle
            </ColouredSpan>
            {' = '}
            <Fraction>
              <FractionText>1</FractionText>
              <FractionLine />
              <FractionText>2</FractionText>
            </Fraction>
            {' (Area of the '}
            <ColouredSpan bgColor="#FFF2E5" color="#FF8F1F">
              rectangle
            </ColouredSpan>
            {')'}
          </>
        )}
        {pageNum == 6 && (
          <>
            {'Area of the '}
            <ColouredSpan bgColor="#E7FBFF" color="#1CB9D9">
              triangle
            </ColouredSpan>
            {' = '}
            <Fraction>
              <FractionText>1</FractionText>
              <FractionLine />
              <FractionText>2</FractionText>
            </Fraction>
            {' x '}
            <ColouredSpan bgColor="#7F5CF4" color="#FFFFFF">
              b
            </ColouredSpan>
            {' x '}
            <ColouredSpan bgColor="#F4E5FF" color="#AA5EE0">
              h
            </ColouredSpan>
          </>
        )}
      </HelperText>
      <HelperText top={602}>
        {pageNum == 3 && helperText == 2 && (
          <>
            {'Height of the '}
            <ColouredSpan bgColor="#FFF2E5" color="#FF8F1F">
              parallelogram
            </ColouredSpan>
            {' = '}
            <ColouredSpan bgColor="#F4E5FF" color="#AA5EE0">
              height of triangle
            </ColouredSpan>
          </>
        )}
        {pageNum == 4 && helperText == 4 && (
          <>
            {'2 x Area of the '}
            <ColouredSpan bgColor="#E7FBFF" color="#1CB9D9">
              triangle
            </ColouredSpan>
            {' = Area of the '}
            <ColouredSpan bgColor="#FFF2E5" color="#FF8F1F">
              rectangle
            </ColouredSpan>
          </>
        )}
        {pageNum == 5 && helperText == 5 && (
          <>
            <ColouredSpan bgColor="#fff" color="#fff">
              {'= ='}
            </ColouredSpan>
            {' = '}
            <Fraction>
              <FractionText>1</FractionText>
              <FractionLine />
              <FractionText>2</FractionText>
            </Fraction>
            {' x '}
            <ColouredSpan bgColor="#7F5CF4" color="#FFFFFF">
              b
            </ColouredSpan>
            {' x '}
            <ColouredSpan bgColor="#F4E5FF" color="#AA5EE0">
              h
            </ColouredSpan>
          </>
        )}
        {pageNum == 6 && helperText == 6 && (
          <>
            <ColouredSpan bgColor="#fff" color="#fff">
              {'Area of the given triangle is '}
            </ColouredSpan>
            {' = '}
            <Fraction>
              <FractionText>1</FractionText>
              <FractionLine />
              <FractionText>2</FractionText>
            </Fraction>
            {' x '}
            <ColouredSpan bgColor="#7F5CF4" color="#FFFFFF">
              base
            </ColouredSpan>
            {' x '}
            <ColouredSpan bgColor="#F4E5FF" color="#AA5EE0">
              height
            </ColouredSpan>
          </>
        )}
      </HelperText>
      {pageNum > 1 && <Patch />}
      <PageControl
        total={8}
        onNext={onNextHandle}
        onBack={onBackHandle}
        onChange={onPageChange}
        nextDisabled={nextDisable}
        backDisabled={backDisable}
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
