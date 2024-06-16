import React, { MouseEventHandler, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import menuContainer from './Assets/openMenu.svg'

const bounceAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  35% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.7);
  }
  100% {
    transform: scale(1);
  }
`
const Container = styled.div`
  position: absolute;
  top: 110px;
  right: 35px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: row;
`
const ToggleBtn = styled.button<{ checked: boolean }>`
  position: relative;
  left: -13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  box-sizing: border-box;
  width: 60px;
  height: 60px;
  background: #ffffff;
  border: 1px solid var(--interactives-090, #1a1a1a);
  box-shadow: ${(props) => (props.checked ? 'none' : 'inset 0px -4px 0px #000')};
  border-radius: 12px;
  transition: 0.3s;
  cursor: pointer;
  .icon-outer {
    fill: ${(props) => props.theme.default};
  }

  &:disabled {
    opacity: 20%;
    cursor: not-allowed;
  }

  &:hover {
    scale: ${(props) => (props.checked ? 1 : 1.05)};
    transition: 0.3s;
    .icon-outer {
      fill: ${(props) => props.theme.hover};
    }
  }

  &:active {
    .icon-inner {
      fill: ${(props) => props.theme.default};
    }
    animation: ${bounceAnimation} 0.7s ease-out;
  }
`
const ToggleText = styled.div<{ checked: boolean }>`
  width: 38px;
  height: 28px;
  font-family: 'Nunito';
  font-style: bold;
  font-weight: 500;
  font-size: ${(props) => (props.checked ? '26px' : '20px')};
  transition: 0.3s ease-out;
  line-height: 28px;
  transition: 0.3s;
  @media (max-width: 768px) {
    font-size: 26px;
  }
`
const MenuContainer = styled.div<{ stage: Stage }>`
  width: 650px;
  height: 270px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-evenly;
  pointer-events: none;
  background-image: url(${menuContainer});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: ${({ stage }) => (stage === 'enter' ? 1 : 0)};
  transition: opacity 0.3s ease-out;
`
const TextFlexBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
`
const MenuLabel = styled.label<{ highlighted?: boolean }>`
  font-family: 'Nunito';
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  transition: background-color 0.3s ease-out;
  color: ${(props) => (props.highlighted ? '#444444' : '#C7C7C7')};
`

export interface ToggleButtonProps {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  children: string
  setMenuOpen: boolean
  textIndex: number
}

export const InfoTabCommon: React.FC<ToggleButtonProps> = (props) => {
  const [isMenuOpen, setMenuOpen] = useState(true)

  const { stage, shouldMount } = useTransition(isMenuOpen, 200)

  useEffect(() => {
    setMenuOpen(props.setMenuOpen)
  }, [props.setMenuOpen])

  return (
    <Container>
      <ButtonContainer>
        <ToggleBtn
          checked={isMenuOpen}
          onClick={() => setMenuOpen((d) => !d)}
          disabled={props.disabled}
        >
          <ToggleText checked={isMenuOpen}>{props.children}</ToggleText>
        </ToggleBtn>
      </ButtonContainer>
      {shouldMount && (
        <MenuContainer stage={stage}>
          <TextFlexBox>
            <MenuLabel style={{ width: '54px' }} highlighted={props.textIndex === 0}>
              Step 1:
            </MenuLabel>
            <MenuLabel style={{ width: '550px' }} highlighted={props.textIndex === 0}>
              Draw the base with any of the given lengths using a ruler.
            </MenuLabel>
          </TextFlexBox>
          <TextFlexBox>
            <MenuLabel style={{ width: '54px' }} highlighted={props.textIndex === 1}>
              Step 2:
            </MenuLabel>
            <MenuLabel style={{ width: '550px' }} highlighted={props.textIndex === 1}>
              Draw a circle, centered at one end of the base, with a radius equal to one of the
              other side lengths, using a compass.
            </MenuLabel>
          </TextFlexBox>
          <TextFlexBox>
            <MenuLabel style={{ width: '54px' }} highlighted={props.textIndex === 2}>
              Step 3:
            </MenuLabel>
            <MenuLabel style={{ width: '550px' }} highlighted={props.textIndex === 2}>
              Draw another circle, centered at other end of the base, with a radius equal to the
              remaining side length.
            </MenuLabel>
          </TextFlexBox>
          <TextFlexBox>
            <MenuLabel style={{ width: '54px' }} highlighted={props.textIndex === 3}>
              Step 4:
            </MenuLabel>
            <MenuLabel style={{ width: '550px' }} highlighted={props.textIndex === 3}>
              Join one end of base with either of two intersection points using a ruler.
            </MenuLabel>
          </TextFlexBox>
          <TextFlexBox>
            <MenuLabel style={{ width: '54px' }} highlighted={props.textIndex === 4}>
              Step 5:
            </MenuLabel>
            <MenuLabel style={{ width: '550px' }} highlighted={props.textIndex === 4}>
              Join the other end of base with the same intersection point to complete the triangle.
            </MenuLabel>
          </TextFlexBox>
        </MenuContainer>
      )}
    </Container>
  )
}
