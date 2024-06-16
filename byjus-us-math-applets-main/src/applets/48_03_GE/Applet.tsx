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
  top: 120px;
  width: 100%;
  display: flex;
  justify-content: center;
`

const Angles = styled.div`
  font-family: 'Nunito';
  /* position: absolute;
  top: 530px; */
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-weight: 700;
  font-size: 20px;
  z-index: 1;
  padding: 0 40px;
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
  top: 170px;
  left: 51.5%;
  translate: -53%;
  z-index: 1;
  pointer-events: none;
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

export const Applet4803Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [anglePOQ, setAnglePOQ] = useState(0)
  const [angleROQ, setAngleROQ] = useState(0)
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
      const ROQ = 180 - angPOQ
      setAnglePOQ(angPOQ)
      setAngleROQ(ROQ)
      if (angPOQ !== 90) setShowTotalAngle(true)
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
          dragTimer = setInterval(function () {
            getCurrentAngle()
          }, 500)
        }
        if (e.type === 'dragEnd' && e.target === "B''") {
          if (!showFinalText) setShowFinalText(true)
          getCurrentAngle()
          playMouseOut()
          if (dragTimer !== null) clearInterval(dragTimer)
        }
      })
    },
    [playMouseIn, onInteraction, playMouseOut],
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: '48_03_GE',
        onEvent,
        className,
      }}
    >
      {showHandPointer && <TickAnimation src={RotationAnimation} autoplay loop />}

      <GGB
        materialId="vxrwr7b4"
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
          <Latex>{String.raw`\angle`}</Latex>POQand <Latex>{String.raw`\angle`}</Latex>QOR.
        </div>
      </Header>
      <BottomTexts>
        {ggbLoaded && (
          <Angles>
            <Angle color="#AA5EE0">
              <ThinTextSpan>m</ThinTextSpan>
              <Latex>{String.raw`\angle`}</Latex>POQ <ColoredSpan color="#646464">=</ColoredSpan>{' '}
              <ColoredBoxes color="#F4E5FF">{angleROQ}°</ColoredBoxes>
            </Angle>
            <Angle color="#D97A1A">
              <ThinTextSpan>m</ThinTextSpan>
              <Latex>{String.raw`\angle`}</Latex>QOR <ColoredSpan color="#646464">=</ColoredSpan>{' '}
              <ColoredBoxes color="#FFE9D4">{anglePOQ}°</ColoredBoxes>
            </Angle>
          </Angles>
        )}
        {showTotalAngle && (
          <TotalAngleDiv>
            <ColoredSpan color="#D97A1A">
              <ThinTextSpan>m</ThinTextSpan>
              <Latex>{String.raw`\angle`}</Latex>POQ
            </ColoredSpan>{' '}
            +
            <ColoredSpan color="#AA5EE0">
              <ThinTextSpan>m</ThinTextSpan>
              <Latex>{String.raw`\angle`}</Latex>QOR
            </ColoredSpan>{' '}
            = <ColoredSpan color="#1CB9D9">180°</ColoredSpan>
          </TotalAngleDiv>
        )}
        {showFinalText && (
          <div
            style={{
              fontFamily: 'Nunito',
              // position: 'absolute',
              // top: '669px',
              color: '#646464',
              textAlign: 'center',
              fontSize: '20px',
              padding: '10px 40px',
              width: '100%',
            }}
          >
            Two angles are said to be supplementary if their measures <br /> add up to 180°.
          </div>
        )}
      </BottomTexts>
    </AppletContainer>
  )
}
