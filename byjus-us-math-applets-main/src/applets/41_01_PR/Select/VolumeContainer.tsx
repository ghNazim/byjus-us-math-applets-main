import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { useSFX } from '@/hooks/useSFX'

const AnswerInputContainer = styled.div`
  position: absolute;
  top: 530px;
  left: 165px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  cursor: pointer;
`
const AnswerInputLabel = styled.p`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: #646464;
`
const answerStateColors = {
  default: '#81B3FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  disable: '#85CC29',
}
const answerFillColors = {
  default: ' rgba(232, 240, 254, 0.1)',
  right: 'rgba(133, 204, 41, 0.1)',
  wrong: 'rgba(245, 122, 122, 0.1)',
  disable: 'rgba(133, 204, 41, 0.1)',
}
const AnswerInputBorder = styled.button<{ state: keyof typeof answerStateColors }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 13px 8px 13px 36px;
  gap: 8px;
  position: absolute;
  width: 210px;
  height: 60px;
  top: 12px;
  left: 180px;
  border: 3px solid ${(props) => answerStateColors[props.state]};
  background-color: ${(props) => answerFillColors[props.state]};
  box-shadow: 0px 10px 15px rgba(84, 141, 227, 0.15);
  border-radius: 15px;
  &:disabled {
    background-color: ${(props) => answerFillColors[props.state]};
  }
`
const Label = styled.p<{ state: keyof typeof answerStateColors }>`
  position: absolute;
  left: 30px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 141.4%;
  color: ${(props) => answerStateColors[props.state]};
`

const OptionsContainer = styled.button<{ stage: Stage }>`
  position: absolute;
  top: 110%;
  left: 35%;
  translate: -50%;
  max-height: 68px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px;
  gap: 6px;
  background: #e8f0fe;
  border: #81b3ff !important;
  border-radius: 15px;
  opacity: ${(props) => (props.stage !== 'enter' ? 0 : 1)};
  transition: opacity 350ms;
`
const Option = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 11px 24px;
  background: #ffffff;
  border-radius: 10px;
  border: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 141.4%;
  color: #81b3ff;
`

interface SelectVolumeProps<T extends ReactNode> {
  options: readonly T[]
  onValueChange?: (value: T) => void
  state: keyof typeof answerFillColors
  disabled: boolean
  isOpen: boolean
  toggleDropdown: () => void
}

export function SelectVolume<T extends ReactNode>({
  options,
  onValueChange,
  state,
  disabled: disableInput,
  isOpen,
  toggleDropdown,
}: SelectVolumeProps<T>) {
  const playMouseClick = useSFX('mouseClick')
  const [value, setValue] = useState<T>()
  const { shouldMount, stage } = useTransition(isOpen, 350)

  const contentRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (value && onValueChange) onValueChange(value)
  }, [onValueChange, value])

  useEffect(() => {
    if (state === 'default') setValue(undefined)
  }, [state])

  return (
    <AnswerInputContainer>
      <AnswerInputLabel>Volume of air =</AnswerInputLabel>
      <AnswerInputBorder
        disabled={disableInput}
        {...{ state }}
        onClick={() => {
          playMouseClick()
          toggleDropdown()
        }}
        ref={contentRef}
      >
        ?<Label {...{ state }}>{value ? value : '?'}</Label>
        {shouldMount && (
          <OptionsContainer {...{ stage }}>
            {options.map((item, i) => (
              <Option
                key={i}
                onClick={() => {
                  playMouseClick()
                  setValue(item)
                  toggleDropdown()
                }}
              >
                {item}
              </Option>
            ))}
          </OptionsContainer>
        )}
      </AnswerInputBorder>
    </AnswerInputContainer>
  )
}
