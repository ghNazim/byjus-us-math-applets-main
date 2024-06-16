import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import click from '../../common/handAnimations/click.json'
import { TextHeader } from '../../common/Header'
import { Ticker } from '../../common/Ticker'
import { AppletInteractionCallback } from '../../contexts/analytics'
import Animation4 from './assets/Anim4.mp4'
import Animation1 from './assets/Prism1.mp4'
import Animation2 from './assets/Prism2.mp4'
import Animation3 from './assets/Prism3.mp4'
import selectFrame from './assets/selectFrame.png'
import ToggleGroup from './ToggleGroup/ToggleGroup'

const SelectFrame = styled.img`
  width: 293;
  height: 362;
  position: absolute;
  top: 112px;
  left: 50%;
  translate: -50%;
`
const moveRight = keyframes`
  from {
    left:170px;
  }

  to {
    left:330px;
  }
`
const showText = keyframes`
  from {
    opacity:0;
  }

  to {
    opacity:1;
  }
`
const LottiePlayer = styled(Player)`
  position: absolute;
  bottom: 100px;
  left: 70px;
  pointer-events: none;
`
const TickerContainer = styled.div<{ firstLoad: boolean }>`
  display: flex;
  position: absolute;
  top: 265px;
  left: 50px;
  animation-duration: ${(props) => (props.firstLoad ? 200 : 0)}ms;
  animation-timing-function: linear;
  animation-delay: ${(props) => (props.firstLoad ? 1.75 : 0)}s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${showText};
`

const PlacedPlayer = styled.video<{ firstLoad: boolean }>`
  position: absolute;
  top: 90px;
  left: 170px;

  animation-duration: ${(props) => (props.firstLoad ? 150 : 0)}ms;
  animation-timing-function: linear;
  animation-delay: ${(props) => (props.firstLoad ? 1 : 0)}s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${moveRight};
`

const HelperText = styled.div`
  position: absolute;
  top: 60px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #646464;
  padding: 0 5px;
`
const TickerLabel = styled.span`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  color: #646464;
  padding: 0 5px;
`
const tickerMax = [40, 20, 36, 16]

const Inner: React.FC = () => {
  const [firstSelection, setFirstSelection] = useState(true)
  const [loadAnime, setLoadAnime] = useState(false)
  const [tickerLength, setTickerLength] = useState(0)
  const [togglesDisabled, setTogglesDisabled] = useState(false)
  const playerRef = useRef<HTMLVideoElement>(null)
  const [animeControl, setAnimeControl] = useState(-1)
  const [showText, setShowText] = useState(false)
  const [showHand, setShowHand] = useState(true)
  const animations = [Animation1, Animation2, Animation3, Animation4]

  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId !== -1) setTogglesDisabled(true)
    if (activeId < 0) return
    setAnimeControl(activeId)
    setLoadAnime(firstSelection ? true : false)
    setShowHand(firstSelection ? true : false)
    if (activeId !== -1 && firstSelection) setFirstSelection(false)
    setShowText(false)
  }, [])

  const onChange = (value: number) => {
    setTickerLength(value)
  }

  useEffect(() => {
    if (playerRef.current == null) return
    const progress = tickerLength != 0 ? tickerLength / tickerMax[animeControl] : 0
    const duration = playerRef.current.duration
    playerRef.current.currentTime = isFinite(duration) ? progress * duration : 0
  }, [tickerLength, animeControl])

  useEffect(() => {
    if (playerRef.current == null) return
    if (playerRef.current.currentTime == playerRef.current.duration) {
      setShowText(true)
      setTogglesDisabled(false)
    }
  }, [tickerLength])

  return (
    <div style={{ backgroundColor: 'white' }}>
      {firstSelection && <SelectFrame src={selectFrame} />}
      {!firstSelection && (
        <PlacedPlayer
          src={animations[animeControl]}
          muted
          width={'50%'}
          height={'50%'}
          ref={playerRef}
          firstLoad={loadAnime}
        />
      )}
      {!firstSelection && (
        <TickerContainer firstLoad={loadAnime}>
          <TickerLabel>Number of unit cubes = </TickerLabel>
          <Ticker
            value={0}
            min={0}
            max={tickerMax[animeControl]}
            onChange={onChange}
            showHandDefault={showHand}
            reset={togglesDisabled}
          />
          {showText && (
            <HelperText>{`The volume of this rectangular prism is ${tickerMax[animeControl]} unit cubes.`}</HelperText>
          )}
        </TickerContainer>
      )}
      <ToggleGroup noOfChildren={4} onChange={handleToggleChange} disabled={togglesDisabled} />
      {firstSelection && <LottiePlayer src={click} loop autoplay />}
    </div>
  )
}

export const Applet00401Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FFF6DB',
        id: '004_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Select a rectangular prism of your choice and fill it with unit cubes."
        backgroundColor="#FFF6DB"
        buttonColor="#FFDC73"
      />
      <Inner />
    </AppletContainer>
  )
}
