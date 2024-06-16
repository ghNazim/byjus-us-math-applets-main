import { animated, useSpring } from '@react-spring/web'
import Fraction from 'fraction.js'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { locatePoint2d } from '@/common/Geogebra/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useSFX } from '@/hooks/useSFX'

import CircularMarker from './assets/CircularMarkerNew.svg'
import ResetIcon from './assets/resetIcon.svg'
import viewSlopeIcon from './assets/ViewSlopeIcon.svg'

const varHeaderColor = '#f6f6f6'
const varButtonColor = '#1a1a1a'

const AnimOnBoarding = styled(OnboardingAnimation).attrs({ type: 'moveAllDirections' })<{
  top: number
  left: number
}>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  height: 300px;
  width: 300px;
  pointer-events: none;
  z-index: 2;
`
const AnimOnBoardingCliclk = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  bottom: -40px;
  left: 300px;
  height: 150px;
  width: 150px;
  pointer-events: none;
  z-index: 2;
`

const StylizedGGB = styled(Geogebra)`
  width: 100%;
  height: 700px;
  /* background-color: red; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* scale: 1.3; */
`

const BottomText = styled.div<{ bottom: number }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  bottom: ${(a) => a.bottom}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
`

const CoordinateAxisTexts = styled.div<{ left: number; top: number }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: #444444;
`

const Btn = styled(animated.div)<{ bottom: number }>`
  position: absolute;
  bottom: ${(a) => a.bottom}px;
  display: flex;
  background: ${varButtonColor};
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  margin: auto;
  gap: 1rem;
  cursor: pointer;
`

const WhiteBtn = styled(animated.div)<{ bottom: number }>`
  position: absolute;
  bottom: ${(a) => a.bottom}px;
  display: flex;
  background: white;
  color: #1a1a1a;
  padding: 10px 15px;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  margin: auto;
  gap: 1rem;
  cursor: pointer;
  border: 2px solid #1a1a1a;
`

const Labels = styled(animated.div)<{ opacity?: number }>`
  position: absolute;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  color: #ff8f1f;
  opacity: ${(a) => a.opacity};
`

const ShowSlopBoxes = styled(animated.div)<{ bgColor: string; color: string }>`
  background-color: ${(a) => a.bgColor};
  color: ${(a) => a.color};
  border: ${(a) => `1px solid ${a.color};`};
  display: flex;
  padding: 5px 15px;
  border-radius: 8px;
  /* position: absolute; */
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  /* bottom: 85px; */
  align-items: center;
  margin: 0 20px;
`

const FractionView = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 7px;
  color: ${(a) => a.color};
  text-align: center;
  padding-right: 7px;
`

const NegativeSpan = styled.span<{ color?: string }>`
  padding-left: 7px;
  color: ${(a) => (a.color ? a.color : undefined)};
`

const FractionContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;

  position: absolute;
  bottom: 80px;
`

const Marker = styled(animated.img)`
  position: absolute;
  cursor: pointer;
  pointer-events: none;
`

