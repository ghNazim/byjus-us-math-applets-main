import React, { MouseEventHandler, useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { useSFX } from '@/hooks/useSFX'

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
const highlightAnimation = keyframes`
0%{
  background-color: none;
  border-radius: 15px;
opacity: background-color 0;
}
50%{
  background-color:  #FFF6DB;
  border-radius: 15px;
  opacity: background-color 1;
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
  position: relative;
  left: -15px;
  width: 585px;
  height: 167px;
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
  padding: 15px 0px;
`
const TextFlexBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  gap: 10px;
  padding: 0 30px;
`
const MenuLabel = styled.label<{ highlighted?: boolean; isOpen: boolean }>`
  font-family: 'Nunito';
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  transition: background-color 0.3s ease-out;
  animation: ${(props) =>
    props.isOpen && props.highlighted
      ? css`
          ${highlightAnimation} 0.5s ease-out
        `
      : 'none'};
  background-color: ${(props) => (props.isOpen && props.highlighted ? '#FFF6DB' : 'transparent')};
  border-radius: 5px;
  color: ${(props) => (props.highlighted ? '#444444' : '#C7C7C7')};
`

export interface ToggleButtonProps {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  setMenuOpen: boolean
  textIndex: number
}

export const InfoTabCommon: React.FC<ToggleButtonProps> = (props) => {
  const [isMenuOpen, setMenuOpen] = useState(true)

  const playMouseClick = useSFX('mouseClick')

  const { stage, shouldMount } = useTransition(isMenuOpen, 200)

  useEffect(() => {
    setMenuOpen(props.setMenuOpen)
  }, [props.setMenuOpen])

  const onToggleClick = () => {
    playMouseClick()
    setMenuOpen(!isMenuOpen)
  }

  return (
    <Container>
      <ButtonContainer>
        <ToggleBtn checked={isMenuOpen} onClick={onToggleClick} disabled={props.disabled}>
          <ToggleText checked={isMenuOpen}> 𝓲</ToggleText>
        </ToggleBtn>
      </ButtonContainer>
      {shouldMount && (
        <MenuContainer stage={stage}>
          <TextFlexBox>
            <MenuLabel
              style={{ width: '57px' }}
              highlighted={props.textIndex === 0}
              isOpen={isMenuOpen}
            >
              Step 1:
            </MenuLabel>
            <MenuLabel
              style={{ width: '450px' }}
              highlighted={props.textIndex === 0}
              isOpen={isMenuOpen}
            >
              Draw the base of the triangle of given length using a ruler.
            </MenuLabel>
          </TextFlexBox>
          <TextFlexBox>
            <MenuLabel
              style={{ width: '57px' }}
              highlighted={props.textIndex === 1}
              isOpen={isMenuOpen}
            >
              Step 2:
            </MenuLabel>
            <MenuLabel
              style={{ width: '500px' }}
              highlighted={props.textIndex === 1}
              isOpen={isMenuOpen}
            >
              Choose one of the angles and mark it from one end of the base, using a protractor.
            </MenuLabel>
          </TextFlexBox>
          <TextFlexBox>
            <MenuLabel
              style={{ width: '57px' }}
              highlighted={props.textIndex === 2}
              isOpen={isMenuOpen}
            >
              Step 3:
            </MenuLabel>
            <MenuLabel
              style={{ width: '500px' }}
              highlighted={props.textIndex === 2}
              isOpen={isMenuOpen}
            >
              Mark the other angle from the other end of the base, using a protractor.
            </MenuLabel>
          </TextFlexBox>
        </MenuContainer>
      )}
    </Container>
  )
}
