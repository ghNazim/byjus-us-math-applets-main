import { animated, useSpring } from '@react-spring/web'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  top: 100px;
  left: 53%;
  translate: -50%;
`
const BoxContainer = styled.div`
  position: absolute;
  top: 615px;
  left: 50%;
  translate: -50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 20px;
`
const BoxABC = styled.div`
  box-sizing: border-box;
  width: 330px;
  height: 107px;
  background: rgba(255, 242, 229, 0.4);
  border: 1px solid #d97a1a;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const BoxDEF = styled.div`
  box-sizing: border-box;
  width: 330px;
  height: 107px;
  background: rgba(250, 242, 255, 0.4);
  border: 1px solid #aa5ee0;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const BoxText = styled.p`
  /* font-family: 'Nunito'; */
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 0px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #1a1a1a;
`
const PageText = styled.p`
  position: absolute;
  top: 730px;
  left: 50%;
  translate: -50%;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #1a1a1a;
`
const RedAngle1 = styled(animated.div)`
  position: absolute;
  cursor: pointer;
  pointer-events: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #ed6b90;
`
const RedAngle1Alt = styled(animated.div)`
  position: absolute;
  cursor: pointer;
  pointer-events: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #ed6b90;
  transition: opacity 0.2s;
`
const RedAngle2 = styled(animated.div)`
  position: absolute;
  cursor: pointer;
  pointer-events: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #ed6b90;
`
const RedAngle2Alt = styled(animated.div)`
  position: absolute;
  cursor: pointer;
  pointer-events: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #ed6b90;
  transition: opacity 0.2s;
`
const BlueAngle1 = styled(animated.div)<{ triangleLength: number }>`
  position: absolute;
  cursor: pointer;
  pointer-events: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  opacity: ${(props) => (props.triangleLength > 2.1 ? 1 : 0)};
  color: #6595de;
`
const BlueAngle1Alt = styled(animated.div)<{ triangleLength: number }>`
  position: absolute;
  cursor: pointer;
  pointer-events: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #6595de;
  opacity: ${(props) => (props.triangleLength < 2.1 ? 1 : 0)};
  transition: opacity 0.2s;
`
const BlueAngle2 = styled(animated.div)`
  position: absolute;
  cursor: pointer;
  pointer-events: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #6595de;
`
const BlueAngle2Alt = styled(animated.div)`
  position: absolute;
  cursor: pointer;
  pointer-events: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #6595de;
  transition: opacity 0.2s;
`
const LabelText = styled.label<{ color?: string; top: number; left: number; fade?: boolean }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  cursor: pointer;
  pointer-events: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.color};
  opacity: ${(props) => (props.fade ? 0 : 1)};
`
const LabelTextName = styled(animated.div)<{ color?: string; fade?: boolean }>`
  position: absolute;
  cursor: pointer;
  pointer-events: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.color};
  opacity: ${(props) => (props.fade ? 0 : 1)};
`

const OnboardingAnim = styled(OnboardingAnimation).attrs({ type: 'clickAndDrag' })`
  position: absolute;
  top: 360px;
  left: 100px;
  pointer-events: none;
  transform: rotate(-50deg);
  z-index: 3;
`

function locatePoint2d(pointName: string, ggbApi: GeogebraAppApi) {
  const pointX = ggbApi.getValue(`x(${pointName})`)
  const pointY = ggbApi.getValue(`y(${pointName})`)
  const cornor1X = ggbApi.getValue('x(Corner(1))')
  const cornor1Y = ggbApi.getValue('y(Corner(1))')
  const cornor2X = ggbApi.getValue('x(Corner(2))')
  const cornor4Y = ggbApi.getValue('y(Corner(4))')
  const heightInPixel = ggbApi.getValue('y(Corner(5))')
  const widthInPixel = ggbApi.getValue('x(Corner(5))')

  return {
    leftPixel: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
    topPixel: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
  }
}

