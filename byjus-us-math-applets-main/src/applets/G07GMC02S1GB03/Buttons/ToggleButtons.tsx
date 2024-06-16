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
const ButtonContainer = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: row;
`
const ToggleBtn = styled.button<{ checked: boolean }>`
  position: relative;
  box-sizing: border-box;
  width: 130px;
  height: 60px;
  padding: 2px 50px;
  background: #ffffff;
  border: 1px solid #c7c7c7;
  box-shadow: ${(props) => (props.checked ? 'none' : 'inset 0px -4px 0px #C7C7C7')};
  border-radius: 12px;
  transition: 0.3s;
  cursor: pointer;
  scale: ${(props) => (props.checked ? 1.12 : 1)};
  .icon-outer {
    fill: ${(props) => props.theme.default};
  }

  &:disabled {
    opacity: 20%;
    cursor: not-allowed;
  }

  &:hover {
    scale: ${(props) => (props.checked ? 1.11 : 1.05)};
    transition: 0.3s;
    .icon-outer {
      fill: ${(props) => props.theme.hover};
    }
  }

  &:active {
    .icon-inner {
      fill: ${(props) => props.theme.default};
    }
  }
`
const ToggleText = styled.div<{ checked: boolean }>`
  position: relative;
  top: -10px;
  left: 40px;
  width: 50px;
  height: 28px;
  font-family: 'Nunito';
  font-style: bold;
  font-weight: ${(props) => (props.checked ? 700 : 400)};
  font-size: 20px;
  line-height: 28px;
  transition: 0.3s;
  @media (max-width: 768px) {
    font-size: 26px;
  }
`
const ToggleInnerBtn = styled.div`
  position: relative;
  top: 14px;
  left: 10px;
  width: 22px;
  height: 22px;
  border: 2px solid #1a1a1a;
  border-radius: 50%;
  transition: 0.3s;
`
const ToggleInnerCircle = styled.div<{ checked: boolean }>`
  position: relative;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  transform: ${(props) => (props.checked ? 'scale(1)' : 'scale(.5)')};
  background-color: ${(props) => (props.checked ? '#1a1a1a' : 'none')};
  transition: 0.3s;
`
const ToggleInnerShadow = styled.div<{ checked: boolean }>`
  position: relative;
  top: 0px;
  left: -46px;
  width: 120px;
  height: 52px;
  border-radius: 8px;
  background: ${(props) => (props.checked ? '#c7c7c7' : 'none')};
  z-index: 1;
  transition: 0.3s;
`

export interface ToggleButtonProps {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  children: string
  isClicked: boolean
}

export const ToggleButton: React.FC<ToggleButtonProps> = (props) => (
  <ButtonContainer>
    <ToggleBtn checked={props.isClicked} {...props}>
      <ToggleInnerShadow checked={props.isClicked}>
        <ToggleInnerBtn>
          <ToggleInnerCircle checked={props.isClicked}></ToggleInnerCircle>
        </ToggleInnerBtn>
        <ToggleText checked={props.isClicked}>{props.children}</ToggleText>
      </ToggleInnerShadow>
    </ToggleBtn>
  </ButtonContainer>
)

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export interface ButtonProps {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  children: string
  imgSource?: string
}

const WideButton = styled.button`
  width: auto;
  padding: 8px 26px;
  height: 60px;
  background: #ffffff;
  border: 2px solid #1a1a1a;
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
  color: #212121;

  .icon-outer {
    fill: ${(props) => props.theme.default};
  }

  &:disabled {
    opacity: 20%;
    cursor: default;
  }

  &:hover:not([disabled]) {
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
    background-color: #1a1a1a;
    color: #ffffff;
    scale: 1.15;
    transition: 0.3s;
    img {
      scale: 1.2;
      animation: ${wiggleAnimation} 0.5s ease-in-out;
      transition: 0.3s ease-out;
      filter: invert();
    }
    label {
      scale: 1.5;
      transition: 0.5s ease-out;
      color: #ffffff;
    }
  }
`
const ButtonOutlineText = styled.label`
  position: relative;
  left: 9px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #212121;
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
export const OutlineButton: React.FC<ButtonProps> = (props) => (
  <WideButton {...props}>
    <ButtonIcon src={props.imgSource} />
    <ButtonOutlineText>{props.children}</ButtonOutlineText>
  </WideButton>
)