export const AppletG08EEC08S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [pointOneChanged, setPointOneChanged] = useState(false)
  const [pointTwoChanged, setPointTwoChanged] = useState(false)
  const [showSlopeBtn, setShowSlopebtn] = useState(false)
  const [showNextBtn, setShownextbtn] = useState(false)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [showSecondSlope, setShowSecondSlope] = useState(false)
  const [savedPoint, setSavedPoint] = useState({ x: 1, y: 1 })
  const [lengthOfX, setLengthOfX] = useState(1)
  const [lengthOfY, setLengthOfY] = useState(1)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const [pointOnePosition, setPointOnePosition] = useState({ left: 1, top: 1 })
  const [pointTwoPosition, setPointTwoPosition] = useState({ left: 1, top: 1 })
  const [positionOfHorizontalDistanceLabel, setPositionOfHorizontalDistanceLabel] = useState({
    left: 0,
    top: 0,
  })
  const [horizontalLength, setHorizontalLength] = useState(1)
  const [positionOfVerticalDistanceLabel, setPositionOfVerticalDistanceLabel] = useState({
    left: 0,
    top: 0,
  })
  const [verticalLength, setVerticalLength] = useState(1)
  const [secondSlopePointOneChanged, setSecondSlopePointOneChanged] = useState(false)
  const [secondSlopePointTwoChanged, setSecondSlopePointTwoChanged] = useState(false)
  const [secondSlopePointOnePosition, setSecondSlopePointOnePosition] = useState({
    left: 0,
    top: 0,
  })
  const [secondSlopePointTwoPosition, setSecondSlopePointTwoPosition] = useState({
    left: 0,
    top: 0,
  })

  const handleReset = () => {
    if (ggbApi.current && ggbLoaded) {
      const api = ggbApi.current
      api.evalCommand('SetValue(next,0); SetValue(B,(5,4)); SetValue(C,(-5,-4))')
      setPointOneChanged(false)
      setPointTwoChanged(false)
      setShowSlopebtn(false)
      setShowSecondSlope(false)
      setSecondSlopePointOneChanged(false)
      setSecondSlopePointTwoChanged(false)
    }
    playMouseClick()
  }

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 1000,
  })

  const pointOnePos = useSpring({
    left: pointOnePosition.left - 10,
    top: pointOnePosition.top - 10,
    immediate: true,
  })

  const pointOneMarkerPos = useSpring({
    left: pointOnePosition.left + 18,
    top: pointOnePosition.top - 5,
    immediate: true,
  })
  const pointTwoMarkerPos = useSpring({
    left: pointTwoPosition.left + 18,
    top: pointTwoPosition.top - 5,
    immediate: true,
  })

  const pointTwoPos = useSpring({
    left: pointTwoPosition.left - 10,
    top: pointTwoPosition.top - 10,
    immediate: true,
  })

  const horizontalDistancelabelPos = useSpring({
    ...positionOfHorizontalDistanceLabel,
    immediate: true,
  })
  const verticalDistancelabelPos = useSpring({
    ...positionOfVerticalDistanceLabel,
    immediate: true,
  })

  const slope2PointOnePos = useSpring({
    left: secondSlopePointOnePosition.left - 5,
    top: secondSlopePointOnePosition.top - 5,
    immediate: true,
  })
  const slope2PointTwoPos = useSpring({
    left: secondSlopePointTwoPosition.left - 5,
    top: secondSlopePointTwoPosition.top - 5,
    immediate: true,
  })

  const slope2PointDPos = useSpring({
    left: secondSlopePointOnePosition.left - 20,
    top: secondSlopePointOnePosition.top - 20,
    immediate: true,
  })
  const slope2PointEPos = useSpring({
    left: secondSlopePointTwoPosition.left - 20,
    top: secondSlopePointTwoPosition.top - 20,
    immediate: true,
  })

  const frac = new Fraction(savedPoint.y, savedPoint.x === 0 ? 1 : savedPoint.x)

  const onGGBReady = useCallback((api: any) => {
    ggbApi.current = api
    setGgbLoaded(api != null)

    ggbApi.current?.registerClientListener((e: any) => {
      if (e.type === 'mouseDown') playMouseIn()
      else if (e.type === 'dragEnd') playMouseOut()

      if (e.type === 'select') {
        if (e.target === 'B') setPointOneChanged(true)
        if (e.target === 'C') setPointTwoChanged(true)
      }
    })
  }, [])

  useEffect(() => {
    const api = ggbApi.current
    if (api != null && ggbLoaded) {
      const updateSavedPoint = () => {
        const x1 = api.getXcoord('B')
        const x2 = api.getXcoord('C')
        const y1 = api.getYcoord('B')
        const y2 = api.getYcoord('C')

        setSavedPoint({ x: x2 - x1, y: y2 - y1 })
      }
      api.registerObjectUpdateListener('B', updateSavedPoint)
      api.registerObjectUpdateListener('C', updateSavedPoint)

      return () => {
        api.unregisterObjectUpdateListener('B')
        api.unregisterObjectUpdateListener('C')
      }
    }
  }, [ggbLoaded])

  useIsomorphicLayoutEffect(() => {
    //to update the position of horizontal, vertical length labels
    const bottomPoint =
      pointOnePosition.top > pointTwoPosition.top ? pointOnePosition : pointTwoPosition

    const topPoint =
      pointOnePosition.top < pointTwoPosition.top ? pointOnePosition : pointTwoPosition

    const leftPoint =
      pointOnePosition.left < pointTwoPosition.left ? pointOnePosition : pointTwoPosition

    const rightPoint =
      pointOnePosition.left > pointTwoPosition.left ? pointOnePosition : pointTwoPosition

    const updateHorizontalDistanceLabel = () => {
      const left = leftPoint.left + (rightPoint.left - leftPoint.left) / 2
      const top = bottomPoint.top
      if (ggbApi.current) setHorizontalLength(ggbApi.current.getValue('k'))

      setPositionOfHorizontalDistanceLabel({
        left: left > 250 && left < 330 ? 270 : left + 30,
        top: top > 330 && top < 400 ? (top < 390 && top > 320 ? 390 : 390) : top + 20,
      })
      //this is to prevent overlapping of axeses with the label
    }

    const updateVerticalDistancelabel = () => {
      const left = frac.s == -1 ? leftPoint.left : rightPoint.left
      const top = topPoint.top + (bottomPoint.top - topPoint.top) / 2
      if (ggbApi.current) {
        setVerticalLength((frac.n * horizontalLength) / frac.d)
      }
      setPositionOfVerticalDistanceLabel({
        left:
          frac.s == 1
            ? left > 256 && left < 306
              ? 296
              : left + 50
            : left % 335 > 45
            ? left - 20
            : 290,
        top: top > 300 && top < 370 ? 310 : top + 30,
      })
      //this is to prevent overlapping of axeses with the label
    }

    updateHorizontalDistanceLabel()
    updateVerticalDistancelabel()
  }, [pointOnePosition, pointTwoPosition])

  useEffect(() => {
    setVerticalLength((frac.n * horizontalLength) / frac.d)
  }, [horizontalLength])

  useIsomorphicLayoutEffect(() => {
    if (pointOneChanged || pointTwoChanged) {
      setShowSlopebtn(true)
      if (ggbApi.current) {
        // ggbApi.current.unregisterClientListener()
        const pos1 = locatePoint2d('E', ggbApi.current)
        const pos2 = locatePoint2d('D', ggbApi.current)

        setPointOnePosition({ left: pos1.leftPixel, top: pos1.topPixel })
        setPointTwoPosition({ left: pos2.leftPixel, top: pos2.topPixel })
      }
    }
  }, [pointOneChanged, pointTwoChanged])

  const showSlope = () => {
    playMouseClick()
    ggbApi.current?.evalCommand('SetValue(next,1);SetValue(D,B); SetValue(E,C);')
    setShowSlopebtn(false)
    setShownextbtn(true)
  }

  useIsomorphicLayoutEffect(() => {
    ggbApi.current?.registerObjectUpdateListener('E', () => {
      if (ggbApi.current) {
        const pos = locatePoint2d('E', ggbApi.current)
        setPointOnePosition({ left: pos.leftPixel - 23, top: pos.topPixel + 90 })
      }
    })

    ggbApi.current?.registerObjectUpdateListener('D', () => {
      if (ggbApi.current) {
        const pos = locatePoint2d('D', ggbApi.current)
        setPointTwoPosition({ left: pos.leftPixel - 23, top: pos.topPixel + 90 })
      }
    })

    ggbApi.current?.registerObjectUpdateListener('G', () => {
      if (ggbApi.current) {
        const pos3 = locatePoint2d('G', ggbApi.current)
        setSecondSlopePointOnePosition({ left: pos3.leftPixel - 5, top: pos3.topPixel + 90 })
      }
    })

    ggbApi.current?.registerObjectUpdateListener('F', () => {
      if (ggbApi.current) {
        const pos4 = locatePoint2d('F', ggbApi.current)
        setSecondSlopePointTwoPosition({ left: pos4.leftPixel - 5, top: pos4.topPixel + 88 })
      }
    })

    return () => {
      ggbApi.current?.unregisterObjectUpdateListener('E')
      ggbApi.current?.unregisterObjectUpdateListener('D')
      ggbApi.current?.unregisterObjectUpdateListener('G')
      ggbApi.current?.unregisterObjectUpdateListener('F')
      // ggbApi.current?.unregisterObjectUpdateListener('E')
    }
  }, [ggbLoaded])

  const handleNextBtn = () => {
    playMouseClick()
    ggbApi.current?.evalCommand('SetValue(next,2)')
    setShownextbtn(false)
    setShowSecondSlope(true)
  }

  useEffect(() => {
    if (ggbApi.current !== null && showSecondSlope) {
      ggbApi.current.registerClientListener((e: any) => {
        if (e.target === 'G') setSecondSlopePointOneChanged(true)
        if (e.target === 'F') setSecondSlopePointTwoChanged(true)
      })
    }
  }, [showSecondSlope])

  useEffect(() => {
    if (ggbApi.current !== null && (secondSlopePointOneChanged || secondSlopePointTwoChanged)) {
      ggbApi.current.registerObjectUpdateListener('q', () => {
        if (ggbApi.current) {
          setLengthOfX(ggbApi.current.getValue('q'))
        }
      })
      // ggbApi.current.registerObjectUpdateListener('p', () => {
      //   if (ggbApi.current) {
      //     setLengthOfY(ggbApi.current.getValue('p'))
      //   }
      // })
    }

    return () => {
      ggbApi.current?.unregisterObjectUpdateListener('p')
      ggbApi.current?.unregisterObjectUpdateListener('q')
    }
  }, [secondSlopePointOneChanged, secondSlopePointTwoChanged])

  useEffect(() => {
    setLengthOfY((lengthOfX * frac.n) / frac.d)
  }, [lengthOfX])

  const showValueWithDots = (val: number) => {
    const toString = val.toString()
    if (toString.length > 3) {
      return val.toFixed(2) + '...'
    } else {
      return String(val)
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: `${varHeaderColor}`,
        id: 'g08-eec08-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore the relation between slopes of the same line."
        backgroundColor={varHeaderColor}
        buttonColor={varButtonColor}
      />
      <StylizedGGB materialId="gjy9gu3j" width={700} height={500} onApiReady={onGGBReady} />

      {ggbLoaded && (
        <>
          <CoordinateAxisTexts left={673} top={336}>
            x
          </CoordinateAxisTexts>
          <CoordinateAxisTexts left={365} top={117}>
            y
          </CoordinateAxisTexts>
          {showNextBtn ? (
            <BottomText bottom={showNextBtn ? 100 : 40}>
              Adjust the pointers to set the slope of AB.
            </BottomText>
          ) : (
            !showSecondSlope && (
              <BottomText bottom={showNextBtn ? 100 : 40}>
                Adjust the pointers to set the line.
              </BottomText>
            )
          )}
          {showSecondSlope && (
            <BottomText bottom={100}>Adjust the pointers to set slope of DE.</BottomText>
          )}
          {showSlopeBtn && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Btn bottom={20} style={fadeIn} onClick={showSlope}>
                <img src={viewSlopeIcon} alt="" />
                View Slope
              </Btn>
            </div>
          )}
          {showNextBtn && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Btn bottom={20} style={fadeIn} onClick={handleNextBtn}>
                Next
              </Btn>
            </div>
          )}

          {showNextBtn && (
            <>
              <Labels style={pointOnePos}>A</Labels>
              <Labels style={pointTwoPos}>B</Labels>
              <Marker src={CircularMarker} style={pointOneMarkerPos} />
              <Marker src={CircularMarker} style={pointTwoMarkerPos} />
            </>
          )}
          {showSecondSlope && (
            <>
              <Marker src={CircularMarker} style={slope2PointOnePos} />
              <Marker src={CircularMarker} style={slope2PointTwoPos} />
              <Labels style={slope2PointDPos}>D</Labels>
              <Labels style={slope2PointEPos}>E</Labels>
            </>
          )}
          {showNextBtn || showSecondSlope ? (
            <>
              {horizontalLength !== 0 && (
                <Labels opacity={showSecondSlope ? 0.5 : 1} style={horizontalDistancelabelPos}>
                  {showValueWithDots(horizontalLength)}
                </Labels>
              )}
              {verticalLength > 0.3 && (
                <Labels opacity={showSecondSlope ? 0.5 : 1} style={verticalDistancelabelPos}>
                  {showValueWithDots(verticalLength)}
                </Labels>
              )}
              <FractionContainer>
                <ShowSlopBoxes bgColor="#FFF2E5" color="#FF8F1F">
                  Slope of AB = {frac.s == -1 ? <NegativeSpan>-</NegativeSpan> : undefined}
                  <FractionView color='"#FF8F1F"'>
                    <span style={{ padding: '0px', borderBottom: '1px solid #FF8F1F' }}>
                      {showValueWithDots(verticalLength)}
                    </span>{' '}
                    {showValueWithDots(horizontalLength)}
                  </FractionView>
                  =
                  {savedPoint.x === 0 ? (
                    <span style={{ padding: '10px' }}>∞</span>
                  ) : (
                    <>
                      {frac.s == -1 ? <NegativeSpan color="#1a1a1a">-</NegativeSpan> : undefined}
                      <FractionView color="#1a1a1a">
                        <span style={{ padding: '0px', borderBottom: '1px solid #1a1a1a' }}>
                          {frac.n}
                        </span>{' '}
                        {frac.d}
                      </FractionView>
                    </>
                  )}
                </ShowSlopBoxes>
                {showSecondSlope && (
                  <>
                    <ShowSlopBoxes bgColor="#FAF2FF" color="#AA5EE0">
                      Slope of DE = {frac.s == -1 ? <NegativeSpan>-</NegativeSpan> : undefined}
                      <FractionView color="#AA5EE0">
                        <span style={{ padding: '0px', borderBottom: '1px solid #AA5EE0' }}>
                          {' '}
                          {secondSlopePointOneChanged || secondSlopePointTwoChanged ? (
                            <> {showValueWithDots(lengthOfY)}</>
                          ) : (
                            'y'
                          )}
                        </span>{' '}
                        {secondSlopePointOneChanged || secondSlopePointTwoChanged
                          ? showValueWithDots(lengthOfX)
                          : 'x'}
                      </FractionView>
                      =
                      {savedPoint.x === 0 ? (
                        <span style={{ padding: '10px' }}>∞</span>
                      ) : (
                        <>
                          {frac.s == -1 ? (
                            <NegativeSpan color="#1a1a1a">-</NegativeSpan>
                          ) : undefined}
                          <FractionView color="#1a1a1a">
                            <span style={{ padding: '0px', borderBottom: '1px solid #1a1a1a' }}>
                              {frac.n}
                            </span>{' '}
                            {frac.d}
                          </FractionView>
                        </>
                      )}
                    </ShowSlopBoxes>
                  </>
                )}
              </FractionContainer>
            </>
          ) : undefined}
          {secondSlopePointOneChanged || secondSlopePointTwoChanged ? (
            <>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <WhiteBtn bottom={10} style={fadeIn} onClick={handleReset}>
                  <img src={ResetIcon} alt="" />
                  Reset
                </WhiteBtn>
              </div>
            </>
          ) : undefined}
        </>
      )}
      <OnboardingController>
        <OnboardingStep index={0}>
          <AnimOnBoarding top={105} left={420} complete={pointOneChanged || pointTwoChanged} />
        </OnboardingStep>
        <OnboardingStep index={1}>
          <AnimOnBoardingCliclk complete={showNextBtn} />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}
