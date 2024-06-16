import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../../contexts/analytics'
import Toggle from '../Toggle/Toggle'
import op1 from './images/Opt01.svg'
import op2 from './images/Opt02.svg'
import op3 from './images/Opt03.svg'
import op4 from './images/Opt04.svg'
import op5 from './images/Opt05.svg'
import op6 from './images/Opt06.svg'
import op7 from './images/Opt07.svg'
import op8 from './images/Opt08.svg'
import op9 from './images/Opt09.svg'
import op10 from './images/Opt10.svg'
import op11 from './images/Opt11.svg'
import { GroupToggleProps } from './ToggleGroup.types'

const OPTION_IMAGES = [op1, op2, op3, op4, op5, op6, op7, op8, op9, op10, op11]

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
  width: 107.1px;
  height: 96px;
  align-self: center;
`
const Arrow = styled.div<{ arrowFace: boolean }>`
  border: solid #444444;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 5px;
  transform: rotate(${(props) => (props.arrowFace ? 135 : -45)}deg);
  margin-left: ${(props) => (props.arrowFace ? 3 : 0)}px;
  margin-right: ${(props) => (props.arrowFace ? 0 : 5)}px;
`
const ArrowButton = styled.button`
  border: none;
  cursor: pointer;
  width: 48px;
  height: 48px;
  background: #f6f6f6;
  border-radius: 100px;
  ${(props) =>
    !props.disabled &&
    `:hover {
      background: #c7c7c7;
  }
    :active ${Arrow} {
      border-color: #ffffff;
  }
  :active {
      background: #444444;
  }`}
  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`
const ToggleGroup: React.FC<GroupToggleProps> = ({ noOfChildren, onChange, disabled }) => {
  const [activeId, setActiveId] = useState(0)
  const [prevActiveId, setPrevActiveId] = useState(0)
  const [leftDisable, setLeftDisable] = useState(true)
  const [rightDisable, setRightDisable] = useState(false)
  const [displayStart, setDisplayStart] = useState(0)
  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')

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
  const onLeftClick = () => {
    onInteraction('tap')
    playClick()
    setDisplayStart((d) => d - 1)
  }
  const onRightClick = () => {
    onInteraction('tap')
    playClick()
    setDisplayStart((d) => d + 1)
  }
  useEffect(() => {
    setLeftDisable(displayStart == 0 ? true : false)
    setRightDisable(displayStart == 7 ? true : false)
  }, [displayStart])
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

  return (
    <ToggleGroupContainer>
      <ArrowButton disabled={leftDisable} onClick={onLeftClick}>
        <Arrow arrowFace={true} />
      </ArrowButton>
      {toggles[displayStart]}
      {toggles[displayStart + 1]}
      {toggles[displayStart + 2]}
      {toggles[displayStart + 3]}
      <ArrowButton disabled={rightDisable} onClick={onRightClick}>
        <Arrow arrowFace={false} />
      </ArrowButton>
    </ToggleGroupContainer>
  )
}

export default ToggleGroup
