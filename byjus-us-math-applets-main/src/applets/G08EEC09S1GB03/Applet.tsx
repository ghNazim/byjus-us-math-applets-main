import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import Table from './component/Table'

const varButtonColor = '#1a1a1a'
const GeogebraContainer = styled(Geogebra)`
  width: 100%;
  height: 65%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: -10px;
  scale: 0.95;
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
  margin-top: 10px;
`

const BottomText = styled.div`
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
  /* position: absolute; */
`

const StylizedTable = styled(Table)`
  margin-top: 15px;
  margin-bottom: 0px;
`

const OnboardingAnim = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`

export const AppletG08EEC09S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const onOninteraction = useContext(AnalyticsContext)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [currentStage, setCurrentStage] = useState(0) //stage for different stages
  //of applet
  const [showInterceptBtn, setShowInterceptBtn] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [slope, setSlope] = useState(0)
  const [yIntercept, setYIntercept] = useState(3)

  //sound
  const playMouseClick = useSFX('mouseClick')
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')

  const onApiReady = useCallback(
    (api: any) => {
      ggbApi.current = api
      setGgbLoaded(true)
      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'dragpic') {
            playDragStart()
            setShowInterceptBtn(true)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'd_1') {
            playDragStart()
            setShowInterceptBtn(true)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'c_1') {
            playDragStart()
            setCurrentStage(5)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic5') {
            playDragStart()
            setCurrentStage(5)
          } else if (e.type === 'dragEnd' && e.target[0] === 'dragpic') {
            playDragEnd()
          } else if (e.type === 'dragEnd' && e.target[0] === 'd_1') {
            playDragEnd()
          } else if (e.type === 'dragEnd' && e.target[0] === 'c_1') {
            playDragEnd()
          } else if (e.type === 'dragEnd' && e.target[0] === 'pic5') {
            playDragEnd()
          }
          return () => {
            ggbApi.current?.unregisterClientListener(onGGBClient)
          }
        }
        api.registerClientListener(onGGBClient)
      }
    },
    [playDragEnd, playDragStart],
  )

  const handleReset = () => {
    if (ggbApi.current) {
      playMouseClick()
      onOninteraction('tap')
      setCurrentStage(0)
      setShowInterceptBtn(false)
      setShowTable(false)
      ggbApi.current.evalCommand('SetValue(o, 0)')
      ggbApi.current.evalCommand('SetValue(ig, 0)')
      ggbApi.current.evalCommand('SetValue(io, 0)')
      ggbApi.current.evalCommand('SetValue(B, (5, 5))')
      ggbApi.current.evalCommand('SetValue(A, (-3, -3))')
      ggbApi.current.evalCommand('SetValue(C, (0, 3))')
      ggbApi.current.evalCommand('SetValue(dt, 0)')
    }
  }

  const handleDrawParallelBtn = () => {
    if (ggbApi.current) {
      playMouseClick()
      ggbApi.current.evalCommand('SetValue(o,1)')
      setCurrentStage(1)
    }
  }

  const handleShowInterceptBtn = () => {
    onOninteraction('tap')
    playMouseClick()
    if (ggbApi.current !== null) {
      ggbApi.current.evalCommand('SetValue(o,v3)')
      ggbApi.current.evalCommand('SetValue(ig, 1)')
      ggbApi.current.evalCommand('SetValue(io, 1)')
      ggbApi.current.evalCommand('SetValue(dt,2)')
      setShowInterceptBtn(false)
      setShowTable(true)
      setCurrentStage(3)
    }
  }

  useEffect(() => {
    if (ggbLoaded && ggbApi.current) {
      ggbApi.current.registerObjectUpdateListener('SlopeL1', () => {
        if (ggbApi.current) {
          setSlope(Math.round(ggbApi.current.getValue('SlopeL1') * 10) / 10)
        }
      })
      ggbApi.current.registerObjectUpdateListener('intercept', () => {
        if (ggbApi.current) {
          setYIntercept(Math.round(ggbApi.current.getValue('intercept')))
        }
      })
    }

    return () => {
      ggbApi.current?.unregisterObjectUpdateListener('SlopeL1')
      ggbApi.current?.unregisterObjectUpdateListener('intercept')
    }
  }, [currentStage, ggbLoaded])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec09-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Move the lines and observe the change in values."
        backgroundColor="#F6F6F6"
        buttonColor="#888888"
      />
      <GeogebraContainer materialId="h3bsvcws" onApiReady={onApiReady} />
      {ggbLoaded && (
        <OnboardingController>
          {currentStage === 4 && (
            <BottomText>
              Note that the slope of the parallel lines remain equal even on rotating.
            </BottomText>
          )}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {currentStage === 0 && (
              <Btn bottom={50} onClick={handleDrawParallelBtn}>
                Draw a parallel line
              </Btn>
            )}
            {showInterceptBtn && currentStage <= 2 && (
              <Btn bottom={50} onClick={handleShowInterceptBtn}>
                Show intercepts
              </Btn>
            )}
          </div>{' '}
          {showTable && (
            <>
              {currentStage > 3 && (
                <BottomText>
                  When we move a line upwards or downwards by &apos;b&apos; units,
                  <br />
                  we adjust its equation by adding or subtracting &apos;b&apos; respectively.
                </BottomText>
              )}
              <StylizedTable slope={slope} yIntercept={yIntercept} />
            </>
          )}
          {currentStage === 5 && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {' '}
              <Btn bottom={20} onClick={handleReset}>
                Reset
              </Btn>
            </div>
          )}
          <OnboardingStep index={0}>
            <>
              <OnboardingAnim left={300} top={680} type="click" complete={currentStage > 0} />
              {(currentStage === 1 || currentStage === 2) && (
                <BottomText>
                  Note that the slope of the parallel lines remain equal even on rotating.
                </BottomText>
              )}
            </>
          </OnboardingStep>
          <OnboardingStep index={1}>
            <OnboardingAnim
              left={50}
              top={65}
              type="moveAllDirections"
              complete={showInterceptBtn}
            />
          </OnboardingStep>
          <OnboardingStep index={2}>
            <OnboardingAnim left={300} top={680} type="click" complete={showTable} />
          </OnboardingStep>
          <OnboardingStep index={3}>
            <OnboardingAnim left={160} top={85} type="moveVertically" complete={currentStage > 4} />
          </OnboardingStep>
        </OnboardingController>
      )}
    </AppletContainer>
  )
}
