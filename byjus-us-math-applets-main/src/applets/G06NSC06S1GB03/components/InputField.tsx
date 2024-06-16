import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'

export type InputState = 'default' | 'inActive' | 'wrong' | 'locked' | 'correct'

const Input = styled.input<{ state: InputState }>`
  width: 60px;
  height: 50px;
  display: flex;
  text-align: center;
  position: relative;
  border-radius: 10px;
  border: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return '2px solid #CC6666'
      case 'correct':
        return '2px solid #32A66C'
      default:
        return '1px solid #1A1A1A '
    }
  }};
  opacity: ${(a) => (a.state === 'inActive' ? 0.5 : 1)};

  color: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return ' #CC6666'
      case 'correct':
        return '#32A66C'
      default:
        return '#1A1A1A '
    }
  }};
  background: ${(a) => {
    switch (a.state) {
      case 'wrong':
        return ' #fcecf1'
      case 'correct':
        return '#e9ffec'
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

export interface InputProps {
  state: InputState
  onChange: (val: number) => void
  // onClick?: () => void
  placeHolder: string
  max: number
  // errorState: (error: boolean) => void
}

export interface InputRefProps {
  reset: () => void
}

const InputField = forwardRef<InputRefProps, InputProps>(
  ({ placeHolder, onChange, state, max }, ref) => {
    const [value, setValue] = useState<undefined | number>(undefined)
    // const [state, setState] = useState<InputState>('default')

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

      const floatVal = parseInt(val, 10)

      setValue((prevVal) => {
        if (floatVal > max) {
          return prevVal
        } else if (floatVal < max && val.length > 4) {
          return prevVal
        } else {
          // setState('default')
          return floatVal
        }
      })
    }

    useEffect(() => {
      onChange(value ? value : -1)
    }, [value])

    return (
      <>
        <Input
          step="0.01"
          value={value ? value : undefined}
          type="number"
          state={state}
          disabled={state === 'inActive' || state === 'locked' || state === 'correct'}
          onChange={handleChange}
          max={9.9}
          // onClick={onClick}
          placeholder={placeHolder}
        />
      </>
    )
  },
)

export default InputField
