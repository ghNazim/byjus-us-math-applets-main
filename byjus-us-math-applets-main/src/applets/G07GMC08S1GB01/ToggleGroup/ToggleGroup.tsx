import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import Toggle from '../Toggle/Toggle'
import op1 from './images/house1.svg'
import op2 from './images/house2.svg'
import op3 from './images/house3.svg'
import { GroupToggleProps } from './ToggleGroup.types'

const OPTION_IMAGES = [op1, op2, op3]

const ToggleGroupContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 720px;
  height: 140px;
  bottom: 30px;
  gap: 20px;
`
const OptionImage = styled.img`
  display: flex;
  padding: 4px 11px 4px 4px;
  align-items: center;
  align-self: center;
  border-radius: 12px;
  border: 1px solid var(--interactives-300, #c7c7c7);
`

const ToggleGroup: React.FC<GroupToggleProps> = ({ noOfChildren, onChange, disabled }) => {
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
  for (let i = 0; i < noOfChildren; i++) {
    toggles.push(
      <Toggle
        id={i}
        key={i}
        selected={activeId === i}
        highlight={prevActiveId === i}
        onChange={onchangeHandle}
        disabled={disabled}
      >
        <OptionImage src={OPTION_IMAGES[i]} alt={`toggle-option-${i}`} />
      </Toggle>,
    )
  }

  return <ToggleGroupContainer>{toggles}</ToggleGroupContainer>
}

export default ToggleGroup
