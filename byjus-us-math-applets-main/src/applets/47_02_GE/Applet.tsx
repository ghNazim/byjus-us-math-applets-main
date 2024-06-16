import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import handClick from '../../common/handAnimations/click.json'
import ddEnd from '../../common/handAnimations/dragAndDropEnd.json'
import ddHold from '../../common/handAnimations/dragAndDropHold.json'
import ddStart from '../../common/handAnimations/dragAndDropStart.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import videoFile from './Assets/47_02_GE-up.json'
import dottedTriangle from './Assets/dottedTriangle.png'
import triangleDrag1 from './Assets/triangleDrag1.svg'
import triangleDrag2 from './Assets/triangleDrag2.svg'
import triangleDrag3 from './Assets/triangleDrag3.svg'
import { DragAndDrop } from './DndHelper/DragAndDrop'
const PlacedPlayer = styled(Player)`
  position: absolute;
  top: 70px;
  left: 50%;
  translate: -50%;
  width: 568px;
  height: 497px;
`
const HandClickPlayer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  pointer-events: none;
`
const DnD1 = styled.div`
  position: absolute;
  top: 257px;
  left: 409px;
`
const DnD2 = styled.div`
  position: absolute;
  top: 131px;
  left: 309px;
`
const DnD3 = styled.div`
  position: absolute;
  top: 357px;
  left: 184px;
`
const TapSquare = styled.div<{
  top: number
  left: number
  width: number
  height: number
  transform: boolean
}>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  background: transparent;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  transform: ${(props) => (props.transform ? 'rotate(29deg)' : 'none')};
  cursor: pointer;
`
const DottedImg = styled.img`
  position: absolute;
  top: 369px;
  left: 309px;
`
const Texts = styled.div<{ top: number; delay: number; display: boolean; pos: number }>`
  position: absolute;
  width: 620px;
  height: 62px;
  left: 50%;
  translate: -50%;
  top: ${(props) => (props.display ? props.top : props.pos == 1 ? 580 : 630)}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #646464;
  transition: top ${(props) => props.delay}ms;
  opacity: ${(props) => (props.display ? 1 : 0)};
  & sup {
    font-size: 14px;
  }
`
const frameEndPartitions = [0, 143, 188, 221, 253, 285, 316, 346, 358, 379]
const topValueClick = [695, 261, 0, 0, 0, 377, 200]
const leftValueClick = [322, 285, 0, 0, 0, 170, 350]

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
const handAnimLoopTop1 = [358, 358, 358, 358, 358, 335, 311, 287, 263, 239, 215, 215, 215, 215, 358]
const handAnimLoopLeft1 = [
  425, 425, 425, 425, 425, 388, 350, 312, 274, 236, 198, 198, 198, 198, 425,
]
const handAnimLoopTop2 = [125, 125, 125, 125, 125, 160, 195, 230, 265, 300, 335, 335, 335, 335, 125]
const handAnimLoopLeft2 = [
  400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400,
]
const handAnimLoopTop3 = [365, 365, 365, 365, 365, 365, 365, 365, 365, 365, 365, 365, 365, 365, 365]
const handAnimLoopLeft3 = [
  160, 160, 160, 160, 160, 216, 246, 264, 282, 290, 280, 280, 280, 280, 150,
]

