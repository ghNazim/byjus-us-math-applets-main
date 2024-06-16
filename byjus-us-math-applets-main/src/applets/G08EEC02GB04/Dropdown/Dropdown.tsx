import { ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useHasChanged } from '@/hooks/useHasChanged'

import { DropdownProps } from './Dropdown.types'
import { PagePalette } from './PagePalette'

const Content = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;
  width: auto;
  height: 30px;
  background: #81b3ff;
  border-radius: 10px;
  border: none;
  background-color: #1cb9d9;
  &:disabled {
    background-color: #777777;
  }
`
const Label = styled.p`
  position: relative;
  left: 6px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 141.4%;
  color: #ffffff;
`
const OptionsContainer = styled.div<{ stage: Stage }>`
  position: absolute;
  top: 150%;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 12px;
  background: #e8f0fe;
  border: none;
  border-radius: 12px;
  opacity: ${(props) => (props.stage !== 'enter' ? 0 : 1)};
  transition: opacity 350ms;
`
const Option = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 11px 24px;
  background: #ffffff;
  border-radius: 10px;
  border: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 141.4%;
  color: #81b3ff;
  &:disabled {
    cursor: none;
    background-color: #e8e1ff;
  }

  &:hover:not([disabled]) {
    background-color: #7f5cf4;
    color: #ddd3ff;
  }

  &:active:not([disabled]) {
    background-color: #6549c2;
    color: #ddd3ff;
  }
`
const DropdownOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })<{
  isVisible: boolean
}>`
  position: absolute;
  top: -40px;
  left: -50px;
  pointer-events: none;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
`

export function Dropdown<T extends ReactNode>({
  dropDownArray,
  onValueChange,
  disabled,
}: DropdownProps<T>) {
  const [value, setValue] = useState<T>()
  const [isOpen, setOpen] = useState(false)
  const { shouldMount, stage } = useTransition(isOpen, 350)
  const [click, setClick] = useState(false)
  const hasClicked = useHasChanged(click)
  const contentRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (value && onValueChange) onValueChange(value)
  }, [onValueChange, value])

  return (
    <Content
      disabled={disabled}
      onClick={() => {
        setOpen((open) => !open)
        setClick(true)
      }}
      ref={contentRef}
    >
      <Label>{value ? value : '?'}</Label>
      <Label>{isOpen ? '▴' : '▾'}</Label>
      {shouldMount && (
        <OptionsContainer stage={stage}>
          <PagePalette elementsPerPage={3}>
            {dropDownArray.map((item, i) => (
              <Option
                key={i}
                onClick={() => {
                  setValue(item)
                  setOpen(false)
                }}
              >
                {item}
              </Option>
            ))}
          </PagePalette>
        </OptionsContainer>
      )}
      <OnboardingController>
        <OnboardingStep index={0}>
          <DropdownOnboarding complete={hasClicked} isVisible={!disabled} />
        </OnboardingStep>
      </OnboardingController>
    </Content>
  )
}
