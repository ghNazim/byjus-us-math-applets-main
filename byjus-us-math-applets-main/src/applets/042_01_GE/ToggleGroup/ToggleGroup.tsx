import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import Toggle from '../Toggle/Toggle'
import op1 from './images/Camera.png'
import op3 from './images/House.png'
import op2 from './images/Rocket.png'
import { GroupToggleProps } from './ToggleGroup.types'

const OPTION_IMAGES = [op1, op2, op3]

const ToggleGroupContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 720px;
  height: 140px;
  bottom: 30px;
  gap: 20px;
`
const OptionImage = styled.img`
  height: 147px;
  width: 175px;
  align-self: center;
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
