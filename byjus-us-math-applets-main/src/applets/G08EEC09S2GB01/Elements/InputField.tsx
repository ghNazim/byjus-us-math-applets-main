import React, { FC, ReactElement, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { defaultBlock, greenBlock, IColorBlock, redBlock } from './Elements'

const scaleUp = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`

const SpeachBubble = styled.div`
  position: absolute;
  background: #fff;
  border-radius: 10px;
  padding: 5px;
  width: 280px;
  height: 70px;
  color: #444;
  margin: 20px;
  left: -50px;
  transform-origin: 25% -50%;
  animation: ${scaleUp} 0.5s forwards;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 400;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    bottom: 65px;
    left: 50px;
    border-width: 20px 20px 0;
    border-style: solid;
    border-color: #fff transparent;
    display: block;
    width: 0;
    transform: rotate(180deg);
    z-index: 10;
  }

  &::after {
    content: '';
    position: absolute;
    right: -10px;
    bottom: -16px;
    width: 20px;
    height: 20px;
    background: url('./assets/Exclamation.svg') no-repeat center center;
    background-size: contain;
    transform: translateY(-50%);
  }
`

const EntryField = styled.input<{
  state: number
  wrongBlock: IColorBlock
  rightBlock: IColorBlock
  defaultBlock: IColorBlock
}>`
  width: 88px;
  height: 60px;
  border-radius: 12px;
  border-color: '#646464';
  border-width: 1px;

  border-color: ${(props) =>
    props.state === 2
      ? props.defaultBlock.primary
      : props.state === 0
      ? props.wrongBlock.primary
      : props.rightBlock.primary};

  background-color: ${(props) =>
    props.state === 2
      ? props.defaultBlock.secondary
      : props.state === 0
      ? props.wrongBlock.secondary
      : props.rightBlock.secondary};

  text-align: center;
  color: #666;
  font-size: 24px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;

  :focus {
    outline: none;
    border: 2px solid
      ${(props) =>
        props.state === 2
          ? props.defaultBlock.primary
          : props.state === 0
          ? props.wrongBlock.primary
          : props.rightBlock.primary} !important;
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* -moz-appearance: textfield; */
`

const SpeechBubble: FC<{ text: ReactElement }> = ({ text }) => {
  return <SpeachBubble>{text}</SpeachBubble>
}

const Input: FC<{ stateInt: number; input: (n: number) => void }> = ({ input, stateInt = 2 }) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    // Parse the value as a number and pass it to the input function
    input(parseFloat(value))
  }, [value, input]) // Depend on value and input

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <EntryField
      state={stateInt}
      rightBlock={greenBlock}
      wrongBlock={redBlock}
      defaultBlock={defaultBlock}
      type="number"
      value={value}
      onChange={handleChange}
    />
  )
}

const InputHolder = styled.div`
  position: relative;
`

const InputField: FC<{
  text: ReactElement
  answerVal: number
  answered: (ans: boolean) => void
  answerState: (state: number) => void
}> = ({ answerVal: interceptVal, answered, text, answerState }) => {
  const [inputVal, setInputVal] = useState(0)
  const [stateInt, setStateInt] = useState(2)

  useEffect(() => {
    if (Number.isNaN(inputVal)) return
    else if (inputVal === 0) setStateInt(0)
    else if (inputVal != 0) {
      if (inputVal != interceptVal) setStateInt(0)
      else if (inputVal === interceptVal) setStateInt(1)
    }
  }, [inputVal])

  useEffect(() => {
    if (typeof answerState === 'function') {
      answerState(stateInt)
    }
  }, [stateInt])

  const handleInput = (n: number) => {
    setInputVal(n)
  }

  useEffect(() => {
    if (Number.isNaN(inputVal) || inputVal === 0) {
      setStateInt(2)
      answered(false)
    }
    if (inputVal != interceptVal) {
      answered(false)
    } else answered(true)
  }, [inputVal])

  return (
    <InputHolder>
      <Input stateInt={stateInt} input={handleInput} />
      {inputVal != interceptVal && !Number.isNaN(inputVal) ? <SpeechBubble text={text} /> : null}
    </InputHolder>
  )
}

export default InputField

export const InputFieldNonStrict: FC<{
  showBanner: boolean
  stateInt: number
  text: ReactElement
  answerVal: number
  answered: (val: number) => void
  answerState: (state: number) => void
}> = ({ answerVal: interceptVal, answered, text, answerState, showBanner, stateInt }) => {
  const [inputVal, setInputVal] = useState(0)
  // const [stateInt, setStateInt] = useState(2)

  useEffect(() => {
    if (Number.isNaN(inputVal)) return
    else if (inputVal != 0) {
      // if (inputVal != interceptVal) setStateInt(0)
      // else if (inputVal === interceptVal) setStateInt(1)
    }
  }, [inputVal])

  useEffect(() => {
    if (typeof answerState === 'function') {
      answerState(stateInt)
    }
  }, [stateInt])

  const handleInput = (n: number) => {
    setInputVal(n)
  }

  useEffect(() => {
    if (Number.isNaN(inputVal) || inputVal === 0) {
      // setStateInt(2)
      answered(inputVal)
    }
    if (inputVal != interceptVal) {
      answered(inputVal)
    } else answered(inputVal)
  }, [inputVal])

  return (
    <InputHolder>
      <Input stateInt={stateInt} input={handleInput} />
      {showBanner ? <SpeechBubble text={text} /> : null}
    </InputHolder>
  )
}
