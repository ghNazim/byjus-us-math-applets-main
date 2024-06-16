import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AnalyticsContext } from '../../../contexts/analytics'
import { ToggleProps } from './Toggle.types'

const ContainerToggle = styled.div<{ isSelected: boolean }>`
  width: 100px;
  height: 90px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isSelected ? 'rgba(209, 247, 255, 1)' : 'white')};
  cursor: pointer;
`
// @ts-nocheck
const Toggle: React.FC<ToggleProps> = ({ children, id, selected = false, onChange }) => {
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

  const onClickHandle = () => {
    isSelected ? setIsSelected(false) : setIsSelected(true)
    onInteraction('tap')
  }

  return (
    <ContainerToggle isSelected={isSelected} onClick={onClickHandle}>
      {children}
    </ContainerToggle>
  )
}

export default Toggle
