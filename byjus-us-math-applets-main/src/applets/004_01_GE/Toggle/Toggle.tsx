import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../../contexts/analytics'
import { ToggleProps } from './Toggle.types'

const ContainerToggle = styled.div<{ isSelected: boolean; activateToggle: any }>`
  width: 126px;
  height: 130px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: ${(props) =>
    props.isSelected || props.activateToggle
      ? 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) grayscale(0)'
      : 'grayscale(1)'};
  cursor: ${(props) => (props.isSelected || props.activateToggle ? 'pointer' : 'default')};
`
const Toggle: React.FC<ToggleProps> = ({ children, id, selected = false, onChange, disabled }) => {
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
      isSelected ? setIsSelected(false) : setIsSelected(true)
      onInteraction('tap')
      playClick()
    }
  }

  return (
    <ContainerToggle isSelected={isSelected} onClick={onClickHandle} activateToggle={!disabled}>
      {children}
    </ContainerToggle>
  )
}

export default Toggle
