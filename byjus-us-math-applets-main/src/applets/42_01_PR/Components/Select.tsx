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
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 12px;
  gap: 8px;
  width: auto;
  height: 42px;
  background: #81b3ff;
  border-radius: 10px;
  border: none;
  background-color: ${(props) => answerFillColors[props.state]};
  &:disabled {
    background-color: #c7c7c7;
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
  top: 120%;
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
  cursor: pointer;
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
  onBoardAnimCheck: boolean
}

export function Select<T extends ReactNode>({
  options,
  onValueChange,
  state,
  onBoardAnimCheck,
}: SelectProps<T>) {
  const [value, setValue] = useState<T>()
  const [isOpen, setOpen] = useState(false)
  const { shouldMount, stage } = useTransition(isOpen, 350)
  const playMouseClick = useSFX('mouseClick')

  const contentRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (value && onValueChange) {
      onValueChange(value)
    }
  }, [onValueChange, value])

  useEffect(() => {
    if (state === 'default') setValue(undefined)
  }, [state])

  useEffect(() => {
    document.addEventListener('click', (e) => {
      const node = e.target as Node
      if (contentRef.current && !contentRef.current.contains(node)) {
        setOpen(false)
      }
    })
  }, [])

  return (
    <Content
      disabled={onBoardAnimCheck}
      {...{ state }}
      onClick={() => {
        setOpen((open) => !open)
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
              onClick={(e) => {
                playMouseClick()
                setValue(item)
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
