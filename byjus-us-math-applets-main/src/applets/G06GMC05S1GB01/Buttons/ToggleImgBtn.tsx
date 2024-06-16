import React, { MouseEventHandler } from 'react'
import styled, { keyframes } from 'styled-components'

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const ToggleSquareBtn = styled.button<{ checked: boolean }>`
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 140px;
  height: 140px;
  padding: 2px 50px;
  background: #ffffff;
  border: 1px solid #c7c7c7;
  box-shadow: ${(props) => (props.checked ? 'none' : 'inset 0px -4px 0px #C7C7C7')};
  border-radius: 12px;
  transition: 0.3s ease-out;
  .icon-outer {
    fill: ${(props) => props.theme.default};
  }

  &:disabled {
    opacity: 20%;
    cursor: default;
  }

  &:hover {
    scale: 1.05;
    transition: 0.1s ease-out;
    .icon-outer {
      fill: ${(props) => props.theme.hover};
    }
  }

  &:active:not([disabled]) {
    color: #ffffff;
    scale: 1.1;
    transition: 0.3s ease-out;
  }
`
const ToggleSquareInnerShadow = styled.div<{ checked: boolean }>`
  position: relative;
  top: 0px;
  left: -46px;
  width: 130px;
  height: 130px;
  border-radius: 8px;
  background: ${(props) => (props.checked ? '#c7c7c7' : 'none')};
  z-index: 1;
  transition: 0.3s ease-out;
`
const ToggleImg = styled.img<{ checked: boolean }>`
  position: relative;
  top: 16px;
  left: 1px;
  width: 95px;
  height: 95px;
  border: none;
  cursor: pointer;
  filter: ${(props) => (props.checked ? 'grayscale(0%)' : ' grayscale(100%)')};
  transition: 0.3s ease-out;
`

export interface ToggleButtonProps {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  children?: string
  isClicked: boolean
  ImgSrc: string
}

export const ToggleSquareButton: React.FC<ToggleButtonProps> = (props) => (
  <ButtonContainer>
    <ToggleSquareBtn checked={props.isClicked} {...props}>
      <ToggleSquareInnerShadow checked={props.isClicked}>
        <ToggleImg checked={props.isClicked} src={props.ImgSrc}></ToggleImg>
      </ToggleSquareInnerShadow>
    </ToggleSquareBtn>
  </ButtonContainer>
)
