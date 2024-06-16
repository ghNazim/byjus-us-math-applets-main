import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { HeaderProps } from './Header.types'

const flipOutX = keyframes`
  from {
    transform: perspective(400px);
  }

  30% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }

  to {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
`

const flipInX = keyframes`
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }

  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }

  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }

  to {
    transform: perspective(400px);
  }
`

const Container = styled.div`
  width: 720px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;
  z-index: 1;
  filter: drop-shadow(0px 2px 5px rgba(171, 171, 171, 0.2));
`

const Background = styled.div<{ backgroundColor: string; visible: boolean }>`
  display: 'flex';
  border-radius: 0px 0px 22px 22px;
  background: ${(props) => props.backgroundColor};
  width: 567px;
  min-height: 20px;
  padding: 9px 16px 18px 16px;
  position: relative;
  transition: 0.5s linear;

  &::before {
    content: '';
    height: 22px;
    width: 22px;
    background: radial-gradient(
      circle at 0% 100%,
      transparent 22px,
      ${(props) => props.backgroundColor} 0
    );
    position: absolute;
    left: -${(props) => (props.visible ? 22 : 18)}px;
    top: 0px;
  }

  &::after {
    content: '';
    height: 22px;
    width: 22px;
    background: radial-gradient(
      circle at 100% 100%,
      transparent 22px,
      ${(props) => props.backgroundColor} 0
    );
    position: absolute;
    right: -${(props) => (props.visible ? 22 : 18)}px;
    top: 0px;
  }
`
const HeaderButton = styled.button`
  background-color: transparent;
  margin: 0 auto;
  margin-top: 0px;
  margin-bottom: -10px;
  border: 0;
  display: flex;
  transition: 0.3s;
  &:hover {
    scale: 1.1;
  }
`
const ChildrenCointainer = styled.div<{ visible: boolean }>`
  display: block;
  max-height: ${(props) => (props.visible ? '200px' : '0px')};
  transform-origin: top;
  transition: 0.5s linear;

  animation-duration: 0.5s;
  animation-play-state: running;
  animation-fill-mode: both;

  &.hide {
    animation-name: ${flipOutX};
  }

  &.show {
    animation-name: ${flipInX};
  }
`

export const Header: React.FC<HeaderProps> = ({
  children,
  backgroundColor = '#f6f6f6',
  buttonColor = '#1a1a1a',
  hideButton = false,
}) => {
  const [hideChildren, setHideChildren] = useState(true)

  const onButtonClickHandle = () => {
    hideChildren ? setHideChildren(false) : setHideChildren(true)
  }

  return (
    <Container>
      <Background backgroundColor={backgroundColor} visible={hideChildren}>
        <ChildrenCointainer className={hideChildren ? 'show' : 'hide'} visible={hideChildren}>
          {children}
        </ChildrenCointainer>
        {!hideButton && (
          <HeaderButton onClick={onButtonClickHandle}>
            <svg
              width="42"
              height="7"
              viewBox="0 0 42 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1H41"
                stroke={buttonColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 6H41"
                stroke={buttonColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </HeaderButton>
        )}
      </Background>
    </Container>
  )
}
