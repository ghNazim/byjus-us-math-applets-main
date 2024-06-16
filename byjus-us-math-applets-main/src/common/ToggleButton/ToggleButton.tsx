import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../contexts/analytics'
import { ToggleButtonProps } from './ToggleButton.types'

const ContainerToggle = styled.div<{
  isSelected: boolean
  width: number
  height: number
  isImage: boolean
  textColor: string
  highlightColor: string
  answerStates: keyof typeof answerStatebgColors
}>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.isSelected
      ? props.answerStates == 'default'
        ? props.highlightColor
        : answerStatebgColors[props.answerStates]
      : 'none'};
  color: #444444;
  box-shadow: ${(props) =>
    props.isImage ? (props.isSelected ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : 'none') : 'none'};
  border-radius: ${(props) => (props.isImage ? 6 : 10)}px;
  border: ${(props) =>
    props.isImage
      ? 'none'
      : '2px solid ' +
        (props.isSelected
          ? answerStateborderColors[props.answerStates]
          : answerStateborderColors['default'])};
  filter: ${(props) => (props.isImage ? 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' : 'none')};
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
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  children,
  id,
  selected = false,
  onChange,
  disabled,
  highlight = false,
  width,
  height,
  isImage = true,
  textColor = '#ffffff',
  highlightColor,
  colorState = 'default',
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
    if (!disabled) {
      setIsSelected(true)
      onInteraction('tap')
      playClick()
    }
  }

  return (
    <ContainerToggle
      isSelected={highlight}
      onClick={onClickHandle}
      width={width}
      height={height}
      isImage={isImage}
      textColor={textColor}
      highlightColor={highlightColor}
      answerStates={colorState}
    >
      {children}
    </ContainerToggle>
  )
}
