import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { moveHorizontally } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import reset from './assets/resetBtn.svg'
const GGB = styled(Geogebra)`
  width: 592px;
  height: 470px;
  position: absolute;
  top: 140px;
  left: 50%;
  translate: -50%;
  scale: 1.18;
`
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
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  cursor: pointer;
  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
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
  height: 80px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  background-color: #fff;
`
const Text = styled.div`
  width: 570px;
`
const ColoredSpan = styled.span`
  color: #2d6066;
  background-color: #dff1f1;
  padding: 0 5px;
  margin: 0 5px;
  border-radius: 3px;
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 300px;
  pointer-events: none;
`
export const AppletG08FNC01S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [screen, setScreen] = useState(1)
  const [choice, setChoice] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(true)
  const [showPointer, setShowPointer] = useState(false)
  const playClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onHandleGGB = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.registerObjectUpdateListener('screen', () => {
        setScreen(api.getValue('screen'))
        if (api.getValue('screen') == 3) {
          setShowPointer(true)
          setNextDisabled(true)
        } else if (api.getValue('screen') == 2) {
          setNextDisabled(false)
        } else if (api.getValue('screen') == 1) {
          setNextDisabled(true)
        }
      })
      api.registerObjectUpdateListener('choice', () => {
        setChoice(api.getValue('choice'))
        if (api.getValue('choice') != 0 && api.getValue('screen') < 3) {
          playClick()
          onInteraction('tap')
        }
      })
      api.registerObjectUpdateListener('slider', () => {
        if (api.getValue('screen') == 3 && api.getValue('slider') > 2) {
          setNextDisabled(false)
        } else if (api.getValue('screen') == 3 && api.getValue('slider') == 1) {
          setNextDisabled(true)
        }
      })
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'pic20') {
          onInteraction('drag')
          playMouseIn()
          setShowPointer(false)
        } else if (e.type === 'dragEnd' && e.target === 'pic20') {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [ggbApi],
  )
  const onNextHandle = () => {
    playClick()
    if (screen == 2) {
      if (!ggbApi.current) return
      ggbApi.current.evalCommand('RunClickScript(pic19)')
      onInteraction('next')
    } else if (screen == 3) {
      if (!ggbApi.current) return
      ggbApi.current.evalCommand('RunClickScript(pic24)')
      onInteraction('reset')
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-fnc01-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Use vertical line test to find if a graph represents a function."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGB materialId="zggxqseu" onApiReady={onHandleGGB} />
      {showPointer && <HandPlayer src={moveHorizontally} autoplay loop />}
      <HelperText top={screen == 3 ? 600 : 625}>
        {screen < 3 ? (
          'Select a plot and proceed.'
        ) : nextDisabled ? (
          'Move the vertical line.'
        ) : choice == 1 || choice == 6 ? (
          <Text>
            {
              'This graph doesn’t represent a function because the vertical line intersects it at more than one point.'
            }
          </Text>
        ) : (
          <Text>
            {'This graph represents a '}
            <ColoredSpan>function</ColoredSpan>
            {' because the vertical line intersects it at just one point.'}
          </Text>
        )}
      </HelperText>
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {screen < 3 ? 'Next' : <img src={reset} />}
      </ButtonElement>
    </AppletContainer>
  )
}
