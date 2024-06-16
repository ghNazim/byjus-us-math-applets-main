import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Button } from '../../common/Button'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import handAnimation from '../../common/handAnimations/moveAllDirections.json'
import tickAnime from '../../common/handAnimations/tickAnimation.json'
import { Header } from '../../common/Header'
import { IncorrectFeedback } from '../../common/IncorrectFeedback'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import disclaimer from './Assets/disclaimer.png'
const GGB = styled(Geogebra)`
  position: absolute;
  top: 20px;
  left: 0;
`
const AnimationHide = styled.div`
  position: absolute;
  top: 200px;
  left: 0;
  width: 50px;
  height: 500px;
  background-color: white;
`
const Text = styled.p`
  color: #444;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 400;
  margin: 0;
  max-width: 600px;
  min-height: 40px;
  text-align: center !important;
`
const TextBold = styled.span`
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
`
const TickAnimation = styled(Player)`
  position: absolute;
  top: 190px;
  left: 50%;
  translate: -53%;
  z-index: 1;
`
const PopText = styled.div`
  width: 95%;
  margin: 80px 0;
  p {
    margin: 0;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    text-align: left;
    color: #444444;
  }
`
export const Applet4402Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [showHandPointer, setShowHandPointer] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const [showTick, setShowTick] = useState(false)
  const [checkDisable, setCheckDisable] = useState(true)
  const [showTryNew, setShowTryNew] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playCorrect = useSFX('correct')
  const onInteraction = useContext(AnalyticsContext)
  const [showPop, setShowPop] = useState({ component: false, animation: false })
  const [shipMove, setShipMove] = useState(false)
  const [handTimer, setHandTimer] = useState(false)
  const [xCoord, setXCoord] = useState(randomNumberInRange(0, 7))
  const [yCoord, setYCoord] = useState(0)
  function randomNumberInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  function generateY(): number {
    const y = xCoord === 0 ? randomNumberInRange(1, 7) : randomNumberInRange(0, 7)
    if (y === yCoord) generateY()
    return y
  }
  useEffect(() => {
    setYCoord(generateY())
  }, [xCoord])
  const onHandleGGB = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGGBLoaded(true)
      setShowHandPointer(true)
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'B') {
          setShowHandPointer(false)
          setHandTimer(false)
          setCheckDisable(false)
          onInteraction('move-point')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'B') {
          playMouseOut()
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )
  const playerHandle = (event: any) => {
    if (event == 'complete') {
      setShowTick(false)
      setShowTryNew(true)
    }
  }
  const onCheckHandle = () => {
    if (ggbApi.current == null) return
    const api = ggbApi.current
    setCheckDisable(true)
    api.setFixed('B', false, false)
    api.setValue('Cap', 1)
    setShipMove(true)
  }
  useInterval(
    () => {
      if (ggbApi.current == null) return
      const api = ggbApi.current
      if (!api.getVisible('pic2')) {
        setShipMove(false)
        if (api.getXcoord('B') == xCoord && api.getYcoord('B') == yCoord) {
          api.setValue('Pirate', 1)
          setShowTick(true)
          playCorrect()
        } else setShowPop({ component: true, animation: true })
      }
    },
    shipMove ? 2000 : null,
  )
  useInterval(
    () => {
      if (checkDisable) setShowHandPointer(true)
      setHandTimer(false)
    },
    handTimer && !showHandPointer ? 5000 : null,
  )
  const onTryNewHandle = () => {
    setXCoord(randomNumberInRange(0, 7))
    setShowTryNew(false)
    if (ggbApi.current == null) return
    const api = ggbApi.current
    api.setFixed('B', false, true)
    api.setCoords('B', 0, 0)
    api.setValue('Cap', 0)
    api.setValue('Pirate', 0)
  }
  const popCloseHandle = () => {
    setShowPop((p) => ({ ...p, animation: false }))
    if (ggbApi.current == null) return
    const api = ggbApi.current
    api.setValue('Cap', 0)
    api.setFixed('B', false, true)
    setHandTimer(true)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F3F7FE',
        id: '44_02_PR',
        onEvent,
        className,
      }}
    >
      <Header backgroundColor="#F3F7FE" hideButton={true}>
        <Text>
          {'Find the location of the pirate ship that is situated '}
          <TextBold>{xCoord + ' units'}</TextBold>
          {' along the x-axis and '}
          <TextBold>{yCoord + ' units'}</TextBold>
          {' along the y-axis.'}
        </Text>
      </Header>
      <GGB
        width={650}
        height={600}
        materialId="xkvsamkx"
        onApiReady={onHandleGGB}
        pointToTrack={'B'}
        showOnBoarding={showHandPointer}
        onboardingAnimationSrc={handAnimation}
        isApplet2D={true}
      />
      <AnimationHide />
      {showTick && <TickAnimation src={tickAnime} autoplay onEvent={playerHandle} />}
      {ggbLoaded && !showTryNew && (
        <Button disable={checkDisable} onClick={onCheckHandle} type={'check'} />
      )}
      {showTryNew && <Button onClick={onTryNewHandle} type={'tryNew'} />}
      {showPop.component && (
        <IncorrectFeedback
          showPopAnimation={showPop.animation}
          disclaimer={disclaimer}
          onClose={popCloseHandle}
        >
          <PopText>
            <p>
              No ship found. The location you have chosen is{' '}
              <span style={{ fontWeight: 'bold' }}>
                {ggbApi.current?.getXcoord('B')} units away along the x-axis
              </span>{' '}
              and{' '}
              <span style={{ fontWeight: 'bold' }}>
                {ggbApi.current?.getYcoord('B')} units away along the y-axis
              </span>
              . Try again!
            </p>
          </PopText>
        </IncorrectFeedback>
      )}
    </AppletContainer>
  )
}
