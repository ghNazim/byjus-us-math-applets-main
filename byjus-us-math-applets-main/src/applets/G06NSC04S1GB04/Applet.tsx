import { FC, useRef } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const GgbContainer = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 40px;
  scale: 0.85;
`

export const AppletG06NSC04S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const click = useSFX('mouseClick')

  const onApiReadyHandle = (api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (!ggbApi.current) return
    ggbApi.current.registerClientListener((e: any) => {
      if (e[0] == 'select')
        if (
          e[1] == 'pic6' ||
          e[1] == 'pic7' ||
          e[1] == 'Submit_full' ||
          e[1] == 'Retry' ||
          e[1] == 'Verify' ||
          e[1] == 'columns' ||
          e[1] == 'pic1' ||
          e[1] == 'pic9'
        ) {
          click()
        }
    })
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc04-s1-gb04',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Is the given number prime or composite?"
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GgbContainer materialId="du5xec44" onApiReady={onApiReadyHandle} />
    </AppletContainer>
  )
}
