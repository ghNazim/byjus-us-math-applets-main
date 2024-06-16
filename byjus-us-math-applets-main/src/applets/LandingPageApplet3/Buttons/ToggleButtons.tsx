import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'

const ButtonContainer = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: row;
`
const ToggleBtn = styled.button<{ checked: boolean }>`
  position: relative;
  box-sizing: border-box;
  width: 180px;
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
  width: 38px;
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
  width: 170px;
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

export const ToggleButtton: React.FC<ToggleButtonProps> = (props) => (
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
