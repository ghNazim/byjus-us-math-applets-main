import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { click, moveHorizontally, rotateBothSides } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import muteBtn from './assets/muteBtn.svg'
import unmuteBtn from './assets/unmuteBtn.svg'

const Ggb = styled(Geogebra)`
  position: absolute;
  top: 100px;
  left: 50%;
  translate: -50%;
`
const HelperText = styled.div<{ bottom: number; height: number }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: ${(p) => p.bottom}px;
  width: 700px;
  height: ${(p) => p.height}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  background-color: #fff;
`

const SpeakerDiv = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`
const SpeakerButton = styled.img`
  cursor: pointer;
  z-index: 1;
`
const RippleContainer = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  left: -50%;
`
const ripple = keyframes`
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`
const Ripple = styled.span`
  position: absolute;
  width: 50px;
  height: 50px;
  opacity: 0;
  border-radius: 50px;
  animation: ${ripple} 1s infinite;
  background-color: #000000;
  :nth-child(2) {
    animation-delay: 0.5s;
  }
`
const Text = styled.div`
  margin-left: 10px;
`
const Patch = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  bottom: 40px;
  background-color: #fff;
  left: 20px;
`
const PlacedPlayer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
`
const RotatedPlayer = styled(Player)<{ top: number; left: number; angle: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
  transform-origin: 50% 35%;
  transform: rotate(-${(p) => p.angle}rad);
`

