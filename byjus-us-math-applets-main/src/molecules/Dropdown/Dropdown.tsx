import { CSSProperties, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { useContentScale } from '@/atoms/ContentScaler/ContentScaler'
import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { useAppletContainer } from '@/common/AppletContainer/AppletContainer'
import { AnalyticsContext } from '@/contexts/analytics'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useControllableValue } from '@/hooks/useControllableValue'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useSFX } from '@/hooks/useSFX'

import arrow from './arrow.svg'
import { DropdownProps } from './Dropdown.types'
const OuterButton = styled.button<{ state?: 'default' | 'correct' | 'incorrect' }>`
  position: relative;
  min-width: 122px;
  height: 60px;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid
    ${({ state = 'default' }) =>
      state === 'default' ? '#1a1a1a' : state === 'correct' ? '#6CA621' : '#CC6666'};
  background: #ffffff;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`
const ContentDiv = styled.div<{ state?: 'default' | 'correct' | 'incorrect' }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: ${({ state = 'default' }) =>
    state === 'default' ? '#ffffff' : state === 'correct' ? '#ECFFD9' : '#FFF2F2'};
  border-radius: 8px;
`

const Label = styled.div<{ state?: 'default' | 'correct' | 'incorrect' }>`
  padding: 8px;
  position: relative;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: ${({ state = 'default' }) =>
    state === 'default' ? '#1a1a1a' : state === 'correct' ? '#6CA621' : '#CC6666'};
`

const Arrow = styled.div<{ state?: 'default' | 'correct' | 'incorrect' }>`
  position: relative;
  width: 34px;
  height: 50px;
  background: ${({ state = 'default' }) =>
    state === 'default' ? '#1a1a1a' : state === 'correct' ? '#6CA621' : '#CC6666'};
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

const OptionsContainer = styled.div<{
  stage: Stage
  position: 'top' | 'bottom'
  orientation: 'horizontal' | 'vertical'
}>`
  position: absolute;
  translate: -50%;
  display: flex;
  flex-direction: ${(props) => (props.orientation === 'horizontal' ? 'row' : 'column')};
  justify-content: center;
  align-items: center;
  border: none;
  padding: 12px;
  gap: 12px;
  background: #c7c7c7;
  border-radius: 12px;
  opacity: ${(props) => (props.stage !== 'enter' ? 0 : 1)};
  transition: opacity 350ms;
  z-index: 100;
  :before {
    content: '';
    position: absolute;
    left: 50%;
    translate: -50%;
    border: solid 10px transparent;
    ${(props) =>
      props.position === 'top'
        ? 'bottom: -16px;border-top-color: #c7c7c7;'
        : 'top: -16px;border-bottom-color: #c7c7c7;'}
  }
`

const Option = styled.div`
  padding: 8px;
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

function calculateDropdownPosition(
  rect: DOMRect | undefined,
  containerRect: DOMRect | undefined,
  scale: number,
  position: 'top' | 'bottom',
) {
  if (!rect || !containerRect) return { left: 0, top: 0 }

  if (position === 'bottom') {
    const { top, left, width, height } = rect
    const { top: containerTop, left: containerLeft } = containerRect
    const x = (left - containerLeft + width / 2) / scale
    const y = (top - containerTop + height) / scale + 6
    return { left: x, top: y }
  } else {
    const { bottom, left, width, height } = rect
    const { bottom: containerBottom, left: containerLeft } = containerRect
    const x = (left - containerLeft + width / 2) / scale
    const y = -(bottom - containerBottom - height) / scale + 6
    return { left: x, bottom: y }
  }
}

export function Dropdown<T extends ReactNode>({
  dropDownArray,
  listOrientation = 'horizontal',
  position = 'bottom',
  value: controlledValue,
  onValueChange,
  disabled = false,
  checkStatus = 'default',
}: DropdownProps<T>) {
  const [value, setValue] = useControllableValue({
    value: controlledValue,
    defaultValue: -1,
    onChange: (value) => {
      onValueChange?.(value)
      setOpen(false)
    },
  })
  const [isOpen, setOpen] = useState(false)
  const { shouldMount, stage } = useTransition(isOpen, 350)
  const [click, setClick] = useState(false)
  const hasClicked = useHasChanged(click)
  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')

  const clickRef = useClickOutside(() => setOpen(false))
  const positionRef = useRef<HTMLButtonElement>(null)
  const containerRef = useAppletContainer()
  const scale = useContentScale()

  const [style, setStyle] = useState<CSSProperties>({})

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(() => {
      setStyle(
        calculateDropdownPosition(
          positionRef.current?.getBoundingClientRect(),
          containerRef.current?.getBoundingClientRect(),
          scale,
          position,
        ),
      )
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [containerRef, position, scale])

  useEffect(() => {
    if (isOpen) {
      setStyle(
        calculateDropdownPosition(
          positionRef.current?.getBoundingClientRect(),
          containerRef.current?.getBoundingClientRect(),
          scale,
          position,
        ),
      )
    }
  }, [containerRef, isOpen, position, scale])

  return (
    <OuterButton
      state={checkStatus}
      disabled={disabled}
      onClick={() => {
        setOpen((open) => !open)
        setClick(true)
        onInteraction('tap')
        playClick()
      }}
      ref={positionRef}
    >
      <ContentDiv state={checkStatus} ref={clickRef}>
        <Label state={checkStatus}>{dropDownArray[value]}</Label>
        <Arrow state={checkStatus}>
          <img src={arrow} />
        </Arrow>
      </ContentDiv>
      {shouldMount &&
        createPortal(
          <OptionsContainer
            stage={stage}
            style={style}
            position={position}
            orientation={listOrientation}
          >
            {dropDownArray.map((item, i) => (
              <Option
                key={i}
                onClick={(e) => {
                  playClick()
                  setValue(i)
                  e.stopPropagation()
                }}
              >
                {item}
              </Option>
            ))}
          </OptionsContainer>,
          containerRef.current ?? document.body,
        )}
      {!disabled && <DropdownOnboarding complete={hasClicked} />}
    </OuterButton>
  )
}
