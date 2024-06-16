import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { PrimaryRangeSlider } from '@/atoms/RangeSlider'
import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import RotationAnimation from '../../common/handAnimations/Rotatebothsides.json'
import HandPointAnimation from '../../common/handAnimations/slider.json'
import { Header } from '../../common/Header'
import { Math as Latex } from '../../common/Math'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'

const TickAnimation = styled(Player)`
  position: absolute;
  top: 275px;
  left: 475px;
  width: 200px;
  transform: rotate(60deg);
  pointer-events: none;
  scale: 1.5;
`
const CustomHandAnimation = styled(Player)`
  position: absolute;
  top: 485px;
  left: 200px;
  scale: -1 1;
  z-index: 10;
  pointer-events: none;
`
const ColoredSpan = styled.span`
  color: ${(props) => props.color};
`
const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`
const TextHolder = styled.div`
  position: absolute;
  width: 50%;
  top: 640px;
  left: 180px;
  z-index: 5;

  animation-duration: 500ms;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${fadeInRight};
`

const StyledGeogebra = styled(Geogebra)<{ disable: boolean }>`
  pointer-events: ${(props) => (props.disable ? 'none' : 'auto')};
  position: absolute;
  top: 80px;
  left: 30px;
  width: 700px;
  display: flex;
  justify-content: center;
`

const SliderContainer = styled.div`
  position: absolute;
  top: 520px;
  left: 185px;
  width: 350px;
  height: 50px;
  z-index: 1;
`

const LabelText = styled.div`
  position: absolute;
  width: 125px;
  height: 28px;
  right: 295px;
  top: 555px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;

  text-align: center;

  color: #6549c2;
`

export const Applet4802Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [showtext, setShowText] = useState(false)
  const [OnBoardingAnimation, setOnboardingAnimation] = useState(true)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [copyEnd, setCopyEnd] = useState(false)
  const [hidePointer, setHidePointer] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      setGgbLoaded(true)

      ggbApi.current = api
      if (api == null) return
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits.length > 0) {
          setHidePointer(true)
          playMouseIn()
          onInteraction('drag')
        }
        if (e.type === 'dragEnd' && e.target === 'D') {
          playMouseOut()
        }

        setShowText(true)
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  const onSliderChange = (_: number, ratio: number) => {
    if (ggbApi.current) {
      ggbApi.current.setValue('master', 3 * ratio)
      setOnboardingAnimation(false)
      if (ratio === 1) {
        setCopyEnd(true)
      }
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E7FBFF',
        id: '48_02_GE',
        onEvent,
        className,
      }}
    >
      <Header backgroundColor="#E7FBFF" buttonColor="#D1F7FF">
        <p
          style={{
            color: '#444',
            fontFamily: 'Nunito',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0',
            textAlign: 'center',
          }}
        >
          Modify {<Latex>{String.raw`\angle`}</Latex>}A to understand to it’s relation with{' '}
          {<Latex>{String.raw`\angle`}</Latex>}B.
        </p>
      </Header>

      <StyledGeogebra materialId={'eu2r4ucb'} onApiReady={onGGBLoaded} disable={!copyEnd} />
      {ggbLoaded && OnBoardingAnimation && (
        <CustomHandAnimation src={HandPointAnimation} autoplay loop />
      )}

      {ggbLoaded && copyEnd && !hidePointer ? (
        <TickAnimation src={RotationAnimation} autoplay loop />
      ) : null}
      {showtext ? (
        <TextHolder>
          <div
            style={{
              color: '#646464',
              fontFamily: 'Nunito',
              fontSize: '21px',
              fontWeight: '700',
              textAlign: 'center',
              lineHeight: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div>
              <ColoredSpan color=" #2AD3F5">m{<Latex>{String.raw`\angle`}</Latex>}A</ColoredSpan> =
              90° -{' '}
              <ColoredSpan color="#F57A7A">m{<Latex>{String.raw`\angle`}</Latex>}B</ColoredSpan>
            </div>
            <div>
              <ColoredSpan color=" #2AD3F5">{<Latex>{String.raw`\angle`}</Latex>}A</ColoredSpan> is
              complement of{' '}
              <ColoredSpan color="#F57A7A">{<Latex>{String.raw`\angle`}</Latex>}B</ColoredSpan>
            </div>
          </div>
        </TextHolder>
      ) : null}

      {ggbLoaded ? (
        <>
          <LabelText>Move angle</LabelText>
          <SliderContainer>
            <PrimaryRangeSlider
              min={0}
              max={100}
              vertical={false}
              reverse={true}
              onChange={onSliderChange}
              onChangeBegin={() => playMouseIn()}
              onChangeComplete={() => playMouseOut()}
            />
          </SliderContainer>
        </>
      ) : null}
    </AppletContainer>
  )
}
