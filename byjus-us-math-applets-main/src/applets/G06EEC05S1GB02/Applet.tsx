import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import clickAni from '@/common/handAnimations/click.json'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const ButtonContainer = styled.div<{ top: number; left: number; color: string }>`
  position: absolute;
  width: 271px;
  height: 67px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  background: ${(props) => props.color ?? '#faf2ff'};
  border: 1px solid #1a1a1a;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 40px;
  text-align: center;
  color: #444444;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
  }
`
const TextContainer = styled.div`
  position: absolute;
  width: 174px;
  height: 28px;
  left: 274px;
  top: 200px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #000000;
`
const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`

const OnBoarding = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;

  pointer-events: none;
`
export const AppletG06EEC05S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [state, setState] = useState(0)
  const [ggb1state, setGgb1State] = useState(0)
  const [ggb2state, setGgb2State] = useState(0)
  const ggb1 = useRef<GeogebraAppApi | null>(null)
  const ggb2 = useRef<GeogebraAppApi | null>(null)
  const click = useSFX('mouseClick')
  const [ggb1Loaded, setGgb1Loaded] = useState(false)
  const [ggb2Loaded, setGgb2Loaded] = useState(false)
  const onInteraction = useContext(AnalyticsContext)

  const ggb1ready = useCallback((api: GeogebraAppApi | null) => {
    ggb1.current = api
    setGgb1Loaded(!!ggb1.current)
    if (!ggb1.current) return
    ggb1.current.registerClientListener((e: any) => {
      if (!e) return
      if (e[0] === 'mouseDown') {
        if (e['hits'][0] == 'pic8') {
          click()
          setGgb1State((v) => v + 1)
          onInteraction('tap')
        }
        if (e['hits'][0] == 'pic22') {
          click()
          setGgb1State((v) => v + 1)
          onInteraction('tap')
        }
        if (e['hits'][0] == 'pic3') {
          click()
          ggb1.current?.evalCommand('RunClickScript(pic3)')
          setState(0)
          onInteraction('tap')
        }
      }
    })
  }, [])
  const ggb2ready = useCallback((api: GeogebraAppApi | null) => {
    ggb2.current = api
    setGgb2Loaded(!!ggb2.current)
    if (!ggb2.current) return
    ggb2.current.registerClientListener((e: any) => {
      if (!e) return
      if (e[0] === 'mouseDown') {
        if (e['hits'][0] == 'pic13') {
          click()
          setGgb2State((v) => v + 1)
          setTimeout(() => {
            setGgb2State((v) => v + 1)
          }, 3000)
          onInteraction('tap')
        }

        if (e['hits'][0] == 'pic17') {
          click()
          setGgb2State((v) => v + 1)
          onInteraction('tap')
        }
        if (e['hits'][0] == 'pic4') {
          click()
          ggb2.current?.evalCommand('RunClickScript(pic4)')
          setState(0)
          onInteraction('tap')
        }
      }
    })
  }, [])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-eec05-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Let’s learn about Inverse Operations"
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      {state === 0 && (
        <>
          <TextContainer>Select an operation</TextContainer>
          <ButtonContainer
            left={225}
            top={292}
            color="#F6F6F6"
            onClick={() => {
              setState(1)
              click()
              onInteraction('tap')
            }}
          >
            Addition
          </ButtonContainer>
          <ButtonContainer
            left={225}
            top={402}
            color="#F6F6F6"
            onClick={() => {
              setState(2)
              click()
              onInteraction('tap')
            }}
          >
            Division
          </ButtonContainer>
          {state === 0 && ggb1state === 0 && (
            <OnBoarding top={270} left={280} src={clickAni} loop autoplay />
          )}
          {state === 0 && ggb1state !== 0 && ggb2state === 0 && (
            <OnBoarding top={370} left={280} src={clickAni} loop autoplay />
          )}
        </>
      )}
      <>
        <div style={{ visibility: state === 1 ? 'visible' : 'hidden' }}>
          <GeogebraContainer materialId="ne79awyw" top={100} left={40} onApiReady={ggb1ready} />
          {ggb1Loaded && (
            <>
              {ggb1state == 0 && <OnBoarding top={590} left={330} src={clickAni} loop autoplay />}
              {ggb1state == 2 && <OnBoarding top={590} left={240} src={clickAni} loop autoplay />}
            </>
          )}
        </div>
        <div style={{ visibility: state === 2 ? 'visible' : 'hidden' }}>
          <GeogebraContainer materialId="wtvuw7yf" top={100} left={20} onApiReady={ggb2ready} />
          {ggb2Loaded && (
            <>
              {ggb2state == 0 && <OnBoarding top={590} left={330} src={clickAni} loop autoplay />}
              {/* {ggb2state == 2 && <OnBoarding top={590} left={240} src={clickAni} loop autoplay />} */}
            </>
          )}
        </div>
      </>
    </AppletContainer>
  )
}
