import React, { forwardRef, useImperativeHandle } from 'react'
import styled from 'styled-components'

import { useControllableValue } from '@/hooks/useControllableValue'

export type InputState = 'default' | 'inActive' | 'wrong' | 'locked'

const Input = styled.input<{ state: InputState }>`
  width: 100px;
  height: 70px;
  display: flex;
  text-align: center;
  position: relative;
  border-radius: 10px;
  border: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return '2px solid #CC6666'
      default:
        return '1px solid #1A1A1A '
    }
  }};
  opacity: ${(a) => (a.state === 'inActive' ? 0.5 : 1)};

  color: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return ' #CC6666'
      default:
        return '#1A1A1A '
    }
  }};
  background: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return ' #fcecf1'
      default:
        return '#fff '
    }
  }};

  font-size: 24px;
  padding: 5px;

  :focus {
    outline: none;
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::placeholder {
    opacity: 0.4;
  }
`

interface InputProps {
  onChange: (val: string) => void
  onClick?: () => void
  placeHolder: string
  currentValue?: string
  errorState: boolean
}
export interface InputRefProps {
  reset: () => void
}

// InputField.tsx
// ...

const InputField = forwardRef<InputRefProps, InputProps>(
  ({ placeHolder, onChange, onClick, currentValue, errorState }, ref) => {
    const [value, setValue] = useControllableValue<string>({
      value: currentValue,
      defaultValue: '',
      onChange,
    })

    useImperativeHandle(
      ref,
      () => ({
        reset() {
          setValue('')
        },
      }),
      [setValue],
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setValue(val)
    }

    return (
      <Input
        step="0.01"
        value={value !== undefined ? value : ''}
        type="number"
        state={errorState ? 'wrong' : 'default'}
        onChange={handleChange}
        max={9.9}
        onClick={onClick}
        placeholder={placeHolder}
      />
    )
  },
)

export default InputField
