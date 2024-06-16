import React from 'react'
import styled, { Keyframes, keyframes } from 'styled-components'
import { useSwitchTransition } from 'transition-hook'

import { CalloutProps } from './Callout.types'
import logo from './images/logo-default.svg'

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 32px;
  min-height: 60px;
  z-index: 1;
  filter: drop-shadow(0px 2px 5px rgba(171, 171, 171, 0.2));
`

const Logo = styled.div<{ backgroundColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 50%;
  z-index: 2;

  img {
    aspect-ratio: 1;
    width: 50px;
    margin: 5px;
  }
`

const FadeInUpAnimation = keyframes`
  from {
   opacity: 0;
   transform: translate3d(0, 100%, 0);
  }
  to {
   opacity: 1;
   transform: none;
  }
`

const FadeOutUpAnimation = keyframes`
  from {
     opacity: 1;
   }
   to {
     opacity: 0;
     transform: translate3d(0, -100%, 0);
   }
`

interface BackgroundProps {
  visible: boolean
  animationName?: Keyframes | 'none'
  animationDuration: number
  backgroundColor: string
}

const Background = styled.div<BackgroundProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 20px 20px;
  background: ${(props) => props.backgroundColor};
  min-height: 60px;
  padding: 10px 30px;
  margin-left: -24px;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};

  animation-duration: ${(props) => props.animationDuration}ms;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;

  animation-name: ${(props) => props.animationName};
`

export const Callout: React.FC<CalloutProps> = ({
  elements,
  activeIndex = 0,
  animationDuration = 500,
  backgroundColor = '#E7FBFF',
}) => {
  const transition = useSwitchTransition(activeIndex, 500, 'out-in')

  return (
    <Container>
      <Logo backgroundColor={backgroundColor}>
        <img src={logo} alt="logo" />
      </Logo>
      {Array.isArray(elements) ? (
        transition((state, stage) => {
          return (
            <Background
              key={state}
              visible={stage !== 'from'}
              animationDuration={animationDuration}
              backgroundColor={backgroundColor}
              animationName={
                stage === 'enter'
                  ? FadeInUpAnimation
                  : stage === 'leave'
                  ? FadeOutUpAnimation
                  : undefined
              }
            >
              {elements[state]}
            </Background>
          )
        })
      ) : (
        <Background
          animationDuration={animationDuration}
          backgroundColor={backgroundColor}
          animationName={'none'}
          visible
        >
          {elements}
        </Background>
      )}
    </Container>
  )
}
