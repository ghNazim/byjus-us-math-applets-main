import { Player, PlayerState } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Button } from '../../common/Button'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import handAnimation from '../../common/handAnimations/moveAllDirections.json'
import { Header, TextHeader } from '../../common/Header'
import { IncorrectFeedback } from '../../common/IncorrectFeedback'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import correct from './Assets/correct.mp3'
import disclaimer from './Assets/disclaimer.png'
import incorrect from './Assets/incorrect.wav'
import Blast from './Assets/TickAnimation.json'
import X from './Assets/X.svg'
import Y from './Assets/Y.svg'

const XImgPos = styled.img`
  position: absolute;
  left: 685px;
  top: 550px;
  z-index: 1;
`

const YImgPos = styled.img`
  position: absolute;
  left: 40px;
  top: 105px;
  z-index: 1;
`
const PlacedGeoGebra = styled(Geogebra)`
  position: absolute;
  top: 80px;
  left: 2;
  translate: 2%;
`
const Text = styled.p`
  color: #444;
  font-family: 'Nunito';
  font-size: 20px;
  font-weight: 700;

  text-align: center !important;
  line-height: 28px;
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
const AnimationPlayer = styled(Player)`
  position: absolute;
  top: 130px;
  left: 100px;
  z-index: 1;
`

export const Applet4401Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const [coordinateValuesX, SetCoordinateValueX] = useState(0)
  const [coordinateValuesY, SetCoordinateValueY] = useState(0)
  const [playerCoordinateX, SetPlayerCoordinateX] = useState(0)
  const [playerCoordinateY, SetPlayerCoordinateY] = useState(0)
  const [checkButtonDisable, setCheckButtonDisable] = useState(true)
  const [showTickAnimation, setShowTickAnimation] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const [disable, setDisable] = useState(false)
  const [showTryNewButton, setShowTryNewButton] = useState(false)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const playCorrect = useSFX('correct')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playIncorrect = useSFX('incorrect')
  const onInteraction = useContext(AnalyticsContext)
  const [showPop, setShowPop] = useState({ component: false, animation: false })

  const GGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (ggbApi.current == null) return
      setGGBLoaded(true)

      SetCoordinateValueX(ggbApi.current.getValue('xS'))
      SetCoordinateValueY(ggbApi.current.getValue('yS'))

      SetPlayerCoordinateX(ggbApi.current.getValue('x(M)'))
      SetPlayerCoordinateY(ggbApi.current.getValue('y(M)'))
      setShowHandPointer(true)

      ggbApi.current.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'c') {
          onInteraction('drag')
          playMouseIn()
          setDisable(true)
          setCheckButtonDisable(false)
          setShowHandPointer(false)
        } else if (e.type === 'dragEnd' && e.target === 'c') {
          onInteraction('drop')

          if (ggbApi.current == null) return

          SetPlayerCoordinateX(ggbApi.current.getValue('x(M)'))
          SetPlayerCoordinateY(ggbApi.current.getValue('y(M)'))

          playMouseOut()
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )
  const onTryNew = () => {
    if (ggbApi.current == null) return
    setShowTryNewButton(false)
    setDisable(false)
    setCheckButtonDisable(true)
    ggbApi.current?.setValue('countQuestion', ggbApi.current?.getValue('countQuestion') + 1)
    ggbApi.current?.setValue('lensVisible', 1)
    ggbApi.current?.setValue('showsolution', 0)
    ggbApi.current?.setValue('validate', 0)
    SetCoordinateValueX(ggbApi.current.getValue('xS'))
    SetCoordinateValueY(ggbApi.current.getValue('yS'))
    setShowTickAnimation(false)
  }

  const onCheckClick = () => {
    if (playerCoordinateX == coordinateValuesX && playerCoordinateY == coordinateValuesY) {
      playCorrect()
      setShowTryNewButton(true)
      ggbApi.current?.setValue('validate', 1)
      ggbApi.current?.setValue('showsolution', 1)
      ggbApi.current?.setValue('lensVisible', 0)
      setShowTickAnimation(true)
    } else {
      setShowPop({ component: true, animation: true })
      ggbApi.current?.setValue('validate', 1)
      playIncorrect()
    }
  }
  const popCloseHandle = () => {
    setShowPop((p) => ({ ...p, animation: false }))
    ggbApi.current?.setValue('validate', 0)
    setCheckButtonDisable(true)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: '44_01_PR',
        onEvent,
        className,
      }}
    >
      {ggbLoaded && (
        <Header backgroundColor={'#F3F7FE'} buttonColor={'#F3F7FE'} hideButton={true}>
          <Text>
            {'Locate the treasure at '}
            <span style={{ color: '#6595DE' }}>
              {'(' + coordinateValuesX + ', ' + coordinateValuesY + ')'}
            </span>
            {'.'}
          </Text>
        </Header>
      )}

      <PlacedGeoGebra
        width={700}
        height={500}
        materialId={'aqmdm96q'}
        onApiReady={GGBLoaded}
        pointToTrack={'M'}
        showOnBoarding={showHandPointer}
        onboardingAnimationSrc={handAnimation}
        isApplet2D={true}
      />
      {!showTryNewButton && (
        <Button disable={checkButtonDisable} onClick={onCheckClick} type={'check'} />
      )}
      {showTickAnimation && <AnimationPlayer src={Blast} autoplay />}
      {showTryNewButton && <Button onClick={onTryNew} type={'tryNew'} />}
      {showPop.component && (
        <IncorrectFeedback
          showPopAnimation={showPop.animation}
          disclaimer={disclaimer}
          onClose={popCloseHandle}
        >
          <PopText>
            <p>
              The location you have chosen is ({playerCoordinateX}, {playerCoordinateY}). But, the
              treasure is at ({coordinateValuesX}, {coordinateValuesY}).
            </p>
          </PopText>
        </IncorrectFeedback>
      )}

      {ggbLoaded && <XImgPos src={X} />}
      {ggbLoaded && <YImgPos src={Y} />}
    </AppletContainer>
  )
}
