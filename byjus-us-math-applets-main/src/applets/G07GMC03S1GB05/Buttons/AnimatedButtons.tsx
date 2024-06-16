import React, { MouseEventHandler } from 'react'
import styled, { keyframes } from 'styled-components'

const wiggleAnimation = keyframes`
  0% { transform: rotate(0deg); }
  20% { transform: rotate(10deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(6deg); }
  80% { transform: rotate(-6deg); }
  100% { transform: rotate(0deg); }
`
const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const AnimatedRotatingButton = styled.button`
  width: auto;
  padding: 8px 26px;
  height: 60px;
  background: #1a1a1a;
  border-radius: 10px;
  flex: none;
  order: 0;
  flex-grow: 0;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;

  .icon-outer {
    fill: ${(props) => props.theme.default};
  }

  &:disabled {
    opacity: 20%;
    cursor: default;
  }

  &:hover:not([disabled]) {
    border: none;
    scale: 1.05;
    transition: 0.3s ease-out;
    img {
      scale: 1.2;
      animation: ${rotateAnimation} 0.5s ease-in-out;
      transition: 0.3s ease-out;
    }
    label {
      scale: 1.5;
      transition: 0.5s ease-out;
    }
    .icon-outer {
      fill: ${(props) => props.theme.hover};
    }
  }

  &:active:not([disabled]) {
    background-color: #1a1a1a99;
    color: #ffffff;
    scale: 1.15;
    transition: 0.3s;
  }
`
const AnimatedWiggleButton = styled.button`
  width: auto;
  padding: 8px 26px;
  height: 60px;
  background: #1a1a1a;
  border-radius: 10px;
  flex: none;
  order: 0;
  flex-grow: 0;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;

  .icon-outer {
    fill: ${(props) => props.theme.default};
  }

  &:disabled {
    opacity: 20%;
    cursor: default;
  }

  &:hover:not([disabled]) {
    border: none;
    scale: 1.05;
    transition: 0.3s ease-out;
    img {
      scale: 1.2;
      animation: ${wiggleAnimation} 0.5s ease-in-out;
      transition: 0.3s ease-out;
    }
    label {
      scale: 1.5;
      transition: 0.5s ease-out;
    }
    .icon-outer {
      fill: ${(props) => props.theme.hover};
    }
  }

  &:active:not([disabled]) {
    background-color: #1a1a1a99;
    color: #ffffff;
    scale: 1.15;
    transition: 0.3s;
  }
`
const Button = styled.button`
  width: auto;
  padding: 8px 26px;
  height: 60px;
  background: #1a1a1a;
  border-radius: 10px;
  flex: none;
  order: 0;
  flex-grow: 0;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;

  .icon-outer {
    fill: ${(props) => props.theme.default};
  }

  &:disabled {
    opacity: 20%;
    cursor: default;
  }

  &:hover:not([disabled]) {
    border: none;
    scale: 1.05;
    transition: 0.3s ease-out;
    .icon-outer {
      fill: ${(props) => props.theme.hover};
    }
  }

  &:active:not([disabled]) {
    background-color: #1a1a1a99;
    color: #ffffff;
    scale: 1.15;
    transition: 0.3s;
  }
`
const ButtonText = styled.label`
  position: relative;
  left: 9px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
`
const ButtonIcon = styled.img`
  position: relative;
  top: 3px;
  left: -5px;
  width: 23px;
  height: 23px;
  border: none;
  cursor: pointer;
`
export interface ButtonProps {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  children: string
  imgSource?: string
}

export const AnimatedStartButton: React.FC<ButtonProps> = (props) => (
  <AnimatedWiggleButton {...props}>
    <ButtonIcon src={props.imgSource} />
    <ButtonText>{props.children}</ButtonText>
  </AnimatedWiggleButton>
)

export const AnimatedRetryButton: React.FC<ButtonProps> = (props) => (
  <AnimatedRotatingButton {...props}>
    <ButtonIcon src={props.imgSource} />
    <ButtonText>{props.children}</ButtonText>
  </AnimatedRotatingButton>
)

export const TextImgButton: React.FC<ButtonProps> = (props) => (
  <Button {...props}>
    <ButtonIcon src={props.imgSource} />
    <ButtonText>{props.children}</ButtonText>
  </Button>
)

export const TextButton: React.FC<ButtonProps> = (props) => (
  <AnimatedWiggleButton {...props}>{props.children}</AnimatedWiggleButton>
)
