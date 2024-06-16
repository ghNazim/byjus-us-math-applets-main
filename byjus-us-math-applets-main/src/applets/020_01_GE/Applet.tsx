import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'

const CALL_OUTS =
  'Create a right circular cone by rotating the right triangle about one of its perpendicular sides.'

const BottomSlider = styled(AnimatedInputSlider)`
  position: absolute;
  bottom: 85px;
  left: 150px;
`

const CenteredGGB = styled(Geogebra)`
  z-index: -1;
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export const Applet02001Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const onSliderChange = useCallback((value: number) => {
    if (ggbApi.current) {
      ggbApi.current.setValue('p', value / 100)
    }
  }, [])

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGgbLoaded(true)
  }, [])

  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#EACCFF',
        id: '020_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader backgroundColor={'#FAF2FF'} buttonColor={'#EACCFF'} text={CALL_OUTS} />
      <CenteredGGB materialId={'neynqufr'} onApiReady={onGGBLoaded} />
      {ggbLoaded && <BottomSlider onChangePercent={onSliderChange} />}
    </AppletContainer>
  )
}
