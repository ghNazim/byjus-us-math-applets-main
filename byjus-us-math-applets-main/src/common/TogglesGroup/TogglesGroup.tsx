import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import handClick from '../handAnimations/click.json'
import { ToggleButton } from '../ToggleButton/ToggleButton'
import { TogglesGroupProps } from './TogglesGroup.types'
const ToggleGroupContainer = styled.div<{
  isHorizontal: boolean
  left: number
  top: number
  width: number
  height: number
}>`
  position: absolute;
  display: flex;
  flex-direction: ${(props) => (props.isHorizontal ? 'row' : 'column')};
  justify-content: space-evenly;
  align-items: center;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  gap: 20px;
`
const OptionImage = styled.img`
  align-self: center;
`
const OptionText = styled.div`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`
const LottiePlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  pointer-events: none;
  translate: -50%;
`
export const TogglesGroup: React.FC<TogglesGroupProps> = ({
  optionArray,
  onChange,
  disabled,
  initialActive = -1,
  childDimensions,
  dimensions = { width: 720, height: 140 },
  position = { left: 0, top: 610 },
  isImage = true,
  isHorizontal = true,
  textColor,
  highlightColor,
  showOnBoarding = true,
  colorState = 'default',
}) => {
  const [activeId, setActiveId] = useState(initialActive)
  const [prevActiveId, setPrevActiveId] = useState(initialActive)
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
  for (let i = 0; i < optionArray.length; i++) {
    toggles.push(
      <ToggleButton
        id={i}
        key={i}
        selected={activeId === i}
        highlight={prevActiveId === i}
        onChange={onchangeHandle}
        disabled={disabled}
        width={childDimensions.width}
        height={childDimensions.height}
        isImage={isImage}
        textColor={textColor}
        highlightColor={highlightColor}
        colorState={colorState}
      >
        {isImage && (
          <OptionImage
            src={optionArray[i]}
            alt={`toggle-option-${i}`}
            width={childDimensions.width}
            height={childDimensions.height}
          />
        )}
        {!isImage && <OptionText>{optionArray[i]}</OptionText>}
      </ToggleButton>,
    )
  }

  return (
    <>
      <ToggleGroupContainer
        isHorizontal={isHorizontal}
        left={position.left}
        top={position.top}
        width={dimensions.width}
        height={dimensions.height}
      >
        {toggles}
      </ToggleGroupContainer>
      {showOnBoarding && (
        <LottiePlayer
          src={handClick}
          autoplay
          loop
          left={position.left + childDimensions.width / 2}
          top={position.top + childDimensions.height / 2}
        />
      )}
    </>
  )
}
