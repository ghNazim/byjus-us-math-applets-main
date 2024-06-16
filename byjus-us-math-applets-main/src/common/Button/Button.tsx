import React, { useContext } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../contexts/analytics'
import mouseClick from '../sfx/mouseClick.mp3'
import tryNew from './Assets/tryNew.svg'
import { ButtonProps } from './Button.types'
const ButtonElement = styled.button<{ color?: string }>`
  position: absolute;
  width: 160px;
  height: 60px;
  left: 50%;
  translate: -50%;
  bottom: 32px;
  border: none;
  background: ${(props) => props.color || '#8c69ff'};
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 42px;
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
    background: ${(props) => props.color || '#7f5cf4'};
  }
  &:active {
    background: ${(props) => props.color || '#6549c2'};
  }
`
export const Button: React.FC<ButtonProps> = ({ disable = false, onClick, type, color }) => {
  const playMouseClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  return (
    <ButtonElement
      disabled={disable}
      onClick={() => {
        onClick()
        playMouseClick()
        onInteraction('tap')
      }}
      color={color}
    >
      {type == 'check' && 'Check'}
      {type == 'tryNew' && <img src={tryNew} />}
    </ButtonElement>
  )
}
