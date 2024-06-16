import { ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { useSFX } from '@/hooks/useSFX'

import dropDownMenu from './Asset/dropDown.svg'
import { DropdownProps } from './Dropdown.types'
import { PagePalette } from './PagePalette'

const Content = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 122px;
  height: 60px;
  border-radius: 12px;
  border: 1px solid var(--interactives-090, #1a1a1a);
  background: var(--interactives-500, #fff);

  &:disabled {
    background-color: #777777;
  }
`
const DropDown = styled.img`
  position: relative;
  left: 3px;
  cursor: pointer;
  scale: 0.95;
  transition: 0.3s ease-out;
  filter: drop-shadow(0 0 0.1rem var(--interactives-090, #1a1a1a));
  &:hover {
    cursor: pointer;
    scale: 1.01;
  }
  &:active {
    scale: 0.95;
  }
`
const Label = styled.p`
  position: relative;
  left: -30px;
  color: var(--interactives-090, #1a1a1a);
  text-align: center;
  font-family: 'Nunito';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
`
const OptionsContainer = styled.div<{ stage: Stage; position: 'top' | 'bottom' | undefined }>`
  position: absolute;
  top: ${(props) => (props.position === 'bottom' ? '110%' : '-140%')};
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 12px;
  background: #c7c7c7;
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
  color: #646464;
  &:hover:not([disabled]) {
    background-color: #1a1a1a;
    color: #ffffff;
  }
`

export function Dropdown<T extends ReactNode>({
  dropDownArray,
  onValueChange,
  disabled,
  menuPosition,
}: DropdownProps<T>) {
  const [value, setValue] = useState<T>()
  const [isOpen, setOpen] = useState(false)
  const { shouldMount, stage } = useTransition(isOpen, 350)

  const playMouseCLick = useSFX('mouseClick')

  useEffect(() => {
    if (value && onValueChange) onValueChange(value)
  }, [onValueChange, value])

  return (
    <Content disabled={disabled}>
      <button
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          background: 'transparent',
          border: 'none',
          zIndex: 1,
        }}
        onClick={() => {
          playMouseCLick()
          setOpen((open) => !open)
        }}
      />
      <Label>{value ? value : '?'}</Label>
      {shouldMount && (
        <OptionsContainer stage={stage} position={menuPosition}>
          <PagePalette elementsPerPage={3}>
            {dropDownArray.map((item, i) => (
              <Option
                key={i}
                onClick={() => {
                  playMouseCLick()
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
      <DropDown
        src={dropDownMenu}
        onClick={() => {
          playMouseCLick()
          setOpen((open) => !open)
        }}
      ></DropDown>
    </Content>
  )
}
