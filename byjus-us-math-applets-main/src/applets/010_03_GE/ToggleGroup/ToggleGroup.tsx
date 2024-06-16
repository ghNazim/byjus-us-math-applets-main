import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import Toggle from '../Toggle/Toggle'
import op1 from './images/op1.svg'
import op2 from './images/op2.svg'
import op3 from './images/op3.svg'
import op4 from './images/op4.svg'
import op5 from './images/op5.svg'
import op6 from './images/op6.svg'
import { GroupToggleProps } from './ToggleGroup.types'

const OPTION_IMAGES = [op1, op2, op3, op4, op5, op6]

const ToggleGroupContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 720px;
  height: 88px;
  bottom: 55px;
`
const OptionImage = styled.img`
  height: 72px;
  width: 85px;
  align-self: center;
`

const ToggleGroup: React.FC<GroupToggleProps> = ({ noOfChildren, onChange }) => {
  const [activeId, setActiveId] = useState(0)

  const onchangeHandle = useCallback((id: number, isSelected: boolean) => {
    if (isSelected) {
      setActiveId(id)
    }
  }, [])

  useEffect(() => {
    if (onChange) {
      onChange(activeId)
    }
  }, [activeId])

  const toggles = []
  for (let i = 0; i < noOfChildren; i++) {
    toggles.push(
      <Toggle id={i} key={i} selected={activeId === i} onChange={onchangeHandle}>
        <OptionImage src={OPTION_IMAGES[i]} alt={`toggle-option-${i}`} />
      </Toggle>,
    )
  }

  return <ToggleGroupContainer>{toggles}</ToggleGroupContainer>
}

export default ToggleGroup
