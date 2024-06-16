import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'

// import Popup, { side } from './Popup'

export type InputState = 'default' | 'inActive' | 'wrong' | 'locked' | 'correct'

const Input = styled.input<{ state: InputState }>`
  width: 70%;
  height: 85%;
  display: flex;
  text-align: center;
  border-radius: 10px;
  border: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return '1px solid #CC6666'
      case 'correct':
        return '1px solid #76a528'
      default:
        return '1px solid #1a1a1a '
    }
  }};
  opacity: ${(a) => (a.state === 'inActive' || a.state === 'locked' ? 0.5 : 1)};
  /* opacity: ; */

  color: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return ' #CC6666'
      case 'correct':
        return '#76a528'
      default:
        return '#1a1a1a '
    }
  }};

  background-color: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return ' #fdf2f2'
      case 'correct':
        return '#effeda'
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

    setValue((prevVal) => {
      if (floatVal > 99 || (floatVal < 99 && val.length > 3)) {
        return prevVal
      } else {
        return floatVal
      }
    })
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
        disabled={state === 'inActive' || state === 'locked' || state === 'correct'}
        onChange={handleChange}
        max={9.9}
        onClick={onClick}
      />
    </>
  )
})

export default InputField
