import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { HeaderProps } from './Header.types'

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const Container = styled.div`
  position: absolute;
  width: 720px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 85px;
  z-index: 1;
  filter: drop-shadow(0px 2px 5px rgba(171, 171, 171, 0.2));
`

const Background = styled.div<{ backgroundColor: string }>`
  display: 'flex';
  border-radius: 0px 0px 22px 22px;
  background: ${(props) => props.backgroundColor};
  width: 567px;
  min-height: 25px;
  padding: 9px 16px 18px 16px;
  position: absolute;
  left: 74px;
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
    display: block;
    position: absolute;
    left: -22px;
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
    display: block;
    position: absolute;
    right: -22px;
    top: 0px;
  }
`
const HeaderButton = styled.button`
  background-color: transparent;
  border: 0;
  position: absolute;
  bottom: 4px;
  left: 45%;
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
    animation-name: ${fadeOut};
  }

  &.show {
    animation-name: ${fadeIn};
  }
`

export const Header: React.FC<HeaderProps> = ({
  children,
  backgroundColor = '#E7FBFF',
  buttonColor = '#146292',
  hideButton = false,
  className,
}) => {
  const [hideChildren, setHideChildren] = useState(true)

  const onButtonClickHandle = () => {
    hideChildren ? setHideChildren(false) : setHideChildren(true)
  }

  return (
    <Container>
      <Background backgroundColor={backgroundColor}>
        <ChildrenCointainer
          className={`${className} ${hideChildren ? 'show' : 'hide'}`}
          visible={hideChildren}
        >
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
