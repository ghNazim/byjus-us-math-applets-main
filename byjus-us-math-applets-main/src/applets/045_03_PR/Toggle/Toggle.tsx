import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../../contexts/analytics'
import { ToggleProps } from './Toggle.types'
const ContainerToggle = styled.div<{
  isSelected: boolean
  activateToggle: any
  answerStates: keyof typeof answerStatebgColors
}>`
  display: flex;
  justify-content: center;
  background: ${(props) => (props.isSelected ? answerStatebgColors[props.answerStates] : 'none')};
  box-shadow: ${(props) => (props.isSelected ? '0px 10px 15px rgba(84, 141, 227, 0.15)' : 'none')};
  border: 3px solid
    ${(props) => (props.isSelected ? answerStateborderColors[props.answerStates] : '#8C69FF')};
  border-radius: 10px;
  padding: 5px;

  cursor: pointer;
`
const answerStateborderColors = {
  default: '#81B3FF ',
  right: '#85CC29',
  wrong: '#F57A7A',
  disable: '#c7c7c7',
}
const answerStatebgColors = {
  default: '#E8F0FE ',
  right: '#ECFFD9',
  wrong: '#FFF2F2',
  disable: '#c7c7c7',
}

const Toggle: React.FC<ToggleProps> = ({
  children,
  id,
  selected = false,
  onChange,
  disabled,
  colorState = 'default',
  highlight = false,
}) => {
  const [isSelected, setIsSelected] = useState(false)
  useEffect(() => {
    setIsSelected(selected)
  }, [selected])

  useEffect(() => {
    if (onChange) {
      onChange(id, isSelected)
    }
  }, [isSelected, id, onChange])

  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')

  const onClickHandle = () => {
    setIsSelected(true)
    onInteraction('tap')
    playClick()
  }

  return (
    <ContainerToggle
      isSelected={isSelected}
      answerStates={colorState}
      onClick={onClickHandle}
      activateToggle={!disabled}
    >
      {children}
    </ContainerToggle>
  )
}

export default Toggle
