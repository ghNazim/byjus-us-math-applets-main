import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import Toggle from '../Toggle/Toggle'
import { GroupToggleProps } from './ToggleGroup.types'

const ToggleGroupContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: stretch;
  width: 452px;
  height: 120px;
  left: 50%;
  translate: -50%;
  bottom: 200px;
  gap: 13px;
`

const OptionImage = styled.img``

const ToggleGroup: React.FC<GroupToggleProps> = ({ onChange, disabled, images, colorState }) => {
  const [activeId, setActiveId] = useState(-1)
  const [prevActiveId, setPrevActiveId] = useState(-1)
  const onchangeHandle = useCallback((id: number, isSelected: boolean) => {
    if (isSelected) {
      setActiveId(id)
    }
  }, [])

  useEffect(() => {
    if (!disabled) {
      setPrevActiveId(activeId)
      setActiveId(-1)
    }
  }, [disabled])

  useEffect(() => {
    if (onChange) {
      onChange(activeId)
    }
  }, [activeId, onChange])

  const toggles = []
  for (let i = 0; i < images.length; i++) {
    toggles.push(
      <Toggle
        id={i}
        key={i}
        selected={activeId === i}
        highlight={prevActiveId === i}
        onChange={onchangeHandle}
        disabled={disabled}
        colorState={colorState}
      >
        <OptionImage src={images[i]} alt={`toggle-option-${i}`} />
      </Toggle>,
    )
  }

  return <ToggleGroupContainer>{toggles}</ToggleGroupContainer>
}

export default ToggleGroup
