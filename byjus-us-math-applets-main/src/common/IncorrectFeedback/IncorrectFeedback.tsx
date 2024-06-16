import React, { useContext, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../contexts/analytics'
import incorrect from '../sfx/incorrect.wav'
import mouseClick from '../sfx/mouseClick.mp3'
import cross from './Assets/cross.png'
import { IncorrectFeedbackProps } from './IncorrectFeedback.types'
const fadeIn = keyframes`
  from {
    opacity: 0;
    visibility: hidden;
  }
  to {
    opacity: 1;
    visibility: visible;
  }
`
const fadeOut = keyframes`
  from {
    opacity: 1;
    visibility: visible;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
`
const PopUpBG = styled.div<{ showAnimation: boolean }>`
  position: absolute;
  width: 100%;
  height: 98%;
  background: rgba(0, 0, 0, 0.3);
  top: 0px;
  z-index: 1;
  border-radius: 20px;
  animation-duration: 300ms;
  animation-iteration-count: 1;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${(props) => (props.showAnimation ? fadeIn : fadeOut)};
`
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`
const fadeOutDown = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
`
const PopUp = styled.div<{ showAnimation: boolean }>`
  position: absolute;
  width: 100%;
  height: -moz-fit-content;
  height: -webkit-fit-content;
  height: -fit-content;
  background-color: #ffffff;
  bottom: -2px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  animation-duration: 300ms;
  animation-iteration-count: 1;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${(props) => (props.showAnimation ? fadeInUp : fadeOutDown)};
`
const Cross = styled.img`
  position: absolute;
  top: -11px;
  right: 23px;
  cursor: pointer;
`
const Disclaimer = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  display: block;
`
const GotItButton = styled.button`
  position: absolute;
  width: 100px;
  height: 40px;
  left: 50%;
  translate: -50%;
  bottom: 0;
  border: none;
  background: #8c69ff;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
  align-items: center;
  display: flex;
  justify-content: center;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
  &:hover {
    background: #7f5cf4;
  }
  &:active {
    background: #6549c2;
  }
`
export const IncorrectFeedback: React.FC<IncorrectFeedbackProps> = ({
  showPopAnimation,
  disclaimer,
  onClose,
  children,
}) => {
  const playMouseClick = useSFX('mouseClick')
  const playIncorrect = useSFX('incorrect')
  const onInteraction = useContext(AnalyticsContext)
  useEffect(() => {
    if (showPopAnimation) playIncorrect()
  }, [showPopAnimation, playIncorrect])
  return (
    <PopUpBG showAnimation={showPopAnimation}>
      <PopUp showAnimation={showPopAnimation}>
        <Disclaimer src={disclaimer} />
        <Cross
          src={cross}
          onClick={() => {
            if (onClose) onClose()
            onInteraction('tap')
            playMouseClick()
          }}
        />
        {children}
        <GotItButton
          onClick={() => {
            if (onClose) onClose()
            onInteraction('tap')
            playMouseClick()
          }}
        >
          Got it
        </GotItButton>
      </PopUp>
    </PopUpBG>
  )
}
