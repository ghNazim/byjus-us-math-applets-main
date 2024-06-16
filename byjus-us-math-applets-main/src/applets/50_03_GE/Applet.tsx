import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { PrimaryRangeSlider } from '@/atoms/RangeSlider'
import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import moveHorizontal from '../../common/handAnimations/moveHorizontally.json'
import { TextHeader } from '../../common/Header'
import { Ticker } from '../../common/Ticker'
import { AppletInteractionCallback } from '../../contexts/analytics'
import icon from './Assets/3Dicon.svg'
import grid from './Assets/Grid.svg'
import text from './Assets/TextBG.svg'

const AnimationPointer = styled(Player)`
  position: absolute;
  width: 100px;
  top: 643px;
  left: 338px;
  pointer-events: none;
  scale: 3;
`

const CenteredGGBLeft = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  overflow: hidden;
  /* width: 347px; */
  /* height: 330px; */
  bottom: 255px;
  left: 40px;
  z-index: -1;
`
const CenteredGGBRight = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 253px;
  height: 237px;
  bottom: 300px;
  left: 405px;
  z-index: -1;
`

const SliderContainer = styled.div`
  position: absolute;
  top: 630px;
  left: 245px;
  width: 291.71px;
  height: 50px;
`
const RectangleBG = styled.div`
  box-sizing: border-box;
  pointer-events: none;
  position: absolute;
  width: 650px;
  height: 350px;
  left: 32px;
  top: 123px;

  border: 1px solid #8c69ff;
  border-radius: 10px;
  z-index: -1;
`
const SeprationLine = styled.div`
  position: absolute;
  border-left: 1px solid #8c69ff;
  height: 300px;
  left: 380px;
  top: 150px;
  z-index: 1;
`
const IconBG = styled.img`
  position: absolute;
  left: 48%;
  translate: -48%;
  bottom: 540px;
  z-index: 1;
  transition: all 0.3s;
  :hover {
    scale: 1.1;
    cursor: pointer;
  }
`

const GridBG = styled.img`
  position: absolute;
  left: 87%;
  translate: -87%;
  bottom: 300px;
  z-index: -1;
  pointer-events: none;
`
const TextBG = styled.img`
  position: absolute;
  left: 83%;
  translate: -83%;
  bottom: 555px;
  z-index: -1;
`

const TickerLabel = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 19px;
  line-height: 28px;
  text-align: center;
  color: #6549c2;
`
const SliderLabel = styled.div`
  position: absolute;
  width: 105px;
  height: 28px;
  left: 120px;
  top: 625px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 19px;
  line-height: 28px;

  text-align: center;

  color: #6549c2;
`
const TickerBoxRight = styled.div`
  position: absolute;
  left: 400px;
  top: 540px;
  width: 230px;
  display: flex;
  gap: 6px;
`

const TickerBoxLeft = styled.div`
  position: absolute;
  left: 90px;
  top: 540px;
  width: 230px;
  display: flex;
  gap: 6px;