export const AppletG08EEC08S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGbLoaded] = useState(false)
  const [pointerRed1, setPointerRed1] = useState({ leftPixel: 0, topPixel: 0 })
  const [pointerBlue1, setPointerBlue1] = useState({ leftPixel: 0, topPixel: 0 })
  const [pointerRed2, setPointerRed2] = useState({ leftPixel: 0, topPixel: 0 })
  const [pointerBlue2, setPointerBlue2] = useState({ leftPixel: 0, topPixel: 0 })
  const [triangle1Length, setTriangle1] = useState(2.7)
  const [triangle2Length, setTriangle2] = useState(5)
  const [red1Click, setRed1Click] = useState(false)
  const [red2Click, setRed2Click] = useState(false)
  const [blue1Click, setBlue1Click] = useState(false)
  const [blue2Click, setBlue2Click] = useState(false)
  const [pointClick, setPointClick] = useState(false)
  const [rightAng1Coord, setRight1Coord] = useState({ leftPixel: 0, topPixel: 0 })
  const [rightAng2Coord, setRight2Coord] = useState({ leftPixel: 0, topPixel: 0 })
  const onInteraction = useContext(AnalyticsContext)
  const hasCoordChanged = useHasChanged(pointClick)

  const redAngle1Pos = useSpring({
    left: pointerRed1.leftPixel + 62,
    top: pointerRed1.topPixel + 72,
    opacity: triangle1Length > 2.1 ? 1 : 0,
    immediate: true,
  })

  const redAngle1AltPos = useSpring({
    left: pointerRed1.leftPixel,
    top: pointerRed1.topPixel + 70,
    opacity: triangle1Length < 2.1 ? 1 : 0,
    immediate: true,
  })

  const redAngle2Pos = useSpring({
    left: pointerRed2.leftPixel,
    top: pointerRed2.topPixel + 70,
    opacity: triangle2Length < 2.22 ? 1 : 0,
    immediate: true,
  })

  const redAngle2AltPos = useSpring({
    left: pointerRed2.leftPixel + 62,
    top: pointerRed2.topPixel + 70,
    opacity: triangle2Length > 2.22 ? 1 : 0,
    immediate: true,
  })

  const blueAngle1Pos = useSpring({
    left: pointerBlue1.leftPixel + 2,
    top: pointerBlue1.topPixel + 128,
    immediate: true,
  })

  const blueAngle1AltPos = useSpring({
    left: pointerBlue1.leftPixel - 11,
    top: pointerBlue1.topPixel + 90,
    immediate: true,
  })

  const blueAngle2Pos = useSpring({
    left: pointerBlue2.leftPixel,
    top: pointerBlue2.topPixel + 70,
    opacity: triangle2Length < 2.22 ? 1 : 0,
    immediate: true,
  })

  const blueAngle2AltPos = useSpring({
    left: pointerBlue2.leftPixel + 5,
    top: pointerBlue2.topPixel + 127,
    opacity: triangle2Length > 2.22 ? 1 : 0,
    immediate: true,
  })

  const LabelAPos = useSpring({
    left: pointerRed1.leftPixel + 33,
    top: pointerRed1.topPixel + 101,
    immediate: true,
  })

  const LabelBPos = useSpring({
    left: rightAng1Coord.leftPixel + 33,
    top: rightAng1Coord.topPixel + 101,
    immediate: true,
  })

  const LabelCPos = useSpring({
    left: pointerBlue1.leftPixel + 38,
    top: pointerBlue1.topPixel + 99,
    immediate: true,
  })

  const LabelDPos = useSpring({
    left: pointerRed2.leftPixel + 40,
    top: pointerRed2.topPixel + 105,
    immediate: true,
  })

  const LabelEPos = useSpring({
    left: rightAng2Coord.leftPixel + 35,
    top: rightAng2Coord.topPixel + 105,
    immediate: true,
  })

  const LabelFPos = useSpring({
    left: pointerBlue2.leftPixel + 40,
    top: pointerBlue2.topPixel + 105,
    immediate: true,
  })

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGGbLoaded(api != null)
      if (api == null) return
      api.registerClientListener((e: any) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'D' || e.hits[0] === 'C' || e.hits[0] === 'F' || e.hits[0] === 'E')
        ) {
          onInteraction('move-point')
          setPointClick(true)
        }
      })
    },
    [onInteraction],
  )

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.registerObjectUpdateListener('e_1', () => {
        if (ggbApi.current) setTriangle1(ggbApi.current?.getValue('e_1'))
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('e_1')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.registerObjectUpdateListener('c_1', () => {
        if (ggbApi.current) setTriangle2(ggbApi.current?.getValue('c_1'))
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('c_1')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('F', () => {
        setPointerRed1(locatePoint2d('F', api))
        setRed1Click(true)
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('F')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('E', () => {
        setPointerBlue1(locatePoint2d('E', api))
        setBlue1Click(true)
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('E')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('D', () => {
        setPointerRed2(locatePoint2d('D', api))
        setRed2Click(true)
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('D')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('C', () => {
        setPointerBlue2(locatePoint2d('C', api))
        setBlue2Click(true)
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('C')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('S1', () => {
        setRight1Coord(locatePoint2d('S1', api))
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('S1')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('S2', () => {
        setRight2Coord(locatePoint2d('S2', api))
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('S2')
      }
    }
  }, [ggbLoaded])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec08-s1-gb03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore the corresponding angles of the triangles formed by the slope of the line."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <StyledGeogebra materialId={'h5yraupy'} width={700} height={500} onApiReady={onApiReady} />
      {ggbLoaded && (
        <>
          <BoxContainer>
            <BoxABC>
              <BoxText>
                Δ&nbsp;<span style={{ color: '#D97A1A' }}>ABC</span>
              </BoxText>
              <BoxText style={{ fontSize: '16px' }}>
                &nbsp;∠CAB =<span style={{ color: '#ED6B90' }}>&nbsp;50°</span>, ∠BCA =&nbsp;
                <span style={{ color: '#6595DE' }}>40°</span>, ∠ABC =&nbsp;
                <span style={{ color: '#428C94' }}>90°</span>
              </BoxText>
            </BoxABC>
            <BoxDEF>
              <BoxText>
                Δ &nbsp;<span style={{ color: '#C882FA' }}> DEF</span>
              </BoxText>
              <BoxText style={{ fontSize: '16px' }}>
                {' '}
                ∠FDE = <span style={{ color: '#ED6B90' }}>&nbsp;50°</span>, ∠EFD =&nbsp;
                <span style={{ color: '#6595DE' }}>40°</span>, ∠DEF =&nbsp;
                <span style={{ color: '#428C94' }}>90°</span>
              </BoxText>
            </BoxDEF>
          </BoxContainer>
          <PageText>
            Δ&nbsp;<span style={{ color: '#D97A1A' }}> ABC&nbsp;</span> is similar to Δ{' '}
            <span style={{ color: '#C882FA' }}>&nbsp;DEF</span>
          </PageText>
          {red1Click && (
            <>
              {' '}
              <RedAngle1 style={redAngle1Pos}>50°</RedAngle1>
              <RedAngle1Alt style={redAngle1AltPos}>50°</RedAngle1Alt>
            </>
          )}

          <LabelText top={520} left={220} color="#ED6B90" fade={red1Click}>
            50°
          </LabelText>

          {blue1Click && (
            <>
              <BlueAngle1 triangleLength={triangle1Length} style={blueAngle1Pos}>
                40°
              </BlueAngle1>
              <BlueAngle1Alt triangleLength={triangle1Length} style={blueAngle1AltPos}>
                40°
              </BlueAngle1Alt>
            </>
          )}
          <LabelText top={458} left={260} color="#6595DE" fade={blue1Click}>
            40°
          </LabelText>
          {red2Click && (
            <>
              <RedAngle2 style={redAngle2Pos}>50°</RedAngle2>
              <RedAngle2Alt style={redAngle2AltPos}>50°</RedAngle2Alt>
            </>
          )}
          <LabelText top={360} left={353} color="#ED6B90" fade={red2Click}>
            50°
          </LabelText>
          {blue2Click && (
            <>
              <BlueAngle2 style={blueAngle2Pos}>40°</BlueAngle2>
              <BlueAngle2Alt style={blueAngle2AltPos}>40°</BlueAngle2Alt>
            </>
          )}
          <LabelText top={177} left={498} color="#6595DE" fade={blue2Click}>
            40°
          </LabelText>
          {red1Click && <LabelTextName style={LabelAPos}>A</LabelTextName>}

          {(red1Click || blue1Click) && <LabelTextName style={LabelBPos}>B</LabelTextName>}
          {blue1Click && <LabelTextName style={LabelCPos}>C</LabelTextName>}

          {red2Click && <LabelTextName style={LabelDPos}>D</LabelTextName>}
          {(red2Click || blue2Click) && <LabelTextName style={LabelEPos}>E</LabelTextName>}
          {blue2Click && <LabelTextName style={LabelFPos}>F</LabelTextName>}

          <LabelText top={550} left={190} fade={red1Click}>
            A
          </LabelText>
          <LabelText top={550} left={290} fade={red1Click || blue1Click}>
            B
          </LabelText>
          <LabelText top={430} left={295} fade={blue1Click}>
            C
          </LabelText>
          <LabelText top={395} left={332} fade={red2Click}>
            D
          </LabelText>
          <LabelText top={395} left={527} fade={red2Click || blue2Click}>
            E
          </LabelText>
          <LabelText top={155} left={533} fade={blue2Click}>
            F
          </LabelText>
          <OnboardingController>
            <OnboardingStep index={0}>
              <OnboardingAnim complete={hasCoordChanged} />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}
