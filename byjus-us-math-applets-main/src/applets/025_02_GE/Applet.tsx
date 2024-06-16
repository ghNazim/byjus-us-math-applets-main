import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import clickGesture from '../../common/handAnimations/clickGesture.json'
import { TextHeader } from '../../common/Header'
import { Math } from '../../common/Math'
import { PageControl } from '../../common/PageControl'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'

const GGB = styled(Geogebra)<{ moveUp: boolean }>`
  position: absolute;
  top: ${(props) => (props.moveUp ? 60 : 100)}px;
  left: 50%;
  translate: -50%;
  transition: 0.5s;
`
const AnimOnBoarding = styled(Player)`
  position: absolute;
  top: 690px;
  left: 320px;
  pointer-events: none;
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
const PlaceText = styled.div<{ delay: number; topValue: number }>`
  position: absolute;
  top: ${(props) => props.topValue}px;
  left: 50%;
  translate: -50%;
  width: 500px;
  color: #646464;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  animation-duration: ${(props) => props.delay * 500}ms;
  animation-timing-function: ease;
  animation-delay: ${(props) => props.delay * 0.5}s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${fadeInRight};
`
const Texts = [
  '',
  '',
  'Lateral surface area = Sum of area of four triangular faces',
  <Math key={3} displayMode>
    {String.raw`
\begin{align*}
\text{Lateral surface area} &= {4} \times{\text{(Area of a triangular face)}} \\
&= {4} \times \textbf{( } \frac{1}{2} \times \text{a} \times \text{l} \textbf{ )} \\
&=  {2}\text{al}
\end{align*}
`}
  </Math>,
  'Lateral surface area = 2al',
]

export const Applet02502Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [showPageControl, setShowPageControl] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [nextDisable, setNextDisable] = useState(false)
  const [showClickOnboarding, setShowClickOnboarding] = useState(true)
  const [transition2d, setTransition2d] = useState(0)
  const transitionTarget = pageIndex === 0 || pageIndex === 4 ? 0 : 1
  const onPageChange = useCallback((current: number) => {
    setPageIndex(current)
  }, [])
  const onHandleGGB = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (ggbApi.current == null) return
    setShowPageControl(true)
  }, [])

  useInterval(
    () => {
      if (
        (pageIndex === 1 || pageIndex === 2 || pageIndex === 3) &&
        transition2d < transitionTarget
      )
        setTransition2d((v) => v + 0.1)
      else if ((pageIndex === 0 || pageIndex === 4) && transition2d > transitionTarget)
        setTransition2d((v) => v - 0.1)
    },
    transition2d != transitionTarget ? 100 : null,
  )
  useInterval(
    () => {
      if (pageIndex === 1 && ggbApi.current?.getValue('SVD') == 1) setNextDisable(false)
      if (pageIndex === 2 || pageIndex === 3) setNextDisable(false)
    },
    nextDisable ? (pageIndex == 1 ? 2500 : 1000) : null,
  )
  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.setValue('a', transition2d)
      if (pageIndex == 1 && ggbApi.current.getValue('a') == 1) ggbApi.current.setValue('SVD', 1)
      if (pageIndex == 0 && ggbApi.current.getValue('a') == 0) setNextDisable(false)
      if (pageIndex == 4 && ggbApi.current.getValue('a') == 0) ggbApi.current.setValue('o_3', 1)
      if (pageIndex == 3 && ggbApi.current.getValue('a') == 1) ggbApi.current.setValue('o_3', 1)
    }
  }, [pageIndex, transition2d])

  useEffect(() => {
    if (pageIndex > 0) setShowClickOnboarding(false)
  }, [pageIndex])

  useEffect(() => {
    const api = ggbApi.current
    if (api == null) return
    switch (pageIndex) {
      case 0:
        if (api.getValue('a') > 0) setNextDisable(true)
        api.setValue('SVD', 0)
        api.setValue('o_3', 0)
        api.setValue('ColorChange', 0)
        break
      case 1:
        if (api.getValue('a') < 1) setNextDisable(true)
        api.setValue('ColorChange', 0)
        break
      case 2:
        setNextDisable(true)
        api.setValue('o_3', 0)
        api.setValue('ColorChange', 1)
        break
      case 3:
        setNextDisable(true)
        api.setValue('SVD', 1)
        if (api.getValue('a') < 1) api.setValue('o_3', 0)
        else api.setValue('o_3', 1)
        break
      case 4:
        api.setValue('SVD', 0)
        api.setValue('o_3', 0)
        break
    }
  }, [pageIndex])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E7FBFF',
        id: '025_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Open the net of the square pyramid and derive the lateral surface area formula of pyramid."
        backgroundColor="#E7FBFF"
        buttonColor="#A6F0FF"
      />
      <GGB
        width={650}
        height={450}
        materialId="mtyjnurn"
        onApiReady={onHandleGGB}
        isApplet2D={true}
        moveUp={pageIndex === 4 || pageIndex === 0}
      />
      <PlaceText
        delay={pageIndex > 1 ? 0.8 : 0}
        key={pageIndex}
        topValue={pageIndex == 4 ? 580 : 550}
      >
        {Texts[pageIndex]}
      </PlaceText>
      {showPageControl && (
        <PageControl total={5} onChange={onPageChange} nextDisabled={nextDisable} />
      )}
      {showPageControl && showClickOnboarding && (
        <AnimOnBoarding src={clickGesture} loop autoplay />
      )}
    </AppletContainer>
  )
}
