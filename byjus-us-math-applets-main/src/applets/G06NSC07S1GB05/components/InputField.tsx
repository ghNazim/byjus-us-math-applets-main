import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'

export type InputState = 'default' | 'inActive' | 'wrong' | 'locked' | 'correct'

const Input = styled.input<{ state: InputState }>`
  width: 80px;
  height: 55px;
  display: flex;
  text-align: center;
  border-radius: 10px;
  border: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return '1px solid #CC6666'
      case 'correct':
        return '1px solid #85CC29'
      default:
        return '1px solid #6595DE '
    }
  }};
  opacity: ${(a) => (a.state === 'inActive' ? 0.5 : 1)};
  /* opacity: ; */

  color: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return ' #CC6666'
      case 'correct':
        return ' #85CC29'
      default:
        return '#6595DE '
    }
  }};

  font-size: 36px;
  padding: 5px;

  :focus {
    outline: none;
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export interface InputProps {
  state: InputState
  onChange: (val: number) => void
  onClick?: () => void
}

export interface InputRefProps {
  reset: () => void
}

const InputField = forwardRef<InputRefProps, InputProps>(({ state, onChange, onClick }, ref) => {
  const [value, setValue] = useState(0)

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        setValue(0)
      },
    }),
    [],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const floatVal = parseFloat(val)

    setValue((prev) => (floatVal > 99 ? prev : floatVal))
  }

  useEffect(() => {
    onChange(value)
  }, [value])

  return (
    <>
      <Input
        step="1"
        value={value === 0 ? NaN : value}
        type="number"
        state={state}
        disabled={state === 'inActive' || state === 'locked'}
        onChange={handleChange}
        max={9.9}
        onClick={onClick}
      />
    </>
  )
})

export default InputField
