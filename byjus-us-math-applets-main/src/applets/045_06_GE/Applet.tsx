import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

const PlacedText = styled.div`
  position: absolute;
  top: 480px;
  width: 720px;
  left: 50%;
  translate: -50%;
  color: #444444;
  font-family: 'Nunito', sans-serif !important;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;

  animation-duration: 500ms;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${fadeInRight};
`
const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  top: 0px;
  left: 360px;
  translate: -50%;
`

const BottomSlider = styled(AnimatedInputSlider)`
  position: absolute;
  bottom: 85px;
  left: 150px;
`

export const Applet04506Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [showtext, setShowText] = useState(false)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    setGgbLoaded(true)
    ggbApi.current = api
  }, [])

  const onSliderChange = useCallback((value: number) => {
    if (value === 100) {
      setShowText(true)
    }

    if (ggbApi.current) {
      ggbApi.current.setValue('d', value / 100)
    }
  }, [])
  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#FAF2FF',
        id: '045_06_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Unfold the triangular pyramid to observe its net."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <StyledGeogebra materialId={'cukeee96'} width={500} height={500} onApiReady={onGGBLoaded} />
      {showtext ? (
        <PlacedText>
          <p style={{ fontSize: '20px' }}>
            The net of the
            <span style={{ color: '#ED6B90', fontWeight: '550' }}> triangular pyramid </span>
            has 4 triangular faces.
          </p>
        </PlacedText>
      ) : null}
      {ggbLoaded ? <BottomSlider onChangePercent={onSliderChange} /> : null}
    </AppletContainer>
  )
}
