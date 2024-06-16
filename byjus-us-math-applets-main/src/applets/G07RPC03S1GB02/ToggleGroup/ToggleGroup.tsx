import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import Toggle from '../Toggle/Toggle'
import no from './images/no.svg'
import yes from './images/yes.svg'
import { GroupToggleProps } from './ToggleGroup.types'

const OPTION_IMAGES = [yes, no]

const ToggleGroupContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 720px;
  height: 140px;
  bottom: 100px;
  gap: 20px;
  left: 50%;
  translate: -50%;
`
const OptionImage = styled.img`
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
