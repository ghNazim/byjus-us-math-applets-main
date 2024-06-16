import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import check from './Assets/check.svg'
import compare from './Assets/compare.svg'
import next from './Assets/next.svg'
import reset from './Assets/reset.svg'
import retry from './Assets/retry.svg'
const GeogebraContainer = styled(Geogebra)`
  position: absolute;
  left: 50%;
  top: 150px;
  translate: -50%;
  scale: 1.1;
`
const ImageContainer = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  transition: all.3s;
  :hover {
    scale: 1.05;
    cursor: pointer;
  }
`
export const AppletG06NSC07S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [state, setState] = useState(-2)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onApiReadyHandle = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (!ggbApi.current) return
    setGgbLoaded(true)
    ggbApi.current.registerObjectUpdateListener('pic34', () => {
      const pic34 = ggbApi.current?.getVisible('pic34')
      if (pic34) setState(-1)
    })
    ggbApi.current.registerObjectUpdateListener('pic35', () => {
      const pic35 = ggbApi.current?.getVisible('pic35')
      if (pic35) setState(-1)
    })
    ggbApi.current.registerObjectUpdateListener('pic15', () => {
      const pic15 = ggbApi.current?.getVisible('pic15')
      if (pic15) setState(0)
    })
    ggbApi.current.registerObjectUpdateListener('pic33', () => {
      const pic33 = ggbApi.current?.getVisible('pic33')
      if (pic33) setState(0)
    })
    ggbApi.current.registerObjectUpdateListener('pic2', () => {
      const pic2 = ggbApi.current?.getVisible('pic2')
      if (pic2) setState(0)
    })
    ggbApi.current.registerObjectUpdateListener('NextQ1', () => {
      const NextQ1 = ggbApi.current?.getVisible('NextQ1')
      if (NextQ1) setState(1)
    })
    ggbApi.current.registerObjectUpdateListener('NextQ3', () => {
      const NextQ3 = ggbApi.current?.getVisible('NextQ3')
      if (NextQ3) setState(1)
    })
    ggbApi.current.registerObjectUpdateListener('pic14', () => {
      const pic14 = ggbApi.current?.getVisible('pic14')
      if (pic14) setState(2)
    })
    ggbApi.current.registerObjectUpdateListener('pic12', () => {
      const pic12 = ggbApi.current?.getVisible('pic12')
      if (pic12) setState(3)
    })
  }, [])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g06-nsc07-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore integers with sea level."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="ejyguw3u" onApiReady={onApiReadyHandle} />
      {ggbLoaded && state === 0 && (
        <ImageContainer
          src={check}
          onClick={() => {
            if (!ggbApi.current) return
            const pic15 = ggbApi.current.getVisible('pic15')
            const pic2 = ggbApi.current.getVisible('pic2')
            const pic33 = ggbApi.current.getVisible('pic33')
            if (pic15) ggbApi.current.evalCommand('RunClickScript(pic15)')
            if (pic2) ggbApi.current.evalCommand('RunClickScript(pic2)')
            if (pic33) ggbApi.current.evalCommand('RunClickScript(pic33)')
            // const pic34 = ggbApi.current.getVisible('pic34')
            // const NextQ1 = ggbApi.current.getVisible('NextQ1')
            // const NextQ3 = ggbApi.current.getVisible('NextQ3')
            // if (pic34) setState(-1)
            // if (NextQ1 || NextQ3) setState(1)
          }}
        />
      )}
      {ggbLoaded && state === -1 && (
        <ImageContainer
          src={retry}
          onClick={() => {
            const pic34 = ggbApi.current?.getVisible('pic34')
            const pic35 = ggbApi.current?.getVisible('pic35')
            if (pic34) ggbApi.current?.evalCommand('RunClickScript(pic34)')
            if (pic35) ggbApi.current?.evalCommand('RunClickScript(pic35)')
          }}
        />
      )}
      {ggbLoaded && state === 1 && (
        <ImageContainer
          src={next}
          onClick={() => {
            const NextQ1 = ggbApi.current?.getVisible('NextQ1')
            const NextQ3 = ggbApi.current?.getVisible('NextQ3')
            if (NextQ1) ggbApi.current?.evalCommand('RunClickScript(NextQ1)')
            if (NextQ3) ggbApi.current?.evalCommand('RunClickScript(NextQ3)')
          }}
        />
      )}
      {ggbLoaded && state === 2 && (
        <ImageContainer
          src={compare}
          onClick={() => {
            ggbApi.current?.evalCommand('RunClickScript(pic14)')
          }}
        />
      )}
      {ggbLoaded && state === 3 && (
        <ImageContainer
          src={reset}
          onClick={() => {
            ggbApi.current?.evalCommand('RunClickScript(pic12)')
          }}
        />
      )}
    </AppletContainer>
  )
}