export const Applet4702Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<Player>(null)
  const [animProgress, setAnimProgress] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [progressControl, setProgressControl] = useState(0)
  const [componentControl, setComponentControl] = useState(0)
  const [playAnimation, setPlayAnimation] = useState(false)
  const [nextDisable, setNextDisable] = useState(false)
  const [showClickPointer, setShowClickPointer] = useState(true)
  const [showMovePointer, setShowMovePointer] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')
  const [handAnimLoopIndex, setHandAnimLoopIndex] = useState(0)

  useInterval(
    () => {
      setHandAnimLoopIndex((i) => (i >= 12 ? 0 : i + 1))
    },
    showMovePointer ? 120 : null,
  )

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
            setComponentControl(1)
            setShowClickPointer(true)
            break
          case 2:
            setComponentControl(9)
            setNextDisable(false)
            break
          case 3:
            setComponentControl(2)
            setShowMovePointer(true)
            break
          case 4:
            setComponentControl(3)
            setShowMovePointer(true)
            break
          case 5:
            setComponentControl(4)
            setShowMovePointer(true)
            break
          case 6:
            setComponentControl(5)
            setShowClickPointer(true)
            break
          case 7:
            setComponentControl(6)
            setShowClickPointer(true)
            break
          case 8:
            setNextDisable(false)
            break
          case 9:
            setComponentControl(7)
            break
        }
      }
    },
    playAnimation ? 50 : null,
  )
  useInterval(
    () => {
      if (componentControl == 7) {
        setComponentControl(8)
      }
    },
    pageIndex == 3 ? 1000 : null,
  )
  useEffect(() => {
    if (playerRef.current == null) return
    playerRef.current.setSeeker(animProgress)
  }, [animProgress])
  const onNextHandle = () => {
    if (playerRef.current == null) return
    switch (pageIndex) {
      case 0:
        setNextDisable(true)
        setAnimProgress(0)
        setProgressControl(1)
        setPlayAnimation(true)
        setShowClickPointer(false)
        break
      case 1:
        setAnimProgress(188)
        setNextDisable(true)
        setProgressControl(3)
        setPlayAnimation(true)
        setComponentControl(0)

        break
      case 2:
        setAnimProgress(358)
        setNextDisable(true)
        setProgressControl(9)
        setPlayAnimation(true)
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
        playerRef.current.setSeeker(0)
        setShowClickPointer(false)
        break
      case 2:
        setPlayAnimation(false)
        setComponentControl(9)
        setNextDisable(false)
        playerRef.current.setSeeker(188)
        setShowClickPointer(false)
        setShowMovePointer(false)
        break
      case 3:
        setPlayAnimation(false)
        setComponentControl(0)
        setNextDisable(false)
        playerRef.current.setSeeker(358)
        break
    }
  }
  const onResetHandle = () => {
    if (playerRef.current == null) return
    setPlayAnimation(false)
    setNextDisable(false)
    setComponentControl(0)
    playerRef.current.setSeeker(0)
    setShowClickPointer(true)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E7FBFF',
        id: '47_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Duplicate the triangle and rearrange them to form squares and derive the Pythagoras theorem."
        backgroundColor="#E7FBFF"
        buttonColor="#A6F0FF"
      />
      <PlacedPlayer src={videoFile} ref={playerRef} /* autoPlay={true} loop */ />
      {componentControl == 1 && (
        <TapSquare
          width={256}
          height={256}
          top={191}
          left={231}
          onClick={() => {
            setProgressControl(2)
            setPlayAnimation(true)
            setComponentControl(0)
            setShowClickPointer(false)
            onInteraction('tap')
            playClick()
          }}
          transform={true}
        />
      )}
      {componentControl == 2 && (
        <DnD1>
          <DragAndDrop
            DraggableList={[triangleDrag1]}
            InitialState={{
              '0': false,
            }}
            DropZonePosition={[{ left: -477, top: -255 }]}
            onAllDragComplete={(e) => {
              if (e) {
                setComponentControl(0)
                setProgressControl(4)
                setPlayAnimation(true)
              }
            }}
            onSingleDragStart={(e) => {
              if (e) {
                setShowMovePointer(false)
              }
            }}
            showDropHint={false}
          />
        </DnD1>
      )}

      {componentControl == 3 && (
        <DnD2>
          <DragAndDrop
            DraggableList={[triangleDrag2]}
            InitialState={{
              '0': false,
            }}
            DropZonePosition={[{ left: -252, top: 94 }]}
            onAllDragComplete={(e) => {
              if (e) {
                setComponentControl(0)
                setProgressControl(5)
                setPlayAnimation(true)
              }
            }}
            onSingleDragStart={(e) => {
              if (e) {
                setShowMovePointer(false)
              }
            }}
            showDropHint={false}
          />
        </DnD2>
      )}
      {componentControl == 4 && (
        <DnD3>
          <DragAndDrop
            DraggableList={[triangleDrag3]}
            InitialState={{
              '0': false,
            }}
            DropZonePosition={[{ left: -127, top: -131 }]}
            onAllDragComplete={(e) => {
              if (e) {
                setComponentControl(0)
                setProgressControl(6)
                setPlayAnimation(true)
              }
            }}
            onSingleDragStart={(e) => {
              if (e) {
                setShowMovePointer(false)
              }
            }}
            showDropHint={false}
          />
        </DnD3>
      )}
      {componentControl == 4 && <DottedImg src={dottedTriangle} />}
      {componentControl == 5 && (
        <TapSquare
          width={124}
          height={124}
          top={369}
          left={184}
          onClick={() => {
            setProgressControl(7)
            setPlayAnimation(true)
            setComponentControl(0)
            setShowClickPointer(false)
            onInteraction('tap')
            playClick()
          }}
          transform={false}
        />
      )}
      {componentControl == 6 && (
        <TapSquare
          width={223}
          height={223}
          top={144}
          left={311}
          onClick={() => {
            setProgressControl(8)
            setPlayAnimation(true)
            setComponentControl(0)
            setShowClickPointer(false)
            onInteraction('tap')
            playClick()
          }}
          transform={false}
        />
      )}
      <Texts top={580} delay={600} display={componentControl == 9} pos={2}>
        {'Note that the area of square formed in the centre is equal to c'}
        <sup>2</sup>
        {'.'}
      </Texts>
      <Texts top={502} delay={600} display={componentControl == 7 || componentControl == 8} pos={1}>
        {
          "The combined area of the squares having side length 'a' and side length 'b' is equal to the area of the square with side length 'c'."
        }
      </Texts>
      <Texts top={580} delay={600} display={componentControl == 8} pos={2}>
        {'a'}
        <sup>2</sup>
        {' + b'}
        <sup>2</sup>
        {' = c'}
        <sup>2</sup>
      </Texts>
      {showMovePointer && componentControl == 2 && (
        <HandClickPlayer
          top={handAnimLoopTop1[handAnimLoopIndex]}
          left={handAnimLoopLeft1[handAnimLoopIndex]}
          src={handAnimLoopSteps[handAnimLoopIndex]}
          autoplay
          loop
        />
      )}
      {showMovePointer && componentControl == 3 && (
        <HandClickPlayer
          top={handAnimLoopTop2[handAnimLoopIndex]}
          left={handAnimLoopLeft2[handAnimLoopIndex]}
          src={handAnimLoopSteps[handAnimLoopIndex]}
          autoplay
          loop
        />
      )}
      {showMovePointer && componentControl == 4 && (
        <HandClickPlayer
          top={handAnimLoopTop3[handAnimLoopIndex]}
          left={handAnimLoopLeft3[handAnimLoopIndex]}
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
      {showClickPointer && (
        <HandClickPlayer
          top={topValueClick[componentControl]}
          left={leftValueClick[componentControl]}
          src={handClick}
          autoplay
          loop
        />
      )}
    </AppletContainer>
  )
}
