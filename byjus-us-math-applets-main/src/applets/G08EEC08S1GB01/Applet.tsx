import { animated, useIsomorphicLayoutEffect, useSpring } from '@react-spring/web'
import Fraction from 'fraction.js'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useContentScale } from '@/atoms/ContentScaler/ContentScaler'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { locatePoint2d } from '@/common/Geogebra/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import resetIcon from './assets/resetIcon.svg'
import viewSlopeIcon from './assets/ViewSlopeIcon.svg'

const varButtonColor = '#1a1a1a'

const StylizedGgb = styled(Geogebra)`
  width: 100%;
  height: 67%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  /* border: 1px solid #6780b2; */
  /* scale: 1.1; */
`

const BottomText = styled.div<{ top: number }>`
  width: 100%;
  margin-top: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #444444;
  justify-content: center;
  position: absolute;
  top: ${(a) => a.top}px;
`

const Btn = styled.div<{ bottom: number }>`
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

const FractionView = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 10px;
  color: ${(a) => a.color};
  text-align: center;
`

const WhiteBtn = styled.div<{ bottom: number }>`
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

const ColoredSpan = styled.span<{ color: string }>`
  color: ${(a) => a.color};
`

const Label = styled(animated.div)`
  position: absolute;
  display: flex;
  background: white;
  align-items: center;
  padding: 2px 5px;
