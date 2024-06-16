import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../contexts/analytics'
import { useStep } from '../../hooks/useStep'
import moveHorizontallyAnim from '../handAnimations/clickAndDrag.json'
import click from '../sfx/mouseClick.mp3'
import mouseIn from '../sfx/mouseIn.wav'
import mouseOut from '../sfx/mouseOut.wav'
import leftArrow from './icons/leftArrow.svg'
import rightArrow from './icons/rightArrow.svg'
import tickerTop from './icons/tickerTop.svg'
import { TickerProps } from './Ticker.types'

const Container = styled.div<{
  backgroundColor: string
  backgroundColorHover: string
  grabbing: boolean
  disabled: boolean
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 5px;
  gap: 4px;
  background-color: ${(props) =>
    props.grabbing && !props.disabled
      ? props.backgroundColorHover
      : props.backgroundColor}; // updating background colour from the prop recieved
  width: 60px;
  height: 28px;
  border-radius: 6px;
  user-select: none;
  cursor: ${(props) => (props.grabbing ? 'grabbing' : 'grab')};

  &[disabled] {
    pointer-events: none;
    filter: grayscale(1);
  }

  &:hover {
    background-color: ${(props) => props.backgroundColorHover};
  }
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
  scale: 1;
  cursor: pointer;

  &:hover {
    scale: 1.3;
  }

  &:active {
    scale: 1;
  }

  &:disabled {
    scale: 1;
    cursor: auto;

    img {
      filter: sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg);
    }
  }
`

const Icon = styled.img.attrs(() => ({ draggable: false }))`
  width: 12px;
  height: 12px;
  flex: none;
  flex-grow: 0;
`

const Number = styled.label`
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
  flex: none;
  flex-grow: 0;
  position: relative;
  bottom: 1px;
`

const Progress = styled.div<{ value: number }>`
  position: absolute;
  height: 4px;
  width: ${(props) => props.value * 140 + 2}px;
  top: 2px;
  left: 3px;
  background-color: white;
  border-radius: 2px;
  transition: 0.3s linear;
`

const ToolTip = styled.div.attrs(() => ({ draggable: false }))`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 100%;
`

const LottePlayer = styled(Player)`
  position: absolute;
  width: 280px;
  pointer-events: none;
  top: 30%;
  left: 50%;
  translate: -50%;
