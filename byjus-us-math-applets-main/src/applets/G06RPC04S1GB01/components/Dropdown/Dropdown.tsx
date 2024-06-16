import { ReactNode, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AnalyticsContext } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useSFX } from '@/hooks/useSFX'

import arrow from './arrow.svg'
const Content = styled.div<{ disabled: boolean }>`
  position: relative;
  width: 110px;
  height: 60px;
  border: none;
  ${(a) => (a.disabled ? 'opacity: 0.3;pointer-events: none;' : '')}
`
const ContentDiv = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px;
  width: 110px;
  height: 60px;
  background: #fcfafa;
  border: 1px solid #1a1a1a !important;
  border-radius: 12px;
  border: none;
  cursor: pointer;
`

const Label = styled.div`
  position: relative;
  width: 68px;
  height: 52px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #1a1a1a;
`

const Arrow = styled.div`
  position: relative;
  width: 36px;
  height: 52px;
  background: #1a1a1a;
  border-radius: 0px 8px 8px 0px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
`

const OptionsContainer = styled.button<{ left: number; stage: Stage }>`
  position: absolute;
  top: 120%;
  left: ${(a) => a.left}%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  padding: 12px;
  gap: 12px;
  background: #c7c7c7;
  border-radius: 12px;
  opacity: ${(props) => (props.stage !== 'enter' ? 0 : 1)};
  transition: opacity 350ms;
  :before {
    content: '';
    position: absolute;
    top: -16px;
    left: ${(a) => (100 - a.left > 80 ? 80 : a.left)}%;
    translate: -50%;
    z-index: 1;
    border: solid 10px transparent;
    border-bottom-color: #c7c7c7;
  }
`

const Option = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  padding: 8px;
  gap: 10px;
  background: #ffffff;
  border-radius: 8px;
  border: none;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  color: #646464;
  cursor: pointer;
  &:disabled {
    cursor: none;
  }
  &:hover:not([disabled]) {
    background: #1a1a1a;
    color: #ffffff;
  }
  &:active:not([disabled]) {
    background: #1a1a1a;
    color: #ffffff;
  }
`
const DropdownOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: -20px;
  left: 15px;
  pointer-events: none;
`

export interface DropdownProps<T extends ReactNode> {
  dropDownArray: readonly T[]
  onValueChange?: (value: T) => void
  disabled?: boolean
  move?: boolean
}

// export interface DropDownPropsNew<T extends ReactNode> extends DropdownProps<T> {
//   move?: boolean
// }

export function Dropdown<T extends ReactNode>({
  dropDownArray,
  onValueChange,
  disabled = false,
  move,
}: DropdownProps<T>) {
  const [value, setValue] = useState<T>()
  const [isOpen, setOpen] = useState(false)
  const { shouldMount, stage } = useTransition(isOpen, 350)
  const [click, setClick] = useState(false)
  const hasClicked = useHasChanged(click)
  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')
  useEffect(() => {
    if (value && onValueChange) {
      onValueChange(value)
      // setOpen((open) => !open)
    }
  }, [onValueChange, value])

  return (
    <Content disabled={disabled}>
      <ContentDiv
        onClick={() => {
          setOpen((open) => !open)
          setClick(true)
          onInteraction('tap')
          playClick()
        }}
      >
        <Label>{value ? value : ''}</Label>
        <Arrow>
          <img src={arrow} />
        </Arrow>
      </ContentDiv>
      {shouldMount && (
        <OptionsContainer {...{ stage }} left={move ? 0 : 50}>
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
        </OptionsContainer>
      )}
      {!disabled && (
        <OnboardingController>
          <OnboardingStep index={0}>
            <DropdownOnboarding complete={hasClicked} />
          </OnboardingStep>
        </OnboardingController>
      )}
    </Content>
  )
}
