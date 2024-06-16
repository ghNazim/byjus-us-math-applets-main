import React, { useCallback, useContext, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  top: 40px;
  left: 357px;
  width: 600px;
  height: 600px;
  translate: -50%;
`

const BottomSlider = styled(AnimatedInputSlider)`
  position: absolute;
  bottom: 85px;
  left: 150px;
`

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
  top: 520px;
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

export const Applet04507Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [done, setDone] = useState(false)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    setGgbLoaded(true)
    ggbApi.current = api
  }, [])

  const onSliderChange = useCallback((value: number) => {
    if (value === 100) {
      setDone(true)
    }

    if (ggbApi.current) {
      ggbApi.current.setValue('f', value / 100)
    }
  }, [])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '045_07_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Unfold the square pyramid to observe its net."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <StyledGeogebra materialId={'erv6hdm6'} width={750} height={750} onApiReady={onGGBLoaded} />
      {done ? (
        <PlacedText>
          <p style={{ fontSize: '24px' }}>
            The net of the
            <span style={{ color: '#ED6B90', fontWeight: '550' }}> square pyramid </span>
            has 4 triangular faces <br /> and 1 square face.
          </p>
        </PlacedText>
      ) : null}
      {ggbLoaded ? <BottomSlider onChangePercent={onSliderChange} /> : null}
    </AppletContainer>
  )
}
