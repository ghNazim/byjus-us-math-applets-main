import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import handClick from '../../common/handAnimations/click.json'
import ddEnd from '../../common/handAnimations/dragAndDropEnd.json'
import ddHold from '../../common/handAnimations/dragAndDropHold.json'
import ddStart from '../../common/handAnimations/dragAndDropStart.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import videoFile from './Assets/47_05_GE-edi.json'
import triangleTrans1 from './Assets/tri-trans-1.svg'
import triangleTrans2 from './Assets/tri-trans-2.svg'
import triangleDrag1 from './Assets/triangle_1.svg'
import triangleDrag2 from './Assets/triangle_2.svg'
import { DragAndDrop } from './DndHelper/DragAndDrop'
const HandClickPlayer = styled(Player)`
  position: absolute;
  top: 695px;
  left: 322px;
  pointer-events: none;
`
const PlacedPlayer = styled(Player)<{ top: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: 50%;
  translate: -50%;
  width: 568px;
  height: 497px;
  scale: 1.18;
  transition: top 600ms;
`
const DnD1 = styled.div`
  position: absolute;
  top: 262px;
  left: 200px;
`
const DnD2 = styled.div`
  position: absolute;
  top: 373px;
  left: 310px;
`
const Texts = styled.div<{
  top: number
  delay: number
  display: boolean
  pos: number
  size: number
}>`
  position: absolute;
  width: 620px;
  height: 62px;
  left: 50%;
  translate: -50%;
  top: ${(props) => (props.display ? props.top : props.pos == 1 ? 580 : 630)}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: ${(props) => props.size}px;
  line-height: 28px;
  text-align: center;
  color: #646464;
  transition: top ${(props) => props.delay}ms;
  opacity: ${(props) => (props.display ? 1 : 0)};
`
const ColorText = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  & sup {
    font-size: 14px;
  }
`
const HandMovePlayer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  pointer-events: none;
`
const BlinkingImg = styled.img<{ top: number; left: number; opacity: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  opacity: ${(props) => props.opacity};
  pointer-events: none;
`

const frameEndPartitions = [2, 125, 140, 160, 220, 239]

const handAnimLoopSteps = [
  ddStart,
  ddStart,
  ddStart,
  ddStart,
  ddHold,
  ddHold,
  ddHold,
  ddHold,
  ddHold,
  ddHold,
  ddEnd,
  ddEnd,
  ddEnd,
  ddEnd,
  '',
]
const handAnimLoopTop = [341, 341, 341, 341, 341, 334, 327, 319, 311, 303, 295, 295, 295, 295, 341]
const handAnimLoopLeft = [165, 165, 165, 165, 165, 204, 243, 279, 321, 357, 398, 398, 398, 398, 165]
const handAnimLoopTop1 = [408, 408, 408, 408, 408, 370, 333, 296, 259, 222, 185, 185, 185, 185, 408]
const handAnimLoopLeft1 = [
  400, 400, 400, 400, 400, 382, 364, 348, 332, 316, 300, 300, 300, 300, 400,
]
export const Applet4705Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<Player>(null)
  const [animProgress, setAnimProgress] = useState(1)
  const [pageIndex, setPageIndex] = useState(0)
  const [progressControl, setProgressControl] = useState(0)
  const [componentControl, setComponentControl] = useState(0)
  const [playAnimation, setPlayAnimation] = useState(true)
  const [nextDisable, setNextDisable] = useState(false)
  const [showClickPointer, setShowClickPointer] = useState(true)
  const [showMovePointer, setShowMovePointer] = useState(false)
  const [handAnimLoopIndex, setHandAnimLoopIndex] = useState(0)
  const [opacity, setOpacity] = useState(0)

  const onPageChange = useCallback((current: number) => {
    setPageIndex(current)
  }, [])
  useInterval(
    () => {
      if (animProgress < frameEndPartitions[progressControl]) {
        setAnimProgress((p) => p + 1)
      } else {
        setPlayAnimation(false)
        switch (progressControl) {
          case 1:
            setNextDisable(false)
            break
          case 2:
            setComponentControl(1) //show dnd1
            setShowMovePointer(true)
            break
          case 3:
            setComponentControl(2) //show dnd2
            setShowMovePointer(true)
            break
          case 4:
            setComponentControl(3) //show Helper Text
            setNextDisable(false)
            break
          case 5:
            setComponentControl(4) //show Helper Text2
            break
        }
      }
    },
    playAnimation ? 80 : null,
  )
  useInterval(
    () => {
      if (componentControl == 4) {
        setComponentControl(5)
      }
    },
    pageIndex == 3 ? 1500 : null,
  )
  useEffect(() => {
    if (playerRef.current == null) return
    playerRef.current.setSeeker(animProgress)
  }, [animProgress])
  const onNextHandle = () => {
    switch (pageIndex) {
      case 0:
        setShowClickPointer(false)
        setNextDisable(true)
        setAnimProgress(1)
        setProgressControl(1)
        setPlayAnimation(true)
        break
      case 1:
        setAnimProgress(125)
        setNextDisable(true)
        setProgressControl(2)
        setPlayAnimation(true)
        setComponentControl(0)
        break
      case 2:
        setAnimProgress(220)
        setProgressControl(5)
        setPlayAnimation(true)
        setComponentControl(0)
        break
    }
  }
  const onBackHandle = () => {
    if (playerRef.current == null) return
    switch (pageIndex) {
      case 1:
        setPlayAnimation(false)
        setNextDisable(false)
        setComponentControl(0)
        playerRef.current.setSeeker(2)
        break
      case 2:
        setPlayAnimation(false)
        setComponentControl(0)
        setNextDisable(false)
        playerRef.current.setSeeker(125)
        setShowMovePointer(false)
        break
      case 3:
        setPlayAnimation(false)
        setComponentControl(3)
        setNextDisable(false)
        playerRef.current.setSeeker(220)
        break
    }
  }
  const onResetHandle = () => {
    if (playerRef.current == null) return
    setPlayAnimation(false)
    setNextDisable(false)
    setComponentControl(0)
    playerRef.current.setSeeker(2)
    setShowClickPointer(true)
  }

  useInterval(
    () => {
      setHandAnimLoopIndex((i) => (i >= 12 ? 0 : i + 1))
      setOpacity((i) => (i >= 0.5 ? 0 : i + 0.125))
    },
    showMovePointer ? 120 : null,
  )

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E7FBFF',
        id: '47_05_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Transform the two squares to form a larger square and derive the Pythagoras theorem."
        backgroundColor="#E7FBFF"
        buttonColor="#A6F0FF"
      />
      <PlacedPlayer src={videoFile} ref={playerRef} top={pageIndex == 3 ? 40 : 100} />
      {componentControl == 1 && (
        <DnD1>
          <DragAndDrop
            DraggableList={[triangleDrag1]}
            InitialState={{
              '0': false,
            }}
            DropZonePosition={[{ left: -27, top: -238 }]}
            onAllDragComplete={(e) => {
              if (e) {
                setComponentControl(0)
                setProgressControl(3)
                setPlayAnimation(true)
                setAnimProgress(142)
              }
            }}
            onSingleDragStart={(e) => {
              if (e) {
                setShowMovePointer(false)
                setAnimProgress(141)
              }
            }}
            onSnapToOrigin={() => {
              setAnimProgress(140)
            }}
            showDropHint={false}
          />
        </DnD1>
      )}

      {componentControl == 2 && (
        <DnD2>
          <DragAndDrop
            DraggableList={[triangleDrag2]}
            InitialState={{
              '0': false,
            }}
            DropZonePosition={[{ left: -362, top: -345 }]}
            onAllDragComplete={(e) => {
              if (e) {
                setComponentControl(0)
                setProgressControl(4)
                setPlayAnimation(true)
                setAnimProgress(162)
              }
            }}
            onSingleDragStart={(e) => {
              if (e) {
                setShowMovePointer(false)
                setAnimProgress(161)
              }
            }}
            onSnapToOrigin={() => {
              setAnimProgress(160)
            }}
            showDropHint={false}
          />
        </DnD2>
      )}
      <Texts top={580} delay={600} display={componentControl == 3} pos={2} size={20}>
        {"You formed a bigger square having side '"}
        <ColorText color={'#32A66C'}>{'c'}</ColorText>
        {"' and area "}
        <ColorText color={'#32A66C'}>
          {'c'}
          <sup>2</sup>
        </ColorText>
        {'.'}
      </Texts>
      <Texts
        top={510}
        delay={800}
        display={componentControl == 4 || componentControl == 5}
        pos={1}
        size={20}
      >
        {'Sum of the areas of the two smaller squares is equal to the area of the larger square.'}
      </Texts>
      <Texts top={590} delay={600} display={componentControl == 5} pos={2} size={28}>
        <ColorText color={'#32A66C'}>
          {'c'}
          <sup>2</sup>
        </ColorText>
        {' = '}
        <ColorText color={'#1CB9D9'}>
          {'a'}
          <sup>2</sup>
        </ColorText>
        {' + '}
        <ColorText color={'#CF8B04'}>
          {'b'}
          <sup>2</sup>
        </ColorText>
      </Texts>
      {showMovePointer && componentControl == 1 && (
        <BlinkingImg top={275} left={200} src={triangleTrans1} opacity={opacity}></BlinkingImg>
      )}
      {showMovePointer && componentControl == 2 && (
        <BlinkingImg top={386} left={310} src={triangleTrans2} opacity={opacity}></BlinkingImg>
      )}
      {showMovePointer && componentControl == 1 && (
        <HandMovePlayer
          top={handAnimLoopTop[handAnimLoopIndex]}
          left={handAnimLoopLeft[handAnimLoopIndex]}
          src={handAnimLoopSteps[handAnimLoopIndex]}
          autoplay
          loop
        />
      )}
      {showMovePointer && componentControl == 2 && (
        <HandMovePlayer
          top={handAnimLoopTop1[handAnimLoopIndex]}
          left={handAnimLoopLeft1[handAnimLoopIndex]}
          src={handAnimLoopSteps[handAnimLoopIndex]}
          autoplay
          loop
        />
      )}
      <PageControl
        total={4}
        onChange={onPageChange}
        onNext={onNextHandle}
        onBack={onBackHandle}
        nextDisabled={nextDisable}
        onReset={onResetHandle}
      />
      {showClickPointer && <HandClickPlayer src={handClick} autoplay loop />}
    </AppletContainer>
  )
}
