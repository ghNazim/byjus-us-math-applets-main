import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { useSFX } from '@/hooks/useSFX'

const answerFillColors = {
  default: '#81B3FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  disable: '#c7c7c7',
}

const Content = styled.button<{ state: keyof typeof answerFillColors }>`
  position: absolute;
  top: 551px;
  left: 455px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  gap: 8px;
  width: 90px;
  height: 42px;
  background: #81b3ff;
  border-radius: 10px;
  border: none;
  background-color: ${(props) => answerFillColors[props.state]};
  &:disabled {
    background-color: ${(props) => answerFillColors[props.state]};
  }
`

const Label = styled.p`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 141.4%;
  color: #ffffff;
`

const OptionsContainer = styled.button<{ stage: Stage }>`
  position: absolute;
  top: 130%;
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
interface SelectProps<T extends ReactNode> {
  options: readonly T[]
  onValueChange?: (value: T) => void
  state: keyof typeof answerFillColors
  disabled: boolean
  isOpen: boolean
  toggleDropdown: () => void
}

export function Select<T extends ReactNode>({
  options,
  onValueChange,
  state,
  disabled: disableInput,
  isOpen,
  toggleDropdown,
}: SelectProps<T>) {
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
    <Content
      disabled={disableInput}
      {...{ state }}
      onClick={() => {
        playMouseClick()
        toggleDropdown()
      }}
      ref={contentRef}
    >
      <Label>{value ? value : '?'}</Label>
      <Label>{isOpen ? '▴' : '▾'}</Label>
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
    </Content>
  )
}
