import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

const StyledGgb = styled(Geogebra)`
  width: 700px;
  overflow: hidden;
  position: absolute;
  left: 8.5px;
  top: 80px;
  z-index: -1;
`

export const AppletG07NSC02S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [layer, setLayer] = useState(0)
  const [currentState, setCurrentState] = useState(2)
  const [inputVal, setInputVal] = useState(NaN)

  const handleGGBready = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setGgbLoaded(true)

      ggbApi.current?.registerObjectUpdateListener('layer', () => {
        if (ggbApi.current) {
          const ans = ggbApi.current?.getValue('layer')
          setLayer(ans)
        }
      })
    },
    [ggbApi],
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(+event.target.value)
    ggbApi.current?.setValue('answer', +event.target.value)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-nsc02-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore integers with money."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <StyledGgb materialId="a8yudfwe" onApiReady={handleGGBready} />
    </AppletContainer>
  )
}
