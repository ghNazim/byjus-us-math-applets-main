import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { Header, TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import handPointer from '../../common/handAnimations/moveAllDirections.json'
import movePointer from './assets/movePointer.mp3'
import muteBtn from './assets/muteBtn.svg'
import negative from './assets/negative.mp3'
import negativePositive from './assets/negativePositive.mp3'
import positive from './assets/positive.mp3'
import positiveNegative from './assets/positiveNegative.mp3'
import unmuteBtn from './assets/unmuteBtn.svg'
const HelperText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 75px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const ColouredSpan = styled.span<{ bgColor: string; color: string }>`
  padding: 0 3px;
  background: ${(p) => p.bgColor};
  color: ${(p) => p.color};
  border-radius: 5px;
`
const GGBContainer = styled.div`
  width: 630px;
  height: 598px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 80px;
`
const Coordinates = styled.div<{ top: number; left: number }>`
  width: fit-content;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #1a1a1a;
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  background-color: #f3f7fe;
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: 97px;
  top: 188px;
  pointer-events: none;
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
const TextHead = styled.p`
  color: #1a1a1a;
  font-family: 'Nunito';
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  line-height: 28px;
  max-width: 600px;
  min-height: 40px;
  text-align: center !important;
`
const TextBold = styled.span`
  font-family: 'Brioso Pro';
  font-weight: 700;
  font-style: italic;
`
export const AppletG06NSC09S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [xCoord, setXCoord] = useState(0)
  const [yCoord, setYCoord] = useState(0)
  const { position: Coords } = useGGBLocatePoint('I', ggbApi.current)
  const [displayCoords, setDisplayCoords] = useState(false)
  const [displayAnim, setDisplayAnim] = useState(false)
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')
  const interaction = useContext(AnalyticsContext)
  const [helper, setHelper] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlay, setAudioPlay] = useState(true)
  const checkPlay = {
    onplay: () => {
      setIsPlaying(true)
    },
    onend: () => {
      setIsPlaying(false)
    },
  }
  const [playMovePointer, stopMovePointer] = useSound(movePointer, checkPlay)
  const [playNegative, stopNegative] = useSound(negative, checkPlay)
  const [playPositive, stopPositive] = useSound(positive, checkPlay)
  const [playPositiveNegative, stopPositiveNegative] = useSound(positiveNegative, checkPlay)
  const [playNegativePositive, stopNegativePositive] = useSound(negativePositive, checkPlay)
  useEffect(() => {
    stopMovePointer.stop()
    stopNegative.stop()
    stopPositive.stop()
    stopPositiveNegative.stop()
    stopNegativePositive.stop()
    if (audioPlay) {
      switch (helper) {
        case 0:
          playMovePointer()
          break
        case 1:
          playPositive()
          break
        case 2:
          playNegativePositive()
          break
        case 3:
          playNegative()
          break
        case 4:
          playPositiveNegative()
          break
      }
    } else {
      setIsPlaying(false)
    }
  }, [audioPlay, helper, playMovePointer])
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setDisplayAnim(true)
      ggbApi.current.registerObjectUpdateListener('M1', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getVisible('M1')) {
          setXCoord(ggbApi.current.getXcoord('M1'))
          setYCoord(ggbApi.current.getYcoord('M1'))
        }
      })
      ggbApi.current.registerObjectUpdateListener('M2', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getVisible('M2')) {
          setXCoord(ggbApi.current.getXcoord('M2'))
          setYCoord(ggbApi.current.getYcoord('M2'))
        }
      })
      ggbApi.current.registerObjectUpdateListener('M3', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getVisible('M3')) {
          setXCoord(ggbApi.current.getXcoord('M3'))
          setYCoord(ggbApi.current.getYcoord('M3'))
        }
      })
      ggbApi.current.registerObjectUpdateListener('M4', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getVisible('M4')) {
          setXCoord(ggbApi.current.getXcoord('M4'))
          setYCoord(ggbApi.current.getYcoord('M4'))
        }
      })
      ggbApi.current.registerObjectUpdateListener('M5', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getVisible('M5')) {
          setXCoord(ggbApi.current.getXcoord('M5'))
          setYCoord(ggbApi.current.getYcoord('M5'))
        }
      })
      ggbApi.current.registerObjectUpdateListener('M6', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getVisible('M6')) {
          setXCoord(ggbApi.current.getXcoord('M6'))
          setYCoord(ggbApi.current.getYcoord('M6'))
        }
      })
      ggbApi.current.registerObjectUpdateListener('M7', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getVisible('M7')) {
          setXCoord(ggbApi.current.getXcoord('M7'))
          setYCoord(ggbApi.current.getYcoord('M7'))
        }
      })
      ggbApi.current.registerObjectUpdateListener('M8', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getVisible('M8')) {
          setXCoord(ggbApi.current.getXcoord('M8'))
          setYCoord(ggbApi.current.getYcoord('M8'))
        }
      })
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == 'I') {
          setDisplayAnim(false)
          setDisplayCoords(false)
          playDragStart()
          interaction('drag')
        }
        if (event[0] == 'dragEnd' && event[1] == 'I') {
          setDisplayCoords(true)
          playDragEnd()
          interaction('drop')
        }
      })
    },
    [ggbApi],
  )
  useEffect(() => {
    if (xCoord == 0 && yCoord == 0) {
      setHelper(0)
    } else if (xCoord > 0 && yCoord > 0) {
      setHelper(1)
    } else if (xCoord < 0 && yCoord > 0) {
      setHelper(2)
    } else if (xCoord < 0 && yCoord < 0) {
      setHelper(3)
    } else if (xCoord > 0 && yCoord < 0) {
      setHelper(4)
    } else if (xCoord == 0) {
      setHelper(5)
    } else if (yCoord == 0) {
      setHelper(6)
    }
  }, [xCoord, yCoord])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc09-s1-gb05',
        onEvent,
        className,
      }}
    >
      <Header backgroundColor="#F6F6F6" buttonColor="#1A1A1A">
        <TextHead>
          {'Explore how change in position affect the '}
          <TextBold>{'(x,y)'}</TextBold>
          {' values of a point.'}
        </TextHead>
      </Header>
      <GGBContainer>
        <Geogebra materialId="mqyc8zjd" onApiReady={onGGBHandle} />
        {displayCoords && (
          <Coordinates
            left={
              xCoord == 0
                ? Coords.left + 40
                : yCoord == 0
                ? Coords.left - 25
                : xCoord > 0
                ? Coords.left - 15
                : Coords.left - 55
            }
            top={
              xCoord == 0 && yCoord > 0
                ? Coords.top + 20
                : xCoord == 0 && yCoord < 0
                ? Coords.top - 40
                : yCoord == 0
                ? Coords.top - 50
                : yCoord > 0
                ? Coords.top + 25
                : yCoord >= -1
                ? Coords.top - 50
                : Coords.top - 55
            }
          >
            {xCoord !== 0 && yCoord !== 0 && (
              <>
                {'('}
                <ColouredSpan bgColor="none" color={xCoord > 0 ? '#32A66C' : '#ED6B90'}>
                  {xCoord}
                </ColouredSpan>
                {','}
                <ColouredSpan bgColor="none" color={yCoord > 0 ? '#32A66C' : '#ED6B90'}>
                  {yCoord}
                </ColouredSpan>
                {')'}
              </>
            )}
            {(xCoord == 0 || yCoord == 0) && xCoord != yCoord && (
              <>{'(' + xCoord + ',' + yCoord + ')'}</>
            )}
          </Coordinates>
        )}
      </GGBContainer>
      {displayAnim && <HandPlayer src={handPointer} autoplay loop />}
      <HelperText>
        <SpeakerDiv>
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
        </SpeakerDiv>
        {helper == 0 && <Text>{'Move the pointer to observe (x,y) value.'}</Text>}
        {helper == 1 && (
          <Text>
            {'Both x and y coordinates are '}
            <ColouredSpan bgColor="#E5FFEC" color="#32A66C">
              {'positive'}
            </ColouredSpan>
            {'.'}
          </Text>
        )}
        {helper == 2 && (
          <Text>
            {'The x-coordinate is '}
            <ColouredSpan bgColor="#FFECF2" color="#ED6B90">
              {'negative'}
            </ColouredSpan>
            {' and the y-coordinate is '}
            <ColouredSpan bgColor="#E5FFEC" color="#32A66C">
              {'positive'}
            </ColouredSpan>
            {'.'}
          </Text>
        )}
        {helper == 3 && (
          <Text>
            {'Both x and y coordinates are '}
            <ColouredSpan bgColor="#FFECF2" color="#ED6B90">
              {'negative'}
            </ColouredSpan>
            {'.'}
          </Text>
        )}
        {helper == 4 && (
          <Text>
            {'The x-coordinate is '}
            <ColouredSpan bgColor="#E5FFEC" color="#32A66C">
              {'positive'}
            </ColouredSpan>
            {' and the y-coordinate is '}{' '}
            <ColouredSpan bgColor="#FFECF2" color="#ED6B90">
              {'negative'}
            </ColouredSpan>
            {'.'}
          </Text>
        )}
        {helper == 5 && <Text>{'The point is on the y-axis.'}</Text>}
        {helper == 6 && <Text>{'The point is on the x-axis.'}</Text>}
      </HelperText>
    </AppletContainer>
  )
}
interface Position {
  left: number
  top: number
}
function useGGBLocatePoint(pointName: string, api: GeogebraAppApi | null, activeTracking = true) {
  const [position, setPosition] = useState<Position>({ left: 0, top: 0 })
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  ggbApi.current = api
  const locatePoint = (ggbApi: GeogebraAppApi, pointName: string) => {
    const pointX = ggbApi.getValue(`x(${pointName})`)
    const pointY = ggbApi.getValue(`y(${pointName})`)
    const cornor1X = ggbApi.getValue('x(Corner(1))')
    const cornor1Y = ggbApi.getValue('y(Corner(1))')
    const cornor2X = ggbApi.getValue('x(Corner(2))')
    const cornor4Y = ggbApi.getValue('y(Corner(4))')
    const heightInPixel = ggbApi.getValue('y(Corner(5))')
    const widthInPixel = ggbApi.getValue('x(Corner(5))')
    return { pointX, cornor1X, cornor2X, widthInPixel, heightInPixel, pointY, cornor1Y, cornor4Y }
  }
  useEffect(() => {
    if (!ggbApi.current) return
    const { pointX, cornor1X, cornor2X, widthInPixel, heightInPixel, pointY, cornor1Y, cornor4Y } =
      locatePoint(ggbApi.current, pointName)
    setPosition({
      left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
      top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
    })
  }, [pointName, ggbApi.current])
  const listener = useCallback(() => {
    if (!ggbApi.current) return
    ggbApi.current.registerObjectUpdateListener(`${pointName}`, () => {
      if (!ggbApi.current) return
      const {
        pointX,
        cornor1X,
        cornor2X,
        widthInPixel,
        heightInPixel,
        pointY,
        cornor1Y,
        cornor4Y,
      } = locatePoint(ggbApi.current, pointName)
      setPosition({
        left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
        top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
      })
    })
  }, [ggbApi, pointName])
  if (activeTracking) listener()
  return { position }
}
