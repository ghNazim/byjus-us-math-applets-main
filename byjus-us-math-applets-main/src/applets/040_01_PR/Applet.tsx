import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Button } from '../../common/Button'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import RotateAnimation from '../../common/handAnimations/Rotatebothsides.json'
import tickAnime from '../../common/handAnimations/tickAnimation.json'
import { TextHeader } from '../../common/Header'
import { IncorrectFeedback } from '../../common/IncorrectFeedback'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import disclaimer from './Assets/disclaimer.png'
const GGB = styled(Geogebra)`
  position: absolute;
  top: 180px;
  left: 50%;
  translate: -50%;
`
const TickAnimation = styled(Player)`
  position: absolute;
  top: 190px;
  left: 50%;
  translate: -53%;
  z-index: 1;
`
const PopText = styled.div`
  width: 85%;
  margin: 80px 0;
  p {
    margin: 0;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    color: #444444;
  }
`
const feedback = [
  'Set the hour hand in the correct position.',
  'Set the minute hand in the correct position.',
  'Set the hour hand and minute hand in the correct position.',
]
export const Applet04001Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [trial, setTrial] = useState(0)
  const [minute, setMinute] = useState(0)
  const [hour, setHour] = useState(randomNumberInRange(1, 11))
  const [headerText, setHeaderText] = useState('')
  const [showTryNew, setShowTryNew] = useState(false)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const [showTick, setShowTick] = useState(false)
  const [checkDisable, setCheckDisable] = useState(true)
  const [text, setText] = useState('')
  const [time, setTime] = useState('')
  const [questionType, setQuestionType] = useState(-1)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playCorrect = useSFX('correct')
  const onInteraction = useContext(AnalyticsContext)
  const [showPop, setShowPop] = useState({ component: false, animation: false })

  function randomNumberInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const onCheckHandle = () => {
    if (ggbApi.current == null) return
    const api = ggbApi.current
    const roundOffMinute = api.getValue('minute') == 60 ? 0 : api.getValue('minute')
    const roundOffhour =
      api.getValue('minute') == 60
        ? api.getValue('hour') == 12
          ? 1
          : api.getValue('hour') + 1
        : api.getValue('hour')
    if (roundOffhour == hour && roundOffMinute == minute) {
      setShowTick(true)
      playCorrect()
      setCheckDisable(true)
      return
    } else if (roundOffhour != hour && roundOffMinute == minute) {
      setText(feedback[0])
    } else if (roundOffhour == hour && roundOffMinute != minute) {
      setText(feedback[1])
    } else {
      setText(feedback[2])
    }
    if (questionType == 2) {
      setTime(
        roundOffMinute == 0
          ? roundOffhour + " o'clock"
          : roundOffMinute +
              (roundOffMinute == 1 ? ' minute past ' : ' minutes past ') +
              roundOffhour,
      )
    } else
      setTime(
        (roundOffhour < 10 ? '0' + roundOffhour : roundOffhour) +
          ':' +
          (roundOffMinute < 10 ? '0' + roundOffMinute : roundOffMinute),
      )
    setShowPop((p) => ({ component: true, animation: true }))
  }
  const onTryNewHandle = () => {
    if (trial == 0) setMinute(5 * randomNumberInRange(1, 11))
    else setMinute(randomNumberInRange(0, 59))
    setHour(randomNumberInRange(1, 12))
    setTrial((t) => t + 1)
    setShowTryNew(false)
    if (ggbApi.current == null) return
    const api = ggbApi.current
    api.setCoords('A', 0.18, 26.7)
    api.setValue('hour', 12)
  }
  useEffect(() => {
    switch (
      trial == 0 || minute == 0
        ? 2
        : minute > 30
        ? randomNumberInRange(0, 2)
        : randomNumberInRange(2, 4)
    ) {
      case 0:
      case 1:
        setHeaderText(
          'Set the analog clock to ' +
            (60 - minute) +
            (60 - minute == 1 ? ' minute to ' : ' minutes to ') +
            (hour + 1 == 13 ? 1 : hour + 1) +
            '.',
        )
        setQuestionType(1)
        break
      case 2:
        setHeaderText(
          'Set the analog clock to ' +
            (hour < 10 ? '0' + hour : hour) +
            ':' +
            (minute < 10 ? '0' + minute : minute),
        )
        setQuestionType(0)
        break
      case 3:
      case 4:
        setHeaderText(
          'Set the analog clock to ' +
            minute +
            (minute == 1 ? ' minute past ' : ' minutes past ') +
            hour +
            '.',
        )
        setQuestionType(2)
        break
    }
  }, [trial])
  const onHandleGGB = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return
    setShowHandPointer(true)
    setGGBLoaded(true)
    api.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'A') {
        setShowHandPointer(false)
        setCheckDisable(false)
        onInteraction('drag')
        playMouseIn()
      } else if (e.type === 'dragEnd' && e.target === 'A') {
        onInteraction('drop')
        playMouseOut()
      }
    })
  }, [])
  const playerHandle = (event: any) => {
    if (event == 'complete') {
      setShowTick(false)
      setShowTryNew(true)
    }
  }
  const popCloseHandle = () => {
    setShowPop((p) => ({ ...p, animation: false }))
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '040_01_PR',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text={headerText}
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
        hideButton={true}
      />
      <GGB
        width={400}
        height={400}
        materialId="djfwnjfa"
        onApiReady={onHandleGGB}
        pointToTrack={'A'}
        showOnBoarding={showHandPointer}
        onboardingAnimationSrc={RotateAnimation}
        isApplet2D={true}
      />
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
              Your clock currently shows <span style={{ fontWeight: 'bold' }}>{time}</span>.
            </p>
            <p>{text}</p>
          </PopText>
        </IncorrectFeedback>
      )}
    </AppletContainer>
  )
}
