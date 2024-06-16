import { Player } from '@lottiefiles/react-lottie-player'
import { EventType, useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import handAnimation from '../../../common/handAnimations/click.json'
import boxImg from './TotalTravelTime.svg'
import Riv from './UnitsOfTime.riv'

const RiveHolder = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`

const PlacedText = styled.div`
  position: absolute;
  top: 520px;
  width: 720px;
  left: 50%;
  translate: -50%;
  color: #444444;
  font-family: 'Nunito', sans-serif !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
  z-index: 1;
  margin-top: -440px;
`

const LottiePlayer = styled(Player)`
  position: absolute;
  top: 200px;
  left: 199px;
  pointer-events: none;
`

const RiveComponent = () => {
  const [currentPlace, setCurrentPlace] = useState(0)
  const [curentTransport, setCurrentTransport] = useState(0)
  const [firstClicked, setFirstClicked] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const { rive, RiveComponent } = useRive({
    src: Riv,
    stateMachines: 'unitsOfTime',
    autoplay: true,
    onLoad: () => {
      setLoaded(true)
    },
    onStateChange: () => {
      setFirstClicked(false)
    },
  })

  const timesArray = [
    [3, 0.75, 0.17],
    [2.8, 1, 0.2],
    [3.2, 1.3, 0.3],
    [1.5, 0.5, 0.15],
    [2.5, 1.5, 0.18],
  ]

  useEffect(() => {
    playMouseIn()
  }, [curentTransport])

  useEffect(() => {
    playMouseOut()
  }, [currentPlace, firstClicked])

  const placeValue = useStateMachineInput(rive, 'unitsOfTime', 'placeValue')
  const transportValue = useStateMachineInput(rive, 'unitsOfTime', 'transportValue')

  const onStateChange = useCallback(() => {
    if (placeValue && transportValue) {
      setCurrentPlace(+placeValue.value - 1)
      setCurrentTransport(+transportValue.value)
    }
  }, [placeValue, transportValue])

  useEffect(() => {
    if (rive) {
      rive.on(EventType.StateChange, onStateChange)
      return () => rive.unsubscribe(EventType.StateChange, onStateChange)
    }
  }, [onStateChange, rive])

  return (
    <RiveHolder>
      {firstClicked ? <LottiePlayer src={handAnimation} autoplay loop /> : null}
      <RiveComponent
        style={{
          position: 'absolute',
          top: '-25px',
          width: '650px',
          zIndex: -1,
        }}
      />
      <div className="textHolder">
        {loaded ? (
          <img
            src={boxImg}
            alt=""
            style={{
              position: 'absolute',
              width: '650px',
              top: '640px',
              left: '40px',
            }}
          />
        ) : null}
        {!firstClicked ? (
          <div>
            <PlacedText
              style={{
                position: 'absolute',
                top: '1100px',
                left: '235px',
              }}
            >
              <b>{timesArray[currentPlace][curentTransport]}</b> days
            </PlacedText>
            <PlacedText
              style={{
                position: 'absolute',
                top: '1100px',
                left: '340px',
              }}
            >
              <b>{(timesArray[currentPlace][curentTransport] * 24).toFixed(0)}</b> hours
            </PlacedText>
            <PlacedText
              style={{
                position: 'absolute',
                top: '1100px',
                left: '465px',
              }}
            >
              <b>{(timesArray[currentPlace][curentTransport] * 24 * 60).toFixed(0)}</b> minutes
            </PlacedText>
            <PlacedText
              style={{
                position: 'absolute',
                top: '1100px',
                left: '620px',
              }}
            >
              <b>{(timesArray[currentPlace][curentTransport] * 24 * 60 * 60).toFixed(0)}</b> seconds
            </PlacedText>
          </div>
        ) : null}
      </div>
    </RiveHolder>
  )
}

export default RiveComponent
