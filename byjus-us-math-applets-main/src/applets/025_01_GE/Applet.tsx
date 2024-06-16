import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useListTransition, useSwitchTransition } from 'transition-hook'

import { useSFX } from '@/hooks/useSFX'
import { useTimeout } from '@/hooks/useTimeout'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import clickGesture from '../../common/handAnimations/clickGesture.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import page2 from './images/page2.svg'
import page3 from './images/page3.svg'
import page4p1 from './images/page4p1.svg'
import page4p2 from './images/page4p2.svg'
import page4p3 from './images/page4p3.svg'
import page5 from './images/page5.svg'

const TextImage = styled.img<{ bottom: number; stage: 'from' | 'enter' | 'leave' }>`
  position: absolute;
  left: -133px;
  bottom: ${(props) => (props.stage === 'enter' ? props.bottom : 0)}px;
  transition: 1s;
  opacity: ${(props) => (props.stage === 'enter' ? 1 : 0)};
`

const StyledGeogebra = styled(Geogebra)<{ moveUp: boolean }>`
  position: absolute;
  top: ${(props) => (props.moveUp ? 0 : 40)}px;
  left: 357px;
  translate: -50%;
  transition: 0.5s;
`
const PlacedText = styled.div<{ stage: 'from' | 'enter' | 'leave' }>`
  position: absolute;
  top: 600px;
  width: 620px;
  left: 50%;
  opacity: ${(props) => (props.stage === 'enter' ? 1 : 0)};
  transition: 200ms;
`
const AnimOnBoarding = styled(Player)`
  position: absolute;
  top: 690px;
  left: 320px;
  pointer-events: none;
`

const Page3Text: React.FC = () => {
  const [textList, setTextList] = useState<string[]>([])
  const transition = useListTransition(textList, 600)

  useTimeout(
    () => {
      setTextList([page4p2, page4p3])
    },
    textList.length === 1 ? 600 : null,
  )

  useEffect(() => {
    setTextList([page4p2])

    return () => setTextList([])
  }, [])

  return (
    <p>
      <img
        style={{ position: 'absolute', right: '738px', bottom: '96px', translate: '0%' }}
        src={page4p1}
      />
      {transition((item, stage) => (
        <TextImage
          src={item}
          stage={stage}
          bottom={item === page4p2 ? 78 : item === page4p3 ? -14 : 0}
        />
      ))}
    </p>
  )
}

const pageTexts = [
  undefined,
  <p key={2}>
    <img
      style={{ position: 'absolute', left: '0px', bottom: '55px', translate: '-50%' }}
      src={page2}
    />
  </p>,
  <p key={3}>
    <img
      style={{ position: 'absolute', right: '190px', bottom: '0px', translate: '0%' }}
      src={page3}
    />
  </p>,
  <Page3Text key={4} />,
  <p key={5}>
    <img
      style={{ position: 'absolute', left: '0px', bottom: '0px', translate: '-50%' }}
      src={page5}
    />
  </p>,
]

const Texts: React.FC<{ pageIndex: number }> = ({ pageIndex }) => {
  const transition = useSwitchTransition(pageIndex, 200, 'out-in')

  return (
    <>
      {transition((index, stage) => (
        <PlacedText stage={stage}>{pageTexts[index]}</PlacedText>
      ))}
    </>
  )
}

export const Applet02501Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playClick = useSFX('mouseClick')
  const [showClickOnboarding, setShowClickOnboarding] = useState(true)
  const [showPageControl, setShowPageControl] = useState(false)
  const [ggbLoaded, setGGbLoaded] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [transition2d, setTransition2d] = useState(0)
  const [nextDisable, setNextDisable] = useState(false)
  const transitionTarget = pageIndex === 0 || pageIndex === 4 ? 0 : 1
  const onPageChange = useCallback((current: number) => setPageIndex(current), [])

  useInterval(
    () => {
      if (
        (pageIndex === 1 || pageIndex === 2 || pageIndex === 3) &&
        transition2d < transitionTarget
      )
        setTransition2d((v) => Math.min(v + 0.1, 1))
      else if ((pageIndex === 0 || pageIndex === 4) && transition2d > transitionTarget)
        setTransition2d((v) => Math.max(v - 0.1, 0))
    },
    transition2d != transitionTarget ? 50 : null,
  )

  useEffect(() => {
    const api = ggbApi.current
    if (api == null) return
    api.setValue('a', transition2d)

    if (pageIndex == 1 && api.getValue('a') == 1) api.setValue('SVD', 1)

    if (pageIndex == 1 && api.getValue('a') == 1) {
      setNextDisable(false)
    }
    if (pageIndex == 0 && api.getValue('a') == 0) setNextDisable(false)
  }, [pageIndex, transition2d])

  useEffect(() => {
    const api = ggbApi.current
    if (api == null) return
    switch (pageIndex) {
      case 0:
        if (api.getValue('a') > 0) setNextDisable(true)
        api.setValue('SVD', 0)
        api.setValue('o_3', 0)
        break
      case 1:
        if (api.getValue('a') < 1) setNextDisable(true)
        api.setValue('o_3', 0)
        break
      case 2:
        api.setValue('SVD', 1)
        api.setValue('o_3', 1)
        break
      case 3:
        api.setValue('SVD', 1)
        api.setValue('o_3', 1)
        break
      case 4:
        api.setValue('SVD', 0)
        api.setValue('o_3', 1)

        break
    }
  }, [pageIndex])

  useEffect(() => {
    if (pageIndex > 0) setShowClickOnboarding(false)
  }, [pageIndex])

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.setValue('Drag', 0)
      setShowPageControl(true)
      setGGbLoaded(true)

      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'pic1') {
          onInteraction('drag')
          playClick()
        } else if (e.type === 'dragEnd' && e.target === 'pic1') {
          onInteraction('drop')
          playClick()
        }
      })
    },
    [onInteraction, playClick],
  )

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E7FBFF',
        id: '025_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Open the net of the square pyramid and derive the total surface area formula of the pyramid. "
        backgroundColor="#E7FBFF"
        buttonColor="#A6F0FF"
      />
      <StyledGeogebra
        materialId={'pebkddk8'}
        width={500}
        height={500}
        onApiReady={onApiReady}
        moveUp={pageIndex === 4}
      />
      {showPageControl && (
        <PageControl total={5} onChange={onPageChange} nextDisabled={!ggbLoaded || nextDisable} />
      )}
      {showPageControl && showClickOnboarding && (
        <AnimOnBoarding src={clickGesture} loop autoplay />
      )}
      <Texts
        pageIndex={pageIndex === 3 ? (transition2d === transitionTarget ? 3 : -1) : pageIndex}
      />
    </AppletContainer>
  )
}