`

interface PositionProps {
  left: number
  top: number
}

export const AppletG08EEC08S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbloaded, setGgbloaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [isFirstPointsMoved, setIsFirstPointsMoved] = useState(false)
  const [isSecondPointsMoved, setIsSecondPointsMoved] = useState(false)
  const [ismovingThePoint, setIsmovingThePoint] = useState(false)
  const [showSlopeText, setShowSlopeText] = useState(false)
  const [rise, setRise] = useState(1)
  const [run, setRun] = useState(1)
  const [showResetBtn, setShowResetBtn] = useState(false)
  const [isSlopeNegative, setIsSlopeNegative] = useState(false)

  const [posOfCurrentSlope, setPosOfCurrentSlope] = useState<PositionProps>({ left: 1, top: 1 })

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const slopeLabelPos = useSpring({
    ...posOfCurrentSlope,
    immediate: true,
  })

  const handleResetBtn = () => {
    playMouseClick()
    setIsFirstPointsMoved(false)
    setIsSecondPointsMoved(false)
    setIsmovingThePoint(false)
    setShowResetBtn(false)
    setShowSlopeText(false)
    if (ggbApi.current !== null && ggbloaded) {
      ggbApi.current.evalCommand('SetValue(counter1, 0)')
      ggbApi.current.evalCommand('SetValue(counter2, 0)')
      ggbApi.current.evalCommand('SetValue(counter3, 0)')
      ggbApi.current.evalCommand('SetValue(counter4,0)')
      ggbApi.current.evalCommand('SetValue(A, (-4,-4))')
      ggbApi.current.evalCommand('SetValue(B, (4,4))')
    }
  }

  const handleGgbApi = useCallback((api: any) => {
    ggbApi.current = api
    setGgbloaded(true)

    ggbApi.current?.registerClientListener((e: any) => {
      if (e.targets[0] === 'A') {
        setIsFirstPointsMoved(true)
      }
      if (e.targets[0] === 'B') {
        setIsSecondPointsMoved(true)
      }

      if (e.type === 'mouseDown') {
        playMouseIn()
      } else if (e.type === 'dragEnd') playMouseOut()

      if (ggbApi.current !== null) {
        const x1 = ggbApi.current?.getXcoord('A')
        const y1 = ggbApi.current?.getYcoord('A')
        const x2 = ggbApi.current?.getXcoord('B')
        const y2 = ggbApi.current?.getYcoord('B')

        const slope = (y1 - y2) / (x1 - x2)

        setIsSlopeNegative(slope < 0)
      }
    })
  }, [])

  const handleViewSlopeBtn = () => {
    playMouseClick()
    setIsmovingThePoint(true)
    setShowSlopeText(true)
    if (ggbApi.current !== null && ggbloaded) {
      ggbApi.current.evalCommand(' SetValue(counter2, 1)')
      ggbApi.current.evalCommand(' SetValue(counter1, 3)')
      ggbApi.current.evalCommand('If(counter2==1, SetValue(N,A))')
      ggbApi.current.evalCommand('If(counter2==1, SetValue(O,B))')
      ggbApi.current.evalCommand('If(counter2==1, SetValue(rise2,rise))')
      ggbApi.current.evalCommand('If(counter2==1, SetValue(run2,run))')

      ggbApi.current.evalCommand('If(m_2 <0, SetValue(text8,"-"))')
      ggbApi.current.evalCommand('If(m_3 <0, SetValue(text9,"-"))')
      ggbApi.current.evalCommand('If(m_2 >=0, SetValue(text8," "))')
      ggbApi.current.evalCommand('If(m_3 >=0, SetValue(text9," "))')
    }
    if (ggbApi.current !== null) {
      setRise(ggbApi.current.getValue('j'))
      setRun(ggbApi.current.getValue('i'))
      const val = ggbApi.current.getValue('m2')
      if (val < 0) {
        setIsSlopeNegative(true)
      }

      setPosLabel()
    }
  }

  const setPosLabel = () => {
    setPosOfCurrentSlope((prev) => {
      if (ggbApi.current === null) {
        return prev
      }
      const position = locatePoint2d('A', ggbApi.current)
      return { left: position.leftPixel + 90, top: position.topPixel + 90 }
    })
  }

  const frac = new Fraction(rise, run === 0 ? 1 : run)

  // useIsomorphicLayoutEffect(() => {
  //   ggbApi.current?.registerObjectUpdateListener('j', () => {
  //     if (ismovingThePoint && ggbloaded) {
  //       setPosOfCurrentSlope((prev) => {
  //         if (ggbApi.current === null) {
  //           return prev
  //         }
  //         const position = locatePoint2d('A', ggbApi.current)
  //         // console.log(position)
  //         return { left: position.leftPixel, top: position.topPixel }
  //       })
  //     }
  //   })

  //   return () => {
  //     ggbApi.current?.unregisterObjectUpdateListener('i')
  //   }
  // }, [ggbloaded, isFirstPointsMoved, isSecondPointsMoved])

  useIsomorphicLayoutEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.registerClientListener((e: any) => {
        if ((e.targets[0] === 'A' || e.targets[0] === 'B') && showSlopeText) {
          setShowResetBtn(true)
        }
      })
      ggbApi.current?.registerObjectUpdateListener('j', () => {
        if (ggbApi.current !== null && ggbloaded) {
          setRise(ggbApi.current.getValue('j'))
        }
      })
      ggbApi.current?.registerObjectUpdateListener('i', () => {
        if (ggbApi.current !== null) {
          setRun(ggbApi.current.getValue('i'))
        }
      })

      ggbApi.current.registerObjectUpdateListener('A', () => {
        setPosLabel()
      })

      ggbApi.current.registerObjectUpdateListener('m2', () => {
        if (ggbApi.current !== null) {
          const x1 = ggbApi.current?.getXcoord('A')
          const y1 = ggbApi.current?.getYcoord('A')
          const x2 = ggbApi.current?.getXcoord('B')
          const y2 = ggbApi.current?.getYcoord('B')

          const slope = (y1 - y2) / (x1 - x2)

          setIsSlopeNegative(slope < 0)
        }
      })
    }
    return () => {
      ggbApi.current?.unregisterObjectUpdateListener('i')
      ggbApi.current?.unregisterObjectUpdateListener('j')
      ggbApi.current?.unregisterObjectUpdateListener('m2')
      ggbApi.current?.unregisterObjectUpdateListener('A')
    }
  }, [ismovingThePoint])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g08-eec08-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore the relation between the line and the slope."
        backgroundColor="#f6f6f6"
        buttonColor="#626262"
      />
      <StylizedGgb materialId="qyqd7u7n" onApiReady={handleGgbApi} />
      {showSlopeText ? (
        <>
          {/* <Label style={slopeLabelPos}>
            slope ={' '}
            {run === 0 ? (
              <span style={{ padding: '10px' }}>∞</span>
            ) : rise === 0 ? (
              <span style={{ padding: '10px' }}>0</span>
            ) : (
              <FractionView color="#1a1a1a">
                <span style={{ padding: '0px', borderBottom: '1px solid #1a1a1a' }}>
                  {isSlopeNegative ? <span>-</span> : undefined} {frac.n}
                </span>{' '}
                {frac.d}
              </FractionView>
            )}
          </Label> */}
          <BottomText top={580}>
            {
              <>
                Slope =
                <FractionView color="#1a1a1a">
                  <ColoredSpan
                    color="#C882FA"
                    style={{ padding: '0px', borderBottom: '1px solid #1a1a1a' }}
                  >
                    Rise
                  </ColoredSpan>{' '}
                  <ColoredSpan color="#f086a4">Run</ColoredSpan>
                </FractionView>
                = {isSlopeNegative ? <span style={{ marginLeft: '5px' }}> -</span> : undefined}
                <FractionView color="#1a1a1a">
                  <ColoredSpan
                    color="#C882FA"
                    style={{ padding: '0px', borderBottom: '1px solid #1a1a1a' }}
                  >
                    {rise}
                  </ColoredSpan>{' '}
                  <ColoredSpan color="#f086a4">{run}</ColoredSpan>
                </FractionView>
                =
                {run === 0 ? (
                  <span style={{ padding: '10px' }}>∞</span>
                ) : rise === 0 ? (
                  <span style={{ padding: '10px' }}>0</span>
                ) : (
                  <FractionView color="#1a1a1a">
                    <span style={{ padding: '0px', borderBottom: '1px solid #1a1a1a' }}>
                      {isSlopeNegative ? <span>-</span> : undefined} {frac.n}
                    </span>{' '}
                    {frac.d}
                  </FractionView>
                )}
              </>
            }
          </BottomText>
        </>
      ) : (
        ggbloaded && <BottomText top={580}>Adjust the pointers to set the line.</BottomText>
      )}
      {(isFirstPointsMoved || isSecondPointsMoved) && !showSlopeText && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Btn bottom={52} onClick={handleViewSlopeBtn}>
            <img src={viewSlopeIcon} alt="viewSlope" /> View Slope
          </Btn>
        </div>
      )}

      {showResetBtn && showSlopeText && (
        <>
          <BottomText top={550}>Observe that the slope changes as the line is rotated.</BottomText>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <WhiteBtn bottom={52} onClick={handleResetBtn}>
              <img src={resetIcon} alt="viewSlope" /> Reset
            </WhiteBtn>
          </div>
        </>
      )}
    </AppletContainer>
  )
}
