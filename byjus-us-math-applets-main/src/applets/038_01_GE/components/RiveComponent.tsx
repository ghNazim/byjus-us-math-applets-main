import { Player } from '@lottiefiles/react-lottie-player'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import moveHorizontally from '../../../common/handAnimations/click.json'
import Puzzle from './puzzleRes.riv'

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

const PlacedText = styled.div`
  position: absolute;
  top: 550px;
  width: 720px;
  left: 50%;
  translate: -50%;
  color: #444444;
  font-family: 'Nunito', sans-serif !important;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;

  animation-duration: 500ms;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${fadeInRight};
`

const AdultHint = styled(Player)`
  position: absolute;
  top: 320px;
  left: 40px;
  scale: 60%;
  pointer-events: none;
`

const ChildHint = styled(Player)`
  position: absolute;
  top: 320px;
  right: 40px;
  scale: 60%;
  pointer-events: none;
`
const RiveHolder = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`

// const stateIndex = 0

function RiveApp() {
  const [adultToBe, setAdultToBe] = useState(true)
  const [childToBe, setChildToBe] = useState(false)
  const [stateIndex, setStateIndex] = useState(0)
  const [show, setShow] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const isMounted = useRef(true)
  const endPoint = useRef(true)
  const { rive, RiveComponent } = useRive({
    src: Puzzle,
    stateMachines: 'State Machine 1',
    autoplay: true,
    onStateChange: (e: any) => {
      if (e.data[0] == undefined) return
      switch (e.data[0]) {
        case 'adultHand':
          endPoint.current = true
          setAdultToBe(false)
          setStateIndex(1)
          break
        case 'adultHand 2':
          setAdultToBe(false)
          setStateIndex(1)
          break
        case 'emptyState':
          setStateIndex(2)
          setChildToBe(true)
          break
        case 'kidHand':
          endPoint.current = false
          setAdultToBe(false)
          setStateIndex(3)
          break
        case 'emptyState2':
          setStateIndex(6)
          setAdultToBe(true)
          break
        case 'buttonEmpty':
          if (!isMounted.current) break
          endPoint.current == true ? setStateIndex(6) : setStateIndex(2)
          // setStateIndex(6)
          isMounted.current = false
          setShow(true)
          break
        case 'kidHand 2':
          setStateIndex(8)
          setChildToBe(false)
          break
        case 'final point':
          setStateIndex(6)
          isMounted.current = false
          setShow(true)
          break
        case 'default':
          isMounted.current = true
          setAdultToBe(true)
          setChildToBe(false)
          setStateIndex(0)
          break
        default:
          break
      }
    },
  })

  useEffect(() => {
    if (stateIndex === 1 || stateIndex === 8 || stateIndex === 3) playMouseIn()
  }, [stateIndex])

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false
      return
    }

    const timeOut = setTimeout(() => {
      setShow(false)
      !isMounted.current ? setStateIndex(7) : null
      isMounted.current = true
      retryState?.fire()
    }, 5000)

    return () => clearTimeout(timeOut)
  }, [show])

  const retryState = useStateMachineInput(rive, 'State Machine 1', 'retryTrigger')

  const paraReturn = () => {
    switch (stateIndex) {
      case 0:
        return null
      case 1:
        return null
      case 2:
        return (
          <PlacedText key={'2'}>
            <p>
              The height of the door is{' '}
              <span style={{ color: '#ED6B90', fontWeight: '500' }}>6 adult’s hand span</span>
            </p>
          </PlacedText>
        )
      case 3:
        return null
      case 4:
        return null
      case 5:
        return (
          <PlacedText key={'5'}>
            <p>
              The height of the door is{' '}
              <span style={{ color: '#2AD3F5', fontWeight: '500' }}>10 child’s hand span</span>
            </p>
          </PlacedText>
        )
      case 6:
        return (
          <PlacedText key={'6'}>
            <p>
              The height of the door is{' '}
              <span style={{ color: '#2AD3F5', fontWeight: '500' }}>10 child’s hand span</span>
            </p>
          </PlacedText>
        )
      case 7:
        return (
          <PlacedText key={'7'}>
            <p>
              We can say that the height of the door is{' '}
              <span style={{ color: '#2AD3F5', fontWeight: '500' }}>10 child’s hand span</span> or{' '}
              <br />
              <span style={{ color: '#ED6B90', fontWeight: '500' }}>6 adult’s hand span</span>
            </p>
          </PlacedText>
        )
    }
  }

  return (
    <RiveHolder>
      {adultToBe ? <AdultHint src={moveHorizontally} loop autoplay /> : null}

      {childToBe ? <ChildHint src={moveHorizontally} loop autoplay /> : null}
      <RiveComponent
        style={{
          position: 'absolute',
          top: '20px',
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
      {paraReturn()}
    </RiveHolder>
  )
}

export default RiveApp
