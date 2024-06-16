import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import handClick from '../../common/handAnimations/click.json'
import { Header, TextHeader } from '../../common/Header'
import { TogglesGroup } from '../../common/TogglesGroup/TogglesGroup'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import breadVideo from './Assets/Bread.mp4'
import bread from './Assets/bread.png'
import fruitVideo from './Assets/Carambola.mp4'
import fruit from './Assets/fruit1.png'
import knife from './Assets/knife.png'
import roll from './Assets/roll.png'
import selectObject from './Assets/selectObject.png'
import rollVideo from './Assets/SwissRoll.mp4'

const VideoPlayer = styled.video`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 160px;
  pointer-events: none;
  scale: 1.4;
`
const PlayerBorder = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 520px;
  height: 406px;
  left: 50%;
  translate: -50%;
  top: 132px;
  border: 3px solid #2ad3f5;
  border-radius: 9px;
`
const Text = styled.p`
  color: #444;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center !important;
  color: #444444;
`
const KnifeButton = styled.button`
  position: absolute;
  width: 78px;
  height: 78px;
  left: 512px;
  top: 440px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  align-items: center;
  display: flex;
  justify-content: center;
  background: transparent;
  &:disabled {
    cursor: default;
    filter: grayscale(1);
    opacity: 0.6;
  }
`
const SelectObject = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 132px;
  width: 520px;
  height: 406px;
`
const PlacedPlayer = styled(Player)`
  position: absolute;
  left: 477px;
  top: 435px;
  pointer-events: none;
`
const videos = [breadVideo, fruitVideo, rollVideo]

export const Applet5001Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const objectVideoRef = useRef<HTMLVideoElement>(null)
  const [playerControl, setPlayerControl] = useState(-1)
  const [knifeDisable, setKnifeDisable] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')
  const [showKnifePointer, setShowKnifePointer] = useState(false)
  const [resetToggle, setResetToggle] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const onKnifeClicked = () => {
    if (objectVideoRef.current == null) return
    setShowKnifePointer(false)
    objectVideoRef.current.play()
    setResetToggle(false)
    setKnifeDisable(true)
    onInteraction('tap')
    playClick()
  }

  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId < 0) return
    setResetToggle(true)
    setPlayerControl(activeId)
    setShowHandPointer(false)
  }, [])

  useEffect(() => {
    if (resetToggle) {
      if (objectVideoRef.current == null) return
      setResetToggle(false)
      setShowKnifePointer(true)
      objectVideoRef.current.pause()
      objectVideoRef.current.currentTime = 0
      setKnifeDisable(false)
    }
  }, [resetToggle])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E7FBFF',
        id: '50_01_GE',
        onEvent,
        className,
      }}
    >
      {/* <TextHeader
        text="Slice the object to observe the cross section."
        backgroundColor="#E7FBFF"
        buttonColor="#A6F0FF"
      /> */}
      <Header backgroundColor="#E7FBFF" buttonColor="#A6F0FF">
        <Text>Slice the object to observe the cross&nbsp;section.</Text>
      </Header>
      {!showHandPointer && (
        <VideoPlayer src={videos[playerControl]} ref={objectVideoRef} onChange={() => {}} />
      )}
      {!showHandPointer && <PlayerBorder />}
      {!showHandPointer && (
        <KnifeButton onClick={onKnifeClicked} disabled={knifeDisable}>
          <img src={knife} />
        </KnifeButton>
      )}
      {showKnifePointer && <PlacedPlayer src={handClick} autoplay loop />}
      <TogglesGroup
        optionArray={[bread, fruit, roll]}
        onChange={handleToggleChange}
        disabled={resetToggle}
        childDimensions={{ width: 155, height: 130 }}
        dimensions={{ width: 530, height: 140 }}
        position={{ left: 95, top: 605 }}
        highlightColor="#D1F7FF"
        showOnBoarding={showHandPointer}
      />
      {showHandPointer && <SelectObject src={selectObject} />}
    </AppletContainer>
  )
}
