import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import retry from './assets/retry.svg'
import tryAgain from './assets/tryAgain.svg'
import ToggleGroup from './ToggleGroup/ToggleGroup'
const GGB = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 85px;
  width: 648px;
  height: 486px;
`
const HelperText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 590px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const Text = styled.div`
  margin-left: 10px;
  max-width: 570px;
`

const ButtonElement = styled.button<{ colorTheme: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  height: 60px;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  background: ${(p) => (p.colorTheme == 'white' ? '#fff' : '#1a1a1a')};
  border: 2px solid #1a1a1a;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
  :disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: 135px;
  bottom: 35px;
  pointer-events: none;
`
export const AppletG08GMC01S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [toggle, setToggle] = useState(-1)
  const [nextDisabled, setNextDisabled] = useState(true)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const playClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && (e.hits[0] === 'J' || e.hits[0] === 'K')) {
          onInteraction('drag')
          playMouseIn()
        } else if (e.type === 'dragEnd' && (e.target === 'J' || e.target === 'K')) {
          onInteraction('drop')
          playMouseOut()
        } else if (e.type === 'mouseDown' && (e.hits[0] === 'HB' || e.hits[0] === 'VB')) {
          onInteraction('tap')
          playClick()
        }
      })
      api.registerObjectUpdateListener('fp', () => {
        if (api.getValue('fp') == 1 && api.getValue('rot') == 1 && api.getValue('sl') == 1)
          setNextDisabled(false)
      })
      api.registerObjectUpdateListener('rot', () => {
        if (api.getValue('fp') == 1 && api.getValue('rot') == 1 && api.getValue('sl') == 1)
          setNextDisabled(false)
      })
      api.registerObjectUpdateListener('sl', () => {
        if (api.getValue('fp') == 1 && api.getValue('rot') == 1 && api.getValue('sl') == 1)
          setNextDisabled(false)
      })
      api.registerObjectUpdateListener('grA', () => {
        if (api.getVisible('grA')) setPageNum(2)
      })
      api.registerObjectUpdateListener('redbg1', () => {
        if (api.getVisible('redbg1')) setPageNum(1)
      })
    },
    [ggbApi],
  )
  const onNextHandle = () => {
    playClick()
    if (!ggbApi.current) return
    if (pageNum == 0) {
      ggbApi.current.evalCommand('RunClickScript(check)')
      onInteraction('next')
      ggbApi.current.setFixed('J', false, false)
      ggbApi.current.setFixed('K', false, false)
      ggbApi.current.setFixed('L', false, false)
    } else {
      ggbApi.current.evalCommand('RunClickScript(button1)')
      setNextDisabled(true)
      setPageNum(0)
      onInteraction('reset')
      setShowHandPointer(true)
      ggbApi.current.setFixed('J', false, true)
      ggbApi.current.setFixed('K', false, true)
      ggbApi.current.setFixed('L', false, true)
    }
  }
  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId < 0) return
    setToggle(activeId)
    setShowHandPointer(false)
  }, [])
  useEffect(() => {
    if (!ggbApi.current) return
    switch (toggle) {
      case 0:
        ggbApi.current.evalCommand('RunClickScript(slide)')
        break
      case 1:
        ggbApi.current.evalCommand('RunClickScript(flip)')
        break
      case 2:
        ggbApi.current.evalCommand('RunClickScript(rotate)')
        break
    }
  }, [toggle])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g08-gmc01-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Verify if the triangles measure the same."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GGB materialId="zzvfvjap" onApiReady={onGGBHandle} />
      <HelperText>
        <Text>
          {pageNum == 0 && 'Choose an action to align the triangles.'}
          {pageNum == 1 &&
            'The triangles need to be aligned to confirm if they have the same measurements.'}
          {pageNum == 2 && "Perfect! You've just verified that both triangles are the same."}
        </Text>
      </HelperText>
      {pageNum == 0 && <ToggleGroup noOfChildren={3} onChange={handleToggleChange} />}
      <ButtonElement onClick={onNextHandle} disabled={nextDisabled} colorTheme={'black'}>
        {pageNum == 0 && 'Check'}
        {pageNum == 1 && <img src={retry} />}
        {pageNum == 2 && <img src={tryAgain} />}
      </ButtonElement>
      {showHandPointer && <HandPlayer src={click} autoplay loop />}{' '}
    </AppletContainer>
  )
}
