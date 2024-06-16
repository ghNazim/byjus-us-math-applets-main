import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../../contexts/analytics'
import { ToggleProps } from './Toggle.types'
const ContainerToggle = styled.div<{ isSelected: boolean; activateToggle: any }>`
  width: 169px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: '#fff';
  box-shadow: ${(props) => (!props.isSelected ? '0px -4px 0px 0px #c7c7c7 inset' : 'none')};
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid ${(props) => (!props.isSelected ? '#C7C7C7' : '#212121')};
`
const HighlightBG = styled.div<{ isSelected: boolean }>`
  width: 163px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isSelected ? '#C7C7C7' : '#fff')};
  border-radius: 6px;
`
const Toggle: React.FC<ToggleProps> = ({
  children,
  id,
  selected = false,
  onChange,
  disabled,
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
    if (!disabled) {
      setIsSelected(true)
      onInteraction('tap')
      playClick()
    }
  }

  return (
    <ContainerToggle isSelected={isSelected} onClick={onClickHandle} activateToggle={!disabled}>
      <HighlightBG isSelected={isSelected}> {children}</HighlightBG>
    </ContainerToggle>
  )
}

export default Toggle
