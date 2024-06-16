import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { PrimaryRangeSlider } from '@/atoms/RangeSlider'
import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import HandRight from '../../common/handAnimations/moveUp.json'
import RotationAnimation from '../../common/handAnimations/Rotatebothsides.json'
import { Header } from '../../common/Header'
import { Math as Latex } from '../../common/Math'
import { AppletInteractionCallback } from '../../contexts/analytics'

const StyledGeogebra = styled(Geogebra)<{ disable: boolean }>`
  pointer-events: ${(props) => (props.disable ? 'none' : 'auto')};
  position: absolute;
  width: 550px;
  top: 60px;
  left: 40px;
  z-index: -1;
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

const ColoredSpan = styled.span`
  color: ${(props) => props.color};
`

const TextHolder = styled.div`
  position: absolute;
  width: 50%;
  top: 670px;
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

const LabelText = styled.div`
  position: absolute;
  width: 125px;
  height: 28px;
  right: 20px;
  top: 200px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;

  text-align: center;

  color: #6549c2;
`

const SliderContainer = styled.div`
  position: absolute;
  top: 280px;
  left: 485px;
  width: 291.71px;
  height: 310px;
`

const TickAnimation = styled(Player)`
  position: absolute;
  top: 165px;
  left: 60.5%;
  translate: -53%;
  z-index: 10;
  rotate: 60deg;
  pointer-events: none;
`

const HandIntlAnim = styled(Player)`
  position: absolute;
  top: -420px;
  left: 14px;
  width: 300px;
  scale: 0.4 -0.4;
  z-index: 10;
  pointer-events: none;
`

export const Applet4804Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const [copyEnd, setCopyEnd] = useState(false)
  const [hidePointer, setHidePointer] = useState(false)
  const [showText, setShowText] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [hideIntlPointer, setHideIntlPointer] = useState(false)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    setGgbLoaded(true)
    ggbApi.current = api

    api?.registerClientListener((e: any) => {
      setHidePointer(true)
      setShowText(true)
    })
  }, [])

  const onSliderChange = (_: number, ratio: number) => {
    setHideIntlPointer(true)
    if (ggbApi.current) ggbApi.current.setValue('trans', 6 * ratio)
    if (ratio === 1) {
      setCopyEnd(true)
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#D1F7FF',
        id: '48_04_GE',
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

      {ggbLoaded && copyEnd && !hidePointer ? (
        <TickAnimation src={RotationAnimation} autoplay loop />
      ) : null}
      <StyledGeogebra materialId="wnagjpsu" onApiReady={onGGBLoaded} disable={!copyEnd} />
      {showText ? (
        <TextHolder>
          <div
            style={{
              color: '#646464',
              fontFamily: 'Nunito',
              fontSize: '20px',
              fontWeight: '700',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div>
              <ColoredSpan color=" #2AD3F5">m{<Latex>{String.raw`\angle`}</Latex>}A</ColoredSpan> =
              180° -{' '}
              <ColoredSpan color="#F57A7A">m{<Latex>{String.raw`\angle`}</Latex>}B</ColoredSpan>
            </div>
            <div>
              <ColoredSpan color=" #2AD3F5">{<Latex>{String.raw`\angle`}</Latex>}A</ColoredSpan> is
              the suppliment of{' '}
              <ColoredSpan color="#F57A7A">{<Latex>{String.raw`\angle`}</Latex>}B</ColoredSpan>
            </div>
          </div>
        </TextHolder>
      ) : null}
      {ggbLoaded ? (
        <>
          <LabelText>
            Move
            <br />
            angle
          </LabelText>
          <SliderContainer>
            {ggbLoaded && !hideIntlPointer ? <HandIntlAnim src={HandRight} autoplay loop /> : null}
            <PrimaryRangeSlider
              min={0}
              max={100}
              vertical={true}
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