export const AppletG07GMC02S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [frame, setFrame] = useState(1)
  const [sideA, setSideA] = useState(0)
  const [sideB, setSideB] = useState(0)
  const [sideC, setSideC] = useState(0)
  const [showMoveHorizontal, setShowMoveHorizontal] = useState(false)
  const [showMovePointer, setShowMovePointer] = useState(false)
  const [showClick, setShowClick] = useState(true)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playClick = useSFX('mouseClick')
  const interaction = useContext(AnalyticsContext)
  const [pointer, setPointer] = useState({ left: 0, top: 0 })
  // const [isPlaying, setIsPlaying] = useState(false)
  // const [audioPlay, setAudioPlay] = useState(true)
  // const checkPlay = {
  //   onplay: () => {
  //     setIsPlaying(true)
  //   },
  //   onend: () => {
  //     setIsPlaying(false)
  //   },
  // }
  //  useEffect(() => {
  //   if (audioPlay) {
  //     switch (frame) {
  //     }
  //   } else {
  //     setIsPlaying(false)
  //   }
  // }, [audioPlay, frame])
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (!api) return
      ggbApi.current = api
      setGGBLoaded(api !== null)
      ggbApi.current.registerClientListener((e) => {
        if (!ggbApi.current) return
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'E' ||
            e.hits[0] === 'Cr' ||
            e.hits[0] === 'Cr2' ||
            e.hits[0] === 'E2' ||
            e.hits[0] === 'E3')
        ) {
          playMouseIn()
          interaction('drag')
          setShowMoveHorizontal(false)
          setShowMovePointer(false)
        } else if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'start' ||
            e.hits[0] === 'next' ||
            e.hits[0] === 'pic18' ||
            e.hits[0] === 'pic2')
        ) {
          playClick()
          interaction('next')
        } else if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'len2' || e.hits[0] === 'len3' || e.hits[0] === 'len4')
        ) {
          playClick()
          interaction('tap')
          setShowClick(false)
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'E' ||
            e.target === 'Cr' ||
            e.target === 'Cr2' ||
            e.target === 'E2' ||
            e.target === 'E3')
        ) {
          playMouseOut()
          interaction('drop')
        }
        if (e.type === 'mouseDown' && e.hits[0] === 'pic18') {
          setShowClick(true)
        }
      })
      ggbApi.current.registerObjectUpdateListener('frame', () => {
        if (!ggbApi.current) return
        setFrame(ggbApi.current.getValue('frame'))
      })
      ggbApi.current.registerObjectUpdateListener('a', () => {
        if (!ggbApi.current) return
        setSideA(ggbApi.current.getValue('a'))
      })
      ggbApi.current.registerObjectUpdateListener('b', () => {
        if (!ggbApi.current) return
        setSideB(ggbApi.current.getValue('b'))
      })
      ggbApi.current.registerObjectUpdateListener('c', () => {
        if (!ggbApi.current) return
        setSideC(ggbApi.current.getValue('c'))
      })
    },
    [ggbApi],
  )
  const angle =
    frame == 13
      ? ggbApi.current?.getValue('Angle(B,A,C)') || 0
      : frame == 15
      ? ggbApi.current?.getValue('Angle(B+(3,0),B,C)') || 0
      : 0
  useEffect(() => {
    const api = ggbApi.current
    switch (frame) {
      case 3:
        setShowMoveHorizontal(true)
        if (api) setPointer(locatePoint2d('E', api))
        break
      case 6:
        setShowMoveHorizontal(true)
        if (api) setPointer(locatePoint2d('Cr', api))
        break
      case 10:
        setShowMoveHorizontal(true)
        if (api) setPointer(locatePoint2d('Cr2', api))
        break
      case 13:
        setShowMoveHorizontal(true)
        if (api) setPointer(locatePoint2d('E2', api))
        break
      case 15:
        setShowMoveHorizontal(true)
        if (api) setPointer(locatePoint2d('E3', api))
        break
    }
  }, [frame])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc02-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Construct a triangle with sides of lengths 2 cm, 3 cm, and 4 cm."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <Ggb materialId="xwa64398" onApiReady={onGGBHandle} />
      <Patch />
      <HelperText
        bottom={frame == 2 || frame == 5 ? 200 : frame == 16 ? 130 : 165}
        height={frame == 16 ? 120 : 60}
      >
        {/* <SpeakerDiv>
          {isPlaying && (
            <RippleContainer>
              <Ripple />
              <Ripple />
            </RippleContainer>
          )}
          <SpeakerButton
            src={audioPlay ? muteBtn : unmuteBtn}
            onClick={() => {
              setAudioPlay((d) => !d)
            }}
          />
        </SpeakerDiv> */}
        {ggbLoaded && frame == 1 && (
          <Text>{'Follow the steps given for construction of the triangle.'}</Text>
        )}
        {frame == 2 && <Text>{'Choose any of the given side lengths as a base.'}</Text>}
        {frame == 3 && <Text>{'Draw the base of length ' + sideA + ' cm.'}</Text>}
        {(frame == 4 || frame == 8 || frame == 12 || frame == 14) && (
          <Text>{'Now, let’s proceed to the next step.'}</Text>
        )}
        {frame == 5 && <Text>{'Choose the length of the side originating from point A.'}</Text>}
        {frame == 6 && (
          <Text>{'Extend the compass arm to measure a length of ' + sideB + ' cm.'}</Text>
        )}
        {frame == 7 && <Text>{'Good job, let’s draw the circle.'}</Text>}
        {frame == 9 && (
          <Text>{'Length of the remaining side of the triangle is ' + sideC + ' cm.'}</Text>
        )}
        {frame == 10 && (
          <Text>{'Extend the compass arm to measure a length of ' + sideC + ' cm.'}</Text>
        )}
        {frame == 11 && <Text>{'Well done, let’s draw the circle.'}</Text>}
        {frame == 13 && (
          <Text>{'Join the points A and C to draw the side AC of length ' + sideB + ' cm.'}</Text>
        )}
        {frame == 15 && (
          <Text>{'Join the points C and B to draw the side CB of length ' + sideC + ' cm.'}</Text>
        )}
        {frame == 16 && (
          <Text>
            {'Great! You constructed a triangle with sides of lengths ' +
              sideA +
              ', ' +
              sideB +
              ', and ' +
              sideC +
              ' cm.'}
          </Text>
        )}
      </HelperText>

      {showMoveHorizontal && frame < 13 && (
        <PlacedPlayer
          src={moveHorizontally}
          top={pointer.top + 50}
          left={pointer.left - 170}
          autoplay
          loop
        />
      )}
      {showMoveHorizontal && frame >= 13 && (
        <RotatedPlayer
          angle={angle}
          src={moveHorizontally}
          top={pointer.top + 50}
          left={pointer.left - 170}
          autoplay
          loop
        />
      )}
      {showMovePointer && (
        <PlacedPlayer
          src={rotateBothSides}
          top={pointer.top + 80}
          left={pointer.left - 170}
          autoplay
          loop
        />
      )}
      {ggbLoaded && showClick && frame == 1 && (
        <PlacedPlayer src={click} top={680} left={300} autoplay loop />
      )}
      {frame == 2 && showClick && <PlacedPlayer src={click} top={575} left={145} autoplay loop />}
    </AppletContainer>
  )
}
function locatePoint2d(pointName: string, ggbApi: GeogebraAppApi, xOffset = 0) {
  const pointX = ggbApi.getValue(`x(${pointName})`) + xOffset
  const pointY = ggbApi.getValue(`y(${pointName})`)
  const cornor1X = ggbApi.getValue('x(Corner(1))')
  const cornor1Y = ggbApi.getValue('y(Corner(1))')
  const cornor2X = ggbApi.getValue('x(Corner(2))')
  const cornor4Y = ggbApi.getValue('y(Corner(4))')
  const heightInPixel = ggbApi.getValue('y(Corner(5))')
  const widthInPixel = ggbApi.getValue('x(Corner(5))')

  return {
    left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
    top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
  }
}
