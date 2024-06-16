import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import RotationAnimation from '../../common/handAnimations/Rotatebothsides.json'
import { Header } from '../../common/Header'
import { Math as Latex } from '../../common/Math'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'

const GGB = styled(Geogebra)`
  position: absolute;
  top: 110px;
  width: 100%;
  display: flex;
  justify-content: center;
`
const Angles = styled.div`
  font-family: 'Nunito';
  /* position: absolute; */
  /* top: 530px; */
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-weight: 700;
  font-size: 20px;
  z-index: 1;
  padding: 0 50px;
  height: 35px;
  align-items: center;
`
const Angle = styled.div`
  color: ${(props) => props.color || 'black'};
`
const ColoredBoxes = styled.span`
  background-color: ${(props) => props.color || 'inherit'};
  padding: 5px 25px;
  border-radius: 6px;
`

const ColoredSpan = styled.span`
  color: ${(props) => props.color || 'inherit'};
  padding: 0px 5px;
`

const TotalAngleDiv = styled.div`
  font-family: 'Nunito';
  /* position: absolute; */
  /* bottom: 120px; */
  /* top: 596px; */
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  color: #646464;
`

const TickAnimation = styled(Player)`
  position: absolute;
  top: 150px;
  left: 50%;
  translate: -27%;
  z-index: 1;
  pointer-events: none;
  transform: rotate(30deg);
`

const ThinTextSpan = styled.span`
  font-weight: 400;
`

const BottomTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  position: absolute;
  width: 100%;
  top: 530px;
  z-index: 5;
`

export const Applet4801Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [angleAOB, setAngleAOB] = useState(0)
  const [angleCOB, setAngleCOB] = useState(0)
  const [showTotalAngle, setShowTotalAngle] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [showHandPointer, setShowHandPointer] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const [showFinalText, setShowFinalText] = useState(false)

  const getCurrentAngle = () => {
    if (ggbApi.current !== null) {
      const angle = ggbApi.current.getValue('α')
      const angleInDeg = (angle * 180) / Math.PI
      const angPOQ = parseInt(angleInDeg.toFixed())
      const ROQ = 90 - angPOQ
      setAngleAOB(angPOQ)
      setAngleCOB(ROQ)
      if (angPOQ !== 30) setShowTotalAngle(true)
    }
  }

  let dragTimer: ReturnType<typeof setInterval> | null = null
  const handleGGbReady = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setGgbLoaded(true)
      getCurrentAngle()
      setShowHandPointer(true)
      api.registerClientListener((e: any) => {
        getCurrentAngle()
        if (e.type === 'mouseDown' && e.hits.length > 0) {
          setShowHandPointer(false)
          playMouseIn()
          onInteraction('drag')
          // setShowTotalAngle(true)
          dragTimer = setInterval(function () {
            getCurrentAngle()
          }, 100)
        }
        if (e.type === 'dragEnd' && e.target === "B''") {
          if (!showFinalText) setShowFinalText(true)
          getCurrentAngle()
          playMouseOut()
          if (dragTimer !== null) clearInterval(dragTimer)
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: '48_01_GE',
        onEvent,
        className,
      }}
    >
      {showHandPointer && <TickAnimation src={RotationAnimation} autoplay loop />}

      <GGB
        materialId="gpnq4mgf"
        onApiReady={handleGGbReady}
        pointToTrack={'A'}
        showOnBoarding={true}
        onboardingAnimationSrc={RotationAnimation}
        isApplet2D={true}
      />
      <Header backgroundColor="#E7FBFF" buttonColor="#D1F7FF">
        <div
          style={{
            textAlign: 'center',
            color: '#444',
            fontFamily: 'Nunito',
            fontSize: '20px',
            fontWeight: '700',
          }}
        >
          Modify the angle and observe the relation between <br />{' '}
          <Latex>{String.raw`\angle`}</Latex>AOB and <Latex>{String.raw`\angle`}</Latex>BOC.
        </div>
      </Header>
      <BottomTexts>
        {ggbLoaded && (
          <Angles>
            <Angle color="#AA5EE0">
              <ThinTextSpan>m</ThinTextSpan>
              <Latex>{String.raw`\angle`}</Latex>AOB <ColoredSpan color="#646464">=</ColoredSpan>{' '}
              <ColoredBoxes color="#F4E5FF">{angleCOB}°</ColoredBoxes>
            </Angle>
            <Angle color="#D97A1A">
              <ThinTextSpan>m</ThinTextSpan>
              <Latex>{String.raw`\angle`}</Latex>BOC <ColoredSpan color="#646464">=</ColoredSpan>{' '}
              <ColoredBoxes color="#FFE9D4">{angleAOB}°</ColoredBoxes>
            </Angle>
          </Angles>
        )}
        {showTotalAngle && (
          <TotalAngleDiv>
            <ColoredSpan color="#D97A1A">
              <ThinTextSpan>m</ThinTextSpan>
              <Latex>{String.raw`\angle`}</Latex>AOB
            </ColoredSpan>{' '}
            +
            <ColoredSpan color="#AA5EE0">
              {' '}
              <ThinTextSpan>m</ThinTextSpan>
              <Latex>{String.raw`\angle`}</Latex>BOC
            </ColoredSpan>{' '}
            = <ColoredSpan color="#1CB9D9">90°</ColoredSpan>
          </TotalAngleDiv>
        )}
        {showFinalText && (
          <div
            style={{
              fontFamily: 'Nunito',
              // position: 'absolute',
              // top: '669px',
              color: '#646464',
              fontWeight: '700',
              textAlign: 'center',
              fontSize: '20px',
              padding: '0 40px',
              width: '100%',
            }}
          >
            Two angles are said to be complementary if their measures
            <br />
            add up to 90°.
          </div>
        )}
      </BottomTexts>
    </AppletContainer>
  )
}
