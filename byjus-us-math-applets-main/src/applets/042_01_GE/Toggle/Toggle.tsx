import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../../contexts/analytics'
import { ToggleProps } from './Toggle.types'
const ContainerToggle = styled.div<{ isSelected: boolean; activateToggle: any }>`
  width: 175px;
  height: 147px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isSelected ? '#ffecf2' : 'none')};
  box-shadow: ${(props) => (props.isSelected ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : 'none')};
  border-radius: 6px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  cursor: pointer;
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
    <ContainerToggle isSelected={highlight} onClick={onClickHandle} activateToggle={!disabled}>
      {children}
    </ContainerToggle>
  )
}

export default Toggle
