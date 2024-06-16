import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import reset from './assets/reset.svg'
const GGBcontainer = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 53px;
  scale: 0.93;
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
export const AppletG08GMC05S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const [pageNum, setPageNum] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGGBLoaded(api !== null)
      api.registerObjectUpdateListener('next1b', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getValue('next1b') == 1) {
          setNextDisabled(false)
        }
      })
      api.registerObjectUpdateListener('ResetButton', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getVisible('ResetButton')) {
          setNextDisabled(false)
        }
      })
    },
    [ggbLoaded],
  )
  const onNextHandle = () => {
    switch (pageNum) {
      case 0:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(Start)')
        setNextDisabled(true)
        setPageNum(1)
        break
      case 1:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(Next1)')
        setNextDisabled(true)
        setPageNum(2)
        break
      case 2:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(ResetButton)')
        setPageNum(0)
        break
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g08-gmc05-s1-gb05',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Angle-angle similarity of triangles."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="jdjrgry9" onApiReady={onGGBLoaded} width={753} height={665} />
      <ButtonElement
        disabled={nextDisabled}
        onClick={onNextHandle}
        colorTheme={pageNum == 2 ? 'white' : 'black'}
      >
        {pageNum == 0 && 'Start'}
        {pageNum == 1 && 'Next'}
        {pageNum == 2 && <img src={reset} />}
      </ButtonElement>
    </AppletContainer>
  )
}
