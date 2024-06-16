import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { PrimaryRangeSlider } from '@/atoms/RangeSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import Slider from '../../common/handAnimations/slider.json'
import slidertext2 from './assets/five.svg'
import slidertext1 from './assets/one.svg'
import ResetImg from './assets/ResetBut.svg'
import text0 from './assets/text0.svg'
import text1 from './assets/text1.svg'

export const CenteredGGBLeft = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 700px;
  height: 500px;
  left: 10px;
  top: 80px;
  z-index: 0;
  margin-right: -1px;
  border: none;
  scale: 0.92;
  z-index: 0;
`

export const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 1;
`
export const SliderContainer = styled.div`
  position: absolute;
  top: 680px;
  left: 50%;
  translate: -50%;
  width: 670px;
  height: 50px;
`
export const SliderText = styled.img`
  position: absolute;
  left: 2px;
  bottom: 125px;
  z-index: 1;
`
export const SliderText2 = styled.img`
  position: absolute;
  left: 675px;
  bottom: 123px;
  z-index: 1;
`

const Text1 = styled.img`
  position: absolute;
  left: 675px;
  bottom: 95px;
  z-index: 1;
`

export const NextBtn = styled.button<{ nextDisabled: boolean }>`
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
  background: ${({ nextDisabled }) => (nextDisabled ? '#D1D1D1' : '#1a1a1a')};
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
const ResetButton = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  transition: all.3s;
  :hover {
    scale: 1.05;
    cursor: pointer;
  }
  z-index: 2;
`

const PageTexts = styled.img<{ page: number }>`
  position: absolute;
  left: ${(props) => {
    switch (props.page) {
      case 0:
        return '220px'
      case 1:
        return '180px'
      default:
        return '220px'
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

export const AppletG08GMC08S2GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [nextDisable, setNextDisable] = useState(false)
  const [page, setPage] = useState(0)
  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')
  const [showPage0Text, setShowPage0Text] = useState(true)
  const [showPage1Text, setShowPage1Text] = useState(false)
  const [showResetButton, setShowResetButton] = useState(false)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(true)
    setNextDisable(true)
    setPage(0)
  }, [])

  const onSliderChange = useCallback((value: number) => {
    setShowOnboarding1(false)
    setNextDisable(false)
    if (ggbApi.current) {
      ggbApi.current.setValue('r', value)
    }
  }, [])

  const onNextClick = useCallback(() => {
    setPage(1)
    playClick()
    setNextDisable(true)
    setShowPage0Text(false)

    if (ggbApi.current) {
      ggbApi.current.setValue('Dir', 2)
    }
    const api = ggbApi.current
    if (api != null && ggbLoaded) {
      let anglevalue = 0
      api.registerObjectUpdateListener('angl', () => {
        anglevalue = api.getValue('angl')

        if (anglevalue > 6) {
          setShowPage1Text(true)
          setShowResetButton(true)
        }
      })

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
      ggbApi.current.setValue('Dir', 1)
      ggbApi.current.setValue('angl', 0)
      ggbApi.current.setValue('r', 1)
      ggbApi.current.setValue('delayslider', 1)
    }
  }, [onInteraction, playClick])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-gmc08-s2-gb03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Forming a sphere by rotating a circle about its diameter"
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <CenteredGGBLeft materialId={'f8yrwxdf'} onApiReady={onGGBLoaded} width={700} height={500} />
      {showOnboarding1 && ggbApi && (
        <OnboardingAnimationContainer left={-30} top={640} src={Slider} loop autoplay />
      )}
      {ggbLoaded && (
        <>
          {page == 0 && (
            <SliderContainer>
              <PrimaryRangeSlider
                sliderColor="#FFFFFF"
                trackColor="#FFFFFF"
                disableTrack={true}
                min={1}
                max={5}
                step={0.1}
                onChangeBegin={() => playMouseIn()}
                onChangeComplete={() => playMouseOut()}
                onChange={onSliderChange}
              />
            </SliderContainer>
          )}
          {page == 0 && <SliderText src={slidertext1} />}
          {page == 0 && <SliderText2 src={slidertext2} />}
          {page == 0 && (
            <NextBtn onClick={onNextClick} nextDisabled={nextDisable} disabled={nextDisable}>
              Next
            </NextBtn>
          )}
          {showResetButton && (
            <ResetButton src={ResetImg} onClick={onCLickResetButton}></ResetButton>
          )}
          {page == 0 && showPage0Text && <PageTexts src={text0} page={page} />}
          {showPage1Text && <PageTexts src={text1} page={page} />}
        </>
      )}
    </AppletContainer>
  )
}