`

export const Ticker: React.FC<TickerProps> = ({
  value: initialValue = 0,
  min = 0,
  max = 10,
  step = 1,
  reset: isReset = false,
  iconLeft = leftArrow,
  iconRight = rightArrow,
  backgroundColor = '#8C69FF',
  backgroundColorHover = '#6549C2',
  disabled = false,
  onChange,
  showHandDefault = true,
  showHandOnBoarding = true,
}) => {
  const [value, { goToNextStep, goToPrevStep, canGoToNextStep, canGoToPrevStep, reset }] = useStep(
    min,
    max,
    step,
    initialValue,
  )

  const [showHand, setShowHand] = useState(showHandDefault)
  const [hovering, setHoverOn] = useState(false)
  const [grabbing, setGrabbing] = useState(false)
  const [cursorDirection, setCursorDirection] = useState({ position: 0, change: 0 })

  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playClick = useSFX('mouseClick')

  useEffect(() => {
    onChange?.(value)
  }, [value])

  useEffect(() => {
    if (isReset) reset()
  }, [isReset, reset])

  const onInteraction = useContext(AnalyticsContext)
  const tickerDragDistance = 70 / (max - min)

  const onIncrease = useCallback(() => {
    setShowHand(false)
    goToNextStep()
    onInteraction('increase')
  }, [goToNextStep, onInteraction])

  const onDecrease = useCallback(() => {
    setShowHand(false)
    goToPrevStep()
    onInteraction('decrease')
  }, [goToPrevStep, onInteraction])

  const onMouseOrTouchDown = useCallback(() => {
    setGrabbing(true)
  }, [])

  const onMouseOrTouchUp = useCallback(() => {
    setGrabbing(false)
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const newPosition = e.clientX
      setCursorDirection((c) => {
        if (newPosition > c.position + tickerDragDistance) {
          return {
            change: 1,
            position: newPosition,
          }
        }

        if (newPosition < c.position - tickerDragDistance) {
          return {
            change: -1,
            position: newPosition,
          }
        }

        return { position: c.position, change: 0 }
      })
    },
    [tickerDragDistance],
  )

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      const newPosition = e.touches[0].clientX
      setCursorDirection((c) => {
        if (newPosition > c.position + tickerDragDistance) {
          return {
            change: 1,
            position: newPosition,
          }
        }

        if (newPosition < c.position - tickerDragDistance) {
          return {
            change: -1,
            position: newPosition,
          }
        }

        return { position: c.position, change: 0 }
      })
    },
    [tickerDragDistance],
  )

  useEffect(() => {
    if (grabbing) {
      document.body.style.cursor = 'grabbing'
      return () => {
        document.body.style.cursor = 'auto'
      }
    }

    setCursorDirection({ position: 0, change: 0 })
  }, [grabbing])

  useEffect(() => {
    if (grabbing) {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('touchmove', onTouchMove, { passive: false })
      return () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('touchmove', onTouchMove)
      }
    }
  }, [grabbing, onMouseMove, onTouchMove])

  useEffect(() => {
    if (grabbing) {
      document.addEventListener('mouseup', onMouseOrTouchUp)
      document.addEventListener('touchend', onMouseOrTouchUp)
      return () => {
        document.removeEventListener('mouseup', onMouseOrTouchUp)
        document.removeEventListener('touchend', onMouseOrTouchUp)
      }
    }
  }, [grabbing, onMouseOrTouchUp])

  useEffect(() => {
    if (grabbing) {
      playMouseIn()
      return playMouseOut
    }
  }, [grabbing, playMouseIn, playMouseOut])

  useEffect(() => {
    if (cursorDirection.change > 0) onIncrease()
    else if (cursorDirection.change < 0) onDecrease()
  }, [cursorDirection, onDecrease, onIncrease])

  return (
    <Container
      draggable={false}
      backgroundColor={backgroundColor}
      backgroundColorHover={backgroundColorHover}
      data-testid="Ticker"
      grabbing={grabbing}
      disabled={disabled}
      onMouseEnter={() => {
        setHoverOn(true)
      }}
      onMouseLeave={() => {
        setHoverOn(false)
      }}
      onMouseDown={onMouseOrTouchDown}
      onTouchStart={onMouseOrTouchDown}
    >
      {!disabled && (
        <Button
          disabled={!canGoToPrevStep || grabbing}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => {
            onDecrease()
            playClick()
          }}
        >
          <Icon src={iconLeft} alt="DecreaseButton" />
        </Button>
      )}
      <Number style={{ pointerEvents: 'none' }}>{value}</Number>
      {!disabled && (
        <>
          <ToolTip>
            <img
              style={{
                transition: '0.5s',
                opacity: `${hovering || grabbing ? 1 : 0}`,
              }}
              src={tickerTop}
              alt="Ticker Top"
              width={'150px'}
              height={'auto'}
              draggable="false"
            />
            <Progress
              style={{
                transition: '0.5s',
                opacity: `${hovering || grabbing ? 1 : 0}`,
              }}
              value={(value - min) / (max - min)}
              draggable="false"
            ></Progress>
            {(showHand || showHandOnBoarding) && (
              <LottePlayer src={moveHorizontallyAnim} loop autoplay />
            )}
          </ToolTip>
          <Button
            disabled={!canGoToNextStep || grabbing}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => {
              onIncrease()
              playClick()
            }}
          >
            <Icon src={iconRight} alt="IncreaseButton" />
          </Button>
        </>
      )}
    </Container>
  )
}
