import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { TextCallout } from '../../common/Callout'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { AppletInteractionCallback } from '../../contexts/analytics'

const CALL_OUTS = [
  'Drag the slider or tap the play button to rotate the  triangle about one of its perpendicular sides.',
  'A right circular cone is formed by rotating a right triangle about one of its perpendicular sides.',
]

const BottomSlider = styled(AnimatedInputSlider)`
  position: absolute;
  bottom: 85px;
  left: 150px;
`

const CenteredGGB = styled(Geogebra)`
  position: absolute;
  left: 85px;
  top: 100px;
  width: 550px;
  height: 400px;
`

export const Applet02802Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [calloutIndex, setCalloutIndex] = useState(0)
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const onSliderChange = useCallback((value: number) => {
    if (value === 100) {
      setCalloutIndex(1)
    } else {
      setCalloutIndex(0)
    }

    if (ggbApi.current) {
      ggbApi.current.setValue('p', value / 100)
    }
  }, [])

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
  }, [])

  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#444',
        id: '028_02_GE',
        onEvent,
        className,
      }}
    >
      <TextCallout backgroundColor={'#E7FBFF'} activeIndex={calloutIndex} text={CALL_OUTS} />
      <CenteredGGB materialId={'jusnnrwa'} onApiReady={onGGBLoaded} />
      <BottomSlider onChangePercent={onSliderChange} />
    </AppletContainer>
  )
}
