import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'

import Popup, { side } from './Popup'

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

const PopUpWarning = styled.div<{ side: side }>`
  position: absolute !important;
  top: 80px;
  left: ${(a) => (a.side === 'left' ? '112px' : '404px')};
`

export interface InputProps {
  // state: InputState
  onChange: (val: number) => void
  onClick?: () => void
  placeHolder: string
  side: side
  currentValue: string | null
  errorState: (error: boolean) => void
}

export interface InputRefProps {
  reset: () => void
}

const InputField = forwardRef<InputRefProps, InputProps>(
  ({ placeHolder, onChange, onClick, side, currentValue, errorState }, ref) => {
    const [value, setValue] = useState<undefined | number>(undefined)
    const [showError, setShowError] = useState(false)
    const [state, setState] = useState<InputState>('default')

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
        if (floatVal > 2) {
          errorState(true)
          setShowError(true)
          setState('wrong')
          return prevVal
        } else if (floatVal < 2 && val.length > 4) {
          return prevVal
        } else {
          errorState(false)
          setShowError(false)
          setState('default')
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
          disabled={state === 'inActive' || state === 'locked'}
          onChange={handleChange}
          max={9.9}
          onClick={onClick}
          placeholder={placeHolder}
        />
        {showError ? (
          <PopUpWarning side={side}>
            <Popup side={side} />
          </PopUpWarning>
        ) : undefined}
      </>
    )
  },
)

export default InputField
