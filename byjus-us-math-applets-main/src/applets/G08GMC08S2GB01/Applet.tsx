import { Player } from '@lottiefiles/react-lottie-player'
import { number } from 'mathjs'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import direction from '../../common/handAnimations/moveAllDirections.json'
import ResetImg from './assets/ResetBut.svg'
import text0 from './assets/text0.svg'
import text1 from './assets/text1.svg'
import text2 from './assets/text2.svg'
const CenteredGGBLeft = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 700px;
  height: 650px;
  left: 10px;
  top: 10px;
  z-index: 0;
  margin-right: -1px;
  border: none;
  scale: 0.7;
  z-index: 0;
`
const SubmitBtn = styled.button<{ submitDisabled: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  width: 102px;
  height: 60px;
  background: ${({ submitDisabled: submitDisabled }) => (submitDisabled ? '#D1D1D1' : '#1a1a1a')};
  border: none;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
  :hover {
    scale: 1.05;
    cursor: pointer;
  }
`
const PageText2 = styled.img`
  position: absolute;
  left: 80px;
  bottom: 180px;
  z-index: 1;
`
const PageTexts = styled.img<{ page: number }>`
  position: absolute;
  left: ${(props) => {
    switch (props.page) {
      case 0:
        return '120px'
      case 1:
        return '100px'
      default:
        return '200px'
    }
  }};
  bottom: ${(props) => {
    switch (props.page) {
      case 0:
        return '180px'
      case 1:
        return '180px'

      default:
        return '180px'
    }
  }};
  z-index: 1;
`

const SliderContainer = styled(AnimatedInputSlider)`
  position: absolute;
  top: 645px;
  left: 140px;
  width: 450px;
`
const ResetButton = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 10px;
  transition: all.3s;
  :hover {
    scale: 1.05;
    cursor: pointer;
  }
  z-index: 2;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 1;
`

export const AppletG08GMC08S2GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const [submitDisable, setNextDisable] = useState(false)
  const [page, setPage] = useState(0)
  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')
  const [showPage0Text, setShowPage0Text] = useState(true)
  const [showPage1Text, setShowPage1Text] = useState(false)
  const [showPage2Text, setShowPage2Text] = useState(false)
  const [showResetButton, setShowResetButton] = useState(false)
  const [slider, setSlider] = useState(number)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(true)
    setNextDisable(true)
    setPage(0)
    if (api == null) return

    api.registerObjectUpdateListener('t1', () => {
      const triangleValue = api.getValue('t1')
      if (triangleValue >= 6.13) {
        setNextDisable(false)
        setShowOnboarding1(false)
      } else if (triangleValue <= 6.13) {
        setNextDisable(false)
        setShowOnboarding1(false)
      }
    })

    return () => {
      ggbApi.current?.unregisterObjectUpdateListener('t1')
    }
  }, [])

  const onSliderChange = useCallback((value: number) => {
    setShowOnboarding1(false)
    setNextDisable(false)

    if (ggbApi.current) {
      ggbApi.current.setValue('ang', value / 15)
    }

    if (value === 100) {
      setShowPage1Text(false)
      setShowPage2Text(true)
      setShowResetButton(true)
    } else {
      setShowPage1Text(true)
      setShowPage2Text(false)
      setShowResetButton(false)
    }
  }, [])

  const onSubmitClick = useCallback(() => {
    setPage(1)
    playClick()
    setNextDisable(true)
    setShowPage0Text(false)
    setShowPage1Text(true)

    if (ggbApi.current) {
      ggbApi.current.setValue('screen', 2)
    }
    const api = ggbApi.current
    if (api != null && ggbLoaded) {
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('angl')
      }
    }
  }, [ggbLoaded, playClick])

  const onCLickResetButton = useCallback(() => {
    setPage(0)
    onInteraction('tap')
    playClick()
    setShowPage0Text(true)
    setShowPage1Text(false)
    setShowResetButton(false)
    setShowOnboarding1(true)
    if (ggbApi.current) {
      ggbApi.current.setValue('screen', 1)
      ggbApi.current.setValue('ang', 0)
    }
  }, [onInteraction, playClick])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-gmc08-s2-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Visualization of a right circular cone."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <CenteredGGBLeft materialId={'e6gm3kjx'} onApiReady={onGGBLoaded} width={700} height={650} />
      {page == 0 && (
        <SubmitBtn onClick={onSubmitClick} submitDisabled={submitDisable} disabled={submitDisable}>
          Submit
        </SubmitBtn>
      )}

      {page == 0 && showPage0Text && <PageText2 src={text0} page={page} />}
      {page == 1 && showPage1Text && <PageTexts src={text1} page={page} />}
      {page == 1 && showPage2Text && <PageText2 src={text2} />}
      {ggbLoaded && page === 1 && (
        <SliderContainer
          value={3}
          min={0}
          max={6.28}
          onChangePercent={onSliderChange}
          reset={slider === 0}
        />
      )}
      {showResetButton && <ResetButton src={ResetImg} onClick={onCLickResetButton}></ResetButton>}
      {showOnboarding1 && ggbLoaded && (
        <OnboardingAnimationContainer left={5} top={195} src={direction} loop autoplay />
      )}
    </AppletContainer>
  )
}
