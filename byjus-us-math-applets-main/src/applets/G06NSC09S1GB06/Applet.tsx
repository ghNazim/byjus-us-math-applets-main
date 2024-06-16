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

import handClick from '../../common/handAnimations/click.json'
import handMove from '../../common/handAnimations/moveAllDirections.json'
import firstQuad from './assets/first_quadrant.mp3'
import fourthQuad from './assets/fourth_quadrant.mp3'
import greatJob from './assets/great_job.mp3'
import letsVisualize from './assets/lets_visualize.mp3'
import movePoint from './assets/move_point.mp3'
import muteBtn from './assets/muteBtn.svg'
import note from './assets/note.svg'
import plotQuadrant from './assets/plot_quadrant.mp3'
import questionMark from './assets/questionMark.svg'
import reset from './assets/reset.svg'
import secondQuad from './assets/second_quadrant.mp3'
import thirdQuad from './assets/third_quadrant.mp3'
import unmuteBtn from './assets/unmuteBtn.svg'
import visualize from './assets/visualize.svg'
import visualizeRemaining from './assets/visualize_remaining.mp3'
import xAxis from './assets/x_axis.mp3'
import yAxis from './assets/y_axis.mp3'
const ButtonElement = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  background: #1a1a1a;
  border-radius: 10px;
  height: 60px;
  cursor: pointer;
  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`
const GridContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 120px;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto auto auto auto;
`
const GridItem = styled.div<{ colorTheme: string; height: number; bdrRadius: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  width: 220px;
  height: ${(p) => p.height}px;
  background: ${(p) =>
    p.colorTheme == 'green' ? '#E5FFEC' : p.colorTheme == 'red' ? '#FFECF2' : '#ffffff'};
  color: ${(p) =>
    p.colorTheme == 'green'
      ? '#32A66C'
      : p.colorTheme == 'red'
      ? '#ED6B90'
      : p.colorTheme == 'filled'
      ? '#B3B1B1'
      : '#444444'};
  border: 1px solid #f4e5ff;
  border-radius: ${(p) => p.bdrRadius};
`
const FeedbackText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  width: 700px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 460px;
  color: #444444;
`
const HelperText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  width: 700px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 616px;
  color: #444444;
`
const ColoredSpan = styled.span<{ bgColor: string; color: string }>`
  padding: 0 3px;
  background: ${(p) => p.bgColor};
  color: ${(p) => p.color};
  border-radius: 5px;
`
const GGBContainer = styled.div<{ visibility: boolean }>`
  width: 630px;
  height: 598px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 80px;
  ${(p) => !p.visibility && 'visibility:hidden;'}
`
const Coordinates = styled.div<{ top: number; left: number }>`
  width: 78px;
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
`
const ClickPlayer = styled(Player)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 700px;
  pointer-events: none;
`
const MovePlayer = styled(Player)`
  position: absolute;
  left: 72px;
  top: 100px;
  pointer-events: none;
`
const OneHil = styled.div`
  position: absolute;
  left: 93%;
  top: -15px;
  width: 27px;
  height: 27px;
  background: #e7fbff;
  border: 1px solid #1cb9d9;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 27px;
  color: #1cb9d9;
  border-radius: 50%;
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
export const AppletG06NSC09S1GB06: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [firstQuadrant, setFirstQuadrant] = useState(false)
  const [secondQuadrant, setSecondQuadrant] = useState(false)
  const [thirdQuadrant, setThirdQuadrant] = useState(false)
  const [fourthQuadrant, setFourthQuadrant] = useState(false)
  const [currentQuadrant, setCurrentQuadrant] = useState(0)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [xCoord, setXCoord] = useState(0)
  const [yCoord, setYCoord] = useState(0)
  const { position: Coords } = useGGBLocatePoint('I', ggbApi.current)
  const [displayCoords, setDisplayCoords] = useState(false)
  const [showHandMove, setShowHandMove] = useState(true)
  const [showHandClick, setShowHandClick] = useState(true)
  const playClick = useSFX('mouseClick')
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')
  const interaction = useContext(AnalyticsContext)
  const [feedback, setFeedback] = useState(0)
  const [helper, setHelper] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlay, setAudioPlay] = useState(true)
  const checkPlay = {
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
  }
  const [playFirstQuadrant, stopFirstQuadrant] = useSound(firstQuad, checkPlay)
  const [playFourthQuadrant, stopFourthQuadrant] = useSound(fourthQuad, checkPlay)
  const [playGreatJob, stopGreatJob] = useSound(greatJob, checkPlay)
  const [playMovePoint, stopMovePoint] = useSound(movePoint, checkPlay)
  const [playPlotQuadrant, stopPlotQuadrant] = useSound(plotQuadrant, checkPlay)
  const [playSecondQuadrant, stopSecondQuadrant] = useSound(secondQuad, checkPlay)
  const [playThirdQuadrant, stopThirdQuadrant] = useSound(thirdQuad, checkPlay)
  const [playVisualizeRemaining, stopVisualizeRemaining] = useSound(visualizeRemaining, checkPlay)
  const [playXAxis, stopXAxis] = useSound(xAxis, checkPlay)
  const [playYAxis, stopYAxis] = useSound(yAxis, checkPlay)
  const [playLetsVisualize, stopLetsVisualize] = useSound(letsVisualize, checkPlay)

  useEffect(() => {
    setIsPlaying(false)
    stopFirstQuadrant.stop()
    stopFourthQuadrant.stop()
    stopGreatJob.stop()
    stopMovePoint.stop()
    stopPlotQuadrant.stop()
    stopSecondQuadrant.stop()
    stopThirdQuadrant.stop()
    stopVisualizeRemaining.stop()
    stopXAxis.stop()
    stopYAxis.stop()
    stopLetsVisualize.stop()
    if (audioPlay) {
      if (pageNum == 0) {
        switch (feedback) {
          case 0:
            playLetsVisualize()
            break
          case 1:
            playVisualizeRemaining()
            break
          case 2:
            playGreatJob()
            break
        }
      } else if (pageNum == 1) {
        switch (helper) {
          case 0:
            playPlotQuadrant()
            break
          case 1:
            playMovePoint()
            break
          case 2:
            playXAxis()
            break
          case 3:
            playYAxis()
            break
          case 4:
            playFirstQuadrant()
            break
          case 5:
            playSecondQuadrant()
            break
          case 6:
            playThirdQuadrant()
            break
          case 7:
            playFourthQuadrant()
            break
        }
      }
    }
  }, [pageNum, helper, feedback, audioPlay, playLetsVisualize])

  useEffect(() => {
    if (!firstQuadrant && !secondQuadrant && !thirdQuadrant && !fourthQuadrant) {
      setFeedback(0)
    } else if (!firstQuadrant || !secondQuadrant || !thirdQuadrant || !fourthQuadrant) {
      setFeedback(1)
    } else {
      setFeedback(2)
    }
  }, [firstQuadrant, secondQuadrant, thirdQuadrant, fourthQuadrant])
  useEffect(() => {
    if (xCoord == 0 && yCoord == 0) {
      if (!firstQuadrant && !secondQuadrant && !thirdQuadrant && !fourthQuadrant) {
        setHelper(0)
      } else setHelper(1)
    } else if (yCoord == 0 && xCoord !== 0) {
      setHelper(2)
    } else if (xCoord == 0 && yCoord !== 0) {
      setHelper(3)
    } else if (xCoord > 0 && yCoord > 0) {
      setHelper(4)
    } else if (xCoord < 0 && yCoord > 0) {
      setHelper(5)
    } else if (xCoord < 0 && yCoord < 0) {
      setHelper(6)
    } else if (xCoord > 0 && yCoord < 0) {
      setHelper(7)
    }
  }, [xCoord, yCoord])

  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
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
          setShowHandMove(false)
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
  const onNextHandle = () => {
    playClick()
    interaction('next')
    switch (pageNum) {
      case 0:
        if (firstQuadrant && secondQuadrant && thirdQuadrant && fourthQuadrant) {
          setFirstQuadrant(false)
          setSecondQuadrant(false)
          setThirdQuadrant(false)
          setFourthQuadrant(false)
        } else {
          if (ggbApi.current == null) return
          setShowHandClick(false)
          ggbApi.current.evalCommand('RunClickScript(button1)')
          setPageNum(1)
        }
        setXCoord(0)
        setYCoord(0)
        setCurrentQuadrant(0)
        break
      case 1:
        if (xCoord > 0 && yCoord > 0) {
          setFirstQuadrant(true)
          setCurrentQuadrant(1)
        } else if (xCoord < 0 && yCoord > 0) {
          setSecondQuadrant(true)
          setCurrentQuadrant(2)
        } else if (xCoord < 0 && yCoord < 0) {
          setThirdQuadrant(true)
          setCurrentQuadrant(3)
        } else if (xCoord > 0 && yCoord < 0) {
          setFourthQuadrant(true)
          setCurrentQuadrant(4)
        }
        setPageNum(0)
        break
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc09-s1-gb06',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore the relation between the (x,y) coordinate and the quadrants."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <Header backgroundColor="#F6F6F6" buttonColor="#1A1A1A">
        <TextHead>
          {'Explore the relation between the '}
          <TextBold>{'(x,y)'}</TextBold>
          {' coordinate and the quadrants.'}
        </TextHead>
      </Header>
      {pageNum == 0 && (
        <>
          <GridContainer>
            <GridItem height={80} bdrRadius="8px 0px 0px 0px" colorTheme={''}>
              Quadrant
            </GridItem>
            <GridItem height={80} bdrRadius="0px" colorTheme={''}>
              x-coordinate
            </GridItem>
            <GridItem height={80} bdrRadius="0px 8px 0px 0px" colorTheme={''}>
              y-coordinate
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              Quadrant I
            </GridItem>
            <GridItem
              height={60}
              bdrRadius="0px"
              colorTheme={currentQuadrant == 1 ? 'green' : firstQuadrant ? 'filled' : ''}
            >
              {firstQuadrant ? 'Positive' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              height={60}
              bdrRadius="0px"
              colorTheme={currentQuadrant == 1 ? 'green' : firstQuadrant ? 'filled' : ''}
            >
              {firstQuadrant ? 'Positive' : <img src={questionMark} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              Quadrant II
            </GridItem>
            <GridItem
              height={60}
              bdrRadius="0px"
              colorTheme={currentQuadrant == 2 ? 'red' : secondQuadrant ? 'filled' : ''}
            >
              {secondQuadrant ? 'Negative' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              height={60}
              bdrRadius="0px"
              colorTheme={currentQuadrant == 2 ? 'green' : secondQuadrant ? 'filled' : ''}
            >
              {secondQuadrant ? 'Positive' : <img src={questionMark} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px" colorTheme={''}>
              Quadrant III
            </GridItem>
            <GridItem
              height={60}
              bdrRadius="0px"
              colorTheme={currentQuadrant == 3 ? 'red' : thirdQuadrant ? 'filled' : ''}
            >
              {thirdQuadrant ? 'Negative' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              height={60}
              bdrRadius="0px"
              colorTheme={currentQuadrant == 3 ? 'red' : thirdQuadrant ? 'filled' : ''}
            >
              {thirdQuadrant ? 'Negative' : <img src={questionMark} />}
            </GridItem>
            <GridItem height={60} bdrRadius="0px 0px 0px 8px" colorTheme={''}>
              Quadrant IV
            </GridItem>
            <GridItem
              height={60}
              bdrRadius="0px"
              colorTheme={currentQuadrant == 4 ? 'green' : fourthQuadrant ? 'filled' : ''}
            >
              {fourthQuadrant ? 'Positive' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              height={60}
              bdrRadius="0px 0px 8px 0px"
              colorTheme={currentQuadrant == 4 ? 'red' : fourthQuadrant ? 'filled' : ''}
            >
              {fourthQuadrant ? 'Negative' : <img src={questionMark} />}
            </GridItem>
          </GridContainer>
          <FeedbackText>
            {feedback >= 0 && (
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
            )}
            <Text>
              {feedback == 0 && 'Let’s visualize the relation in the coordinate plane.'}
              {feedback == 1 && 'Visualize the remaining relations in the coordinate plane.'}
              {feedback == 2 && (
                <>
                  {'Great job exploring the relationship!'}
                  <br />
                  {'Reset to visualize it again.'}
                </>
              )}
            </Text>
          </FeedbackText>
        </>
      )}

      <GGBContainer visibility={pageNum == 1 ? true : false}>
        <Geogebra materialId="p8hmgmrc" onApiReady={onGGBHandle} />
        {displayCoords && (
          <Coordinates
            left={
              xCoord > 0
                ? yCoord == 0
                  ? Coords.left - 50
                  : Coords.left - 15
                : xCoord == 0
                ? Coords.left + 15
                : yCoord == 0
                ? Coords.left
                : Coords.left - 55
            }
            top={yCoord > 0 ? Coords.top + 25 : yCoord >= -1 ? Coords.top - 50 : Coords.top - 55}
          >
            {xCoord !== 0 && yCoord !== 0 && (
              <>
                {'('}
                <ColoredSpan bgColor="none" color={xCoord > 0 ? '#32A66C' : '#ED6B90'}>
                  {xCoord}
                </ColoredSpan>
                {','}
                <ColoredSpan bgColor="none" color={yCoord > 0 ? '#32A66C' : '#ED6B90'}>
                  {yCoord}
                </ColoredSpan>
                {')'}
              </>
            )}
            {((xCoord == 0 && yCoord !== 0) || (xCoord !== 0 && yCoord == 0)) && (
              <>{'(' + xCoord + ',' + yCoord + ')'}</>
            )}
          </Coordinates>
        )}
        {showHandMove && <MovePlayer src={handMove} autoplay loop />}
      </GGBContainer>
      {pageNum == 1 && (
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
          {helper == 0 && (
            <Text>
              {'Plot  '}
              <ColoredSpan bgColor="#FFF2E5" color="#FF8F1F">
                the point
              </ColoredSpan>
              {' and know the '}
              <ColoredSpan bgColor="#F5FDFF" color="#1CB9D9">
                Quadrant
              </ColoredSpan>
              {'.'}
            </Text>
          )}

          {helper == 1 && (
            <Text>{'Move the point to explore how it relates to the coordinate plane.'}</Text>
          )}
          {helper == 2 && (
            <Text>
              {'This point lies on the '}
              <ColoredSpan bgColor="#FFF2E5" color="#FF8F1F">
                x-axis
              </ColoredSpan>
              {' and is not a part of any quadrant.'}
            </Text>
          )}
          {helper == 3 && (
            <Text>
              {'This point lies on the '}
              <ColoredSpan bgColor="#FAF2FF" color="#AA5EE0">
                y-axis
              </ColoredSpan>
              {' and is not a part of any quadrant.'}
            </Text>
          )}
          {helper == 4 && (
            <Text>
              {'Point is in the '}
              <ColoredSpan bgColor="#F5FDFF" color="#1CB9D9">
                First Quadrant
              </ColoredSpan>
              {'.'}
              <br />
              {'Both x and y coordinates are '}
              <ColoredSpan bgColor="#E5FFEC" color="#32A66C">
                positive
              </ColoredSpan>
              {'.'}
            </Text>
          )}
          {helper == 5 && (
            <Text>
              {'Point is in the '}
              <ColoredSpan bgColor="#F5FDFF" color="#1CB9D9">
                Second Quadrant
              </ColoredSpan>
              {'.'}
              <br />
              {'x-coordinate is '}
              <ColoredSpan bgColor="#FFECF2" color="#F57A7A">
                negative
              </ColoredSpan>
              {' and y-coordinate is '}
              <ColoredSpan bgColor="#E5FFEC" color="#32A66C">
                positive
              </ColoredSpan>
              {'.'}
            </Text>
          )}
          {helper == 6 && (
            <Text>
              {'Point is in the '}
              <ColoredSpan bgColor="#F5FDFF" color="#1CB9D9">
                Third Quadrant
              </ColoredSpan>
              {'.'}
              <br />
              {'Both x and y coordinates are '}
              <ColoredSpan bgColor="#FFECF2" color="#F57A7A">
                negative
              </ColoredSpan>
              {'.'}
            </Text>
          )}
          {helper == 7 && (
            <Text>
              {'Point is in the '}
              <ColoredSpan bgColor="#F5FDFF" color="#1CB9D9">
                Fourth Quadrant
              </ColoredSpan>
              {'.'}
              <br />
              {'x-coordinate is '}
              <ColoredSpan bgColor="#E5FFEC" color="#32A66C">
                positive
              </ColoredSpan>
              {' and y-coordinate is '}
              <ColoredSpan bgColor="#FFECF2" color="#F57A7A">
                negative
              </ColoredSpan>
              {'.'}
            </Text>
          )}
        </HelperText>
      )}
      <ButtonElement
        disabled={pageNum == 1 ? (xCoord == 0 || yCoord == 0 ? true : false) : false}
        onClick={onNextHandle}
      >
        {pageNum == 0 &&
          (!firstQuadrant || !secondQuadrant || !thirdQuadrant || !fourthQuadrant) && (
            <img src={visualize} />
          )}
        {pageNum == 1 && <img src={note} />}
        {pageNum == 0 && firstQuadrant && secondQuadrant && thirdQuadrant && fourthQuadrant && (
          <img src={reset} />
        )}
        {pageNum == 1 && xCoord !== 0 && yCoord !== 0 && <OneHil>1</OneHil>}
      </ButtonElement>
      {showHandClick && <ClickPlayer src={handClick} autoplay loop />}
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