`
export const Applet5003Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApiRight = useRef<GeogebraAppApi | null>(null)
  const ggbApiLeft = useRef<GeogebraAppApi | null>(null)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [isAtInitPos, setIsAtInitPos] = useState(false)
  const [OnBoardingAnimation, setOnboardingAnimation] = useState({ 0: true, 1: true, 2: true })
  const onSliderChange = (value: number) => {
    if (ggbApiRight.current) {
      ggbApiRight.current.setValue('ud', value)
      setOnboardingAnimation((p) => {
        const d = { ...p }
        d[0] = false
        return d
      })
    }

    if (ggbApiLeft.current) {
      ggbApiLeft.current.setValue('ud', value)
      setOnboardingAnimation((p) => {
        const d = { ...p }
        d[0] = false
        return d
      })
    }
  }

  const onGGBLoadedRight = useCallback((api: GeogebraAppApi | null) => {
    ggbApiRight.current = api

    setGgbLoaded(true)
  }, [])
  const onGGBLoadedLeft = useCallback((api: GeogebraAppApi | null) => {
    ggbApiLeft.current = api
    setGgbLoaded(true)
  }, [])

  const onChangeLeftTicker = (value: number) => {
    if (ggbApiRight.current && ggbApiLeft.current) {
      const api = ggbApiLeft.current
      api.setVisible('h', false)
      api.setVisible('zA', true)
      api.evalCommand(`SetValue(tt,${value}°)`)
      ggbApiRight.current.evalCommand(`SetValue(tt,${value}°)`)
      if (value !== 0)
        setOnboardingAnimation((p) => {
          const d = { ...p }
          d[1] = false
          return d
        })
    }
  }
  const onChangeRightTicker = (value: number) => {
    if (ggbApiRight.current && ggbApiLeft.current) {
      ggbApiLeft.current.setVisible('h', true)
      ggbApiLeft.current.setLabelVisible('h', false)
      ggbApiLeft.current.setVisible('zA', false)
      const api = ggbApiRight.current
      api.evalCommand(`SetValue(rr,${value}°)`)
      ggbApiLeft.current.evalCommand(`SetValue(rr,${value}°)`)
      if (value !== 0)
        setOnboardingAnimation((p) => {
          const d = { ...p }
          d[2] = false
          return d
        })
    }
  }

  const resetAxis = () => {
    ggbApiLeft.current?.setVisible('h', false)
    ggbApiLeft.current?.setVisible('zA', false)
  }

  useEffect(() => {
    resetAxis()
  }, [ggbLoaded])

  const onViewdirectionHandle = () => {
    if (ggbApiLeft.current) {
      setIsAtInitPos(!isAtInitPos)
      if (isAtInitPos) ggbApiLeft.current.evalCommand('SetViewDirection(Vector((.8, -.8, -.4)))')
      else ggbApiLeft.current.evalCommand('SetViewDirection()')
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#F1EDFF',
        id: '50_03_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Move the plane at different angles and view the cross&nbsp;sections of the cuboid."
        backgroundColor="#F1EDFF"
        buttonColor="#D9CDFF"
      />

      <CenteredGGBLeft
        materialId={'xxncqqmf'}
        onApiReady={onGGBLoadedLeft}
        // width={356}
        // height={317}
      />
      <CenteredGGBRight
        materialId={'jgm5qdfe'}
        onApiReady={onGGBLoadedRight}
        width={253}
        height={237}
      />
      {ggbLoaded && (
        <SliderContainer>
          <PrimaryRangeSlider
            defaultValue={-0.2}
            min={-6}
            max={6}
            step={0.1}
            thumbSize={32}
            onChange={onSliderChange}
            onChangeBegin={() => playMouseIn()}
            onChangeComplete={() => playMouseOut()}
          />
        </SliderContainer>
      )}

      {ggbLoaded && <SliderLabel>Move plane</SliderLabel>}
      {ggbLoaded && <RectangleBG />}
      {ggbLoaded && <SeprationLine />}
      {ggbLoaded && <IconBG src={icon} onClick={onViewdirectionHandle} />}
      {ggbLoaded && <GridBG src={grid} />}
      {ggbLoaded && <TextBG src={text} />}

      {ggbLoaded && (
        <>
          <TickerBoxLeft>
            <TickerLabel>Tilt the plane</TickerLabel>
            <Ticker
              min={0}
              max={180}
              onChange={onChangeLeftTicker}
              showHandOnBoarding={OnBoardingAnimation[0] == false && OnBoardingAnimation[1]}
              showHandDefault={false}
            />
            <TickerLabel>deg</TickerLabel>
          </TickerBoxLeft>
          <TickerBoxRight>
            <TickerLabel>Turn the plane</TickerLabel>
            <Ticker
              min={0}
              max={180}
              onChange={onChangeRightTicker}
              showHandOnBoarding={
                OnBoardingAnimation[0] == false &&
                OnBoardingAnimation[1] == false &&
                OnBoardingAnimation[2]
              }
              showHandDefault={false}
            />
            <TickerLabel>deg</TickerLabel>
          </TickerBoxRight>
        </>
      )}
      {OnBoardingAnimation[0] && ggbLoaded && (
        <AnimationPointer src={moveHorizontal} loop autoplay />
      )}
    </AppletContainer>
  )
}
