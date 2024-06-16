import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useTimeout } from '@/hooks/useTimeout'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import clickGesture from '../../common/handAnimations/clickGesture.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import page2 from './Images/page2.svg'
import page3p1 from './Images/page3p1.svg'
import page3p2 from './Images/page3p2.svg'
import page4p2 from './Images/page4p2.svg'
import page4p3 from './Images/page4p3.svg'
import patch from './Images/patch.svg'

const PatchContainer = styled.img`
  position: absolute;
  width: 20px;
  height: 20px;
  left: 107px;
  top: 512px;
`

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  top: 40px;
  left: 357px;
  width: 500px;
  height: 500px;
  translate: -50%;
`
const TextImage = styled.img<{ index: number; page: number; pos: number; top: number }>`
  position: absolute;
  transition: top 500ms;
  top: ${(props) =>
    props.index == props.page ? (props.pos == 0 ? 475 : props.pos == 2 ? 555 : 515) : props.top}px;
  opacity: ${(props) => (props.index == props.page ? 1 : 0)};
  pointer-events: none;
`
const TextContainer = styled.div<{ page: number }>`
  position: absolute;
  left: 360px;
  top: ${(props) => (props.page === 3 ? -60 : 0)}px;
`

const PlacedTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  transition: 0.3s;
`
const AnimOnBoarding = styled(Player)`
  position: absolute;
  top: 620px;
  left: 320px;
  pointer-events: none;
`

export const Applet3901Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGbLoaded] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [triggerProgress, setTriggerProgress] = useState(false)
  const [nextDisable, setNextDisable] = useState(false)
  const [nextButtonDisable, setNextButtonDisable] = useState(false)
  const [pageNum, setPageNum] = useState(0)
  const textTrigger = ggbApi.current?.getValue('p')
  const textTrigger2 = ggbApi.current?.getValue("p'")
  const onPageChange = useCallback((current: number) => setPageIndex(current), [])
  const [showPageControl, setShowPageControl] = useState(false)
  const [showClickOnboarding, setShowClickOnboarding] = useState(true)

  useTimeout(
    () => {
      setPageNum((n) => n + 1)
    },
    triggerProgress ? 600 : null,
  )
  useEffect(() => {
    if (pageIndex > 0) setShowClickOnboarding(false)
  }, [pageIndex])

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current?.setValue('Next', pageNum)
    }
  }, [pageNum])

  const onAnimUpdateOf = (pointName: string, progressName: string) => {
    const checkShrink = () => {
      const api = ggbApi.current
      if (api == null) return
      const x = api.getXcoord(pointName)
      const y = api.getYcoord(pointName)
      const check = x === 1 && y === 1
      setTriggerProgress(check)
    }

    const checkProgress = () => {
      const api = ggbApi.current
      if (api == null) return
      const p = api.getValue(progressName)
      setNextButtonDisable(p !== 100)
    }
    setNextDisable(false)

    ggbApi.current?.registerObjectUpdateListener(pointName, checkShrink)
    ggbApi.current?.registerObjectUpdateListener(progressName, checkProgress)

    return () => {
      ggbApi.current?.unregisterObjectUpdateListener(pointName)
      ggbApi.current?.unregisterObjectUpdateListener(progressName)
    }
  }

  useEffect(() => {
    if (pageIndex == 0) {
      setNextDisable(false)
    } else if (pageIndex == 3) {
      ggbApi.current?.setValue('Next', 5)
    }
  }, [pageIndex])

  const OnBackClick = () => {
    switch (pageIndex) {
      case 1:
        setNextDisable(false)
        break
      case 2:
        setNextDisable(false)
        ggbApi.current?.setValue('Next', 2)
        ggbApi.current?.setValue('p', 100)
        ggbApi.current?.setValue('k', 10)
        ggbApi.current?.setValue('l', 10)
        break
      case 3:
        setNextDisable(false)
        ggbApi.current?.setValue('Next', 4)
        ggbApi.current?.setValue("p'", 100)
        ggbApi.current?.setValue('d', 100)
        ggbApi.current?.setValue('r', 100)
        break
      case 4:
        setNextDisable(false)
        setPageNum(5)
        break
    }
  }

  const OnNextClick = () => {
    switch (pageIndex) {
      case 0:
        setNextDisable(true)
        setNextButtonDisable(true)
        setPageNum(1)
        return onAnimUpdateOf("C'", 'p')

      case 1:
        setNextDisable(true)
        setNextButtonDisable(true)
        setPageNum(3)
        return onAnimUpdateOf("T'", "p'")

      case 2:
        setNextDisable(false)
        setPageNum(5)
        break
    }
  }

  useEffect(() => {
    const api = ggbApi.current
    if (api == null) return
    switch (pageIndex) {
      case 0:
        setNextDisable(false)
        setPageNum(0)
        break
      case 3:
        setNextDisable(false)
        setPageNum(5)
        break
    }
  }, [pageIndex])

  const onApiReady = useCallback(
    (api: any) => {
      ggbApi.current = api
      ggbApi.current?.setValue('Drag', 0)
      setGGbLoaded(true)

      ggbApi.current?.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'pic1') {
          onInteraction('drag')
        } else if (e.type === 'dragEnd' && e.target === 'pic1') {
          onInteraction('drop')
        }
      })
    },
    [onInteraction],
  )

  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#FFF6DB',
        id: '39_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Form square plots of different dimensions to find the relation between square meter, are, and hectare."
        backgroundColor="#FFF6DB"
        buttonColor="#FFDC73"
      />
      <StyledGeogebra materialId={'b7qe6yxb'} width={750} height={750} onApiReady={onApiReady} />
      <TextContainer page={pageIndex}>
        <PlacedTextContainer>
          <TextImage
            src={page2}
            index={textTrigger == 100 && pageIndex == 1 ? 1 : -1}
            page={1}
            pos={pageIndex == 1 ? 1 : 0}
            top={645}
          />
          <TextImage
            src={page3p1}
            index={pageIndex == 2 || pageIndex == 3 ? pageIndex : -1}
            page={pageIndex}
            pos={pageIndex == 2 || pageIndex == 3 ? 0 : -1}
            top={645}
          />
          <TextImage
            src={page3p2}
            index={textTrigger2 === 100 && pageIndex == 2 ? 2 : -1}
            page={2}
            pos={pageIndex == 2 ? 1 : 0}
            top={645}
          />
          <TextImage
            src={page4p2}
            index={pageIndex == 3 ? 3 : -1}
            page={3}
            pos={pageIndex == 3 ? 1 : 0}
            top={645}
          />
          <TextImage
            src={page4p3}
            index={pageIndex == 3 ? 3 : -1}
            page={3}
            pos={pageIndex == 3 ? 2 : 0}
            top={645}
          />
        </PlacedTextContainer>
      </TextContainer>
      {ggbLoaded && (
        <PageControl
          total={4}
          onChange={onPageChange}
          nextDisabled={!ggbLoaded || nextDisable || pageIndex !== 0 ? nextButtonDisable : false}
          backDisabled={!ggbLoaded || nextDisable}
          onBack={OnBackClick}
          onNext={OnNextClick}
        />
      )}
      {ggbLoaded && showClickOnboarding && <AnimOnBoarding src={clickGesture} loop autoplay />}
      <PatchContainer src={patch}></PatchContainer>
    </AppletContainer>
  )
}
