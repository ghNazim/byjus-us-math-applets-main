import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import Toggle from '../Toggle/Toggle'
import op1 from './images/opt1.svg'
import op2 from './images/opt2.svg'
import op3 from './images/opt3.svg'
import op4 from './images/opt4.svg'
import { GroupToggleProps } from './ToggleGroup.types'

const OPTION_IMAGES = [op1, op2, op3, op4]

const ToggleGroupContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 720px;
  height: 140px;
  bottom: 155px;
  gap: 20px;
`
const OptionImage = styled.img`
  height: 129px;
  width: 126px;
  align-self: center;
`

const ToggleGroup: React.FC<GroupToggleProps> = ({ noOfChildren, onChange, disabled }) => {
  const [activeId, setActiveId] = useState(-1)
  // const [allTogglesActive, setAllTogglesActive] = useState(activateToggles)

  const onchangeHandle = useCallback((id: number, isSelected: boolean) => {
    if (isSelected) {
      setActiveId(id)
    }
  }, [])

  useEffect(() => {
    if (!disabled) setActiveId(-1)
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
