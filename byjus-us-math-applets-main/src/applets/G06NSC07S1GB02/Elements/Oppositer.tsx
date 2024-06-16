import React, { FC, ReactElement, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { IColorBlock, orangeBlock } from '@/applets/G08EEC07S1GB01/assets/Elements'
import { greenBlock, redBlock } from '@/applets/G08EEC09S2GB01/Elements/Elements'

const TextBox = styled.span`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 40px;
  color: #444444;
`

const ColoredText = styled.span<{ colorBlock: IColorBlock }>`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 40px;

  padding: 2px 15px;
  border-radius: 8px;

  color: ${(props) => props.colorBlock?.primary};
  background-color: ${(props) => props.colorBlock?.secondary};
`

const TextHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const EntryField = styled.input<{
  state: number
  wrongBlock: IColorBlock
  rightBlock: IColorBlock
  defaultBlock: IColorBlock
}>`
  width: 60px;
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
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 40px;

  color: #444;

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

const defaultBlock: IColorBlock = {
  primary: '#444',
  secondary: '#FFFFFF',
}

const purpleBlock: IColorBlock = {
  primary: '#fff',
  secondary: '#AA5EE0',
}

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
  left: 350px;
  top: 265px;
  transform-origin: 55% -20%;
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
    left: 140px;
    border-width: 20px 20px 0;
    border-style: solid;
    border-color: #fff transparent;
    display: block;
    width: 0;
    transform: rotate(180deg);
    z-index: 10;
  }

  &::after {
    content: '!';
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: -10px;
    bottom: -18px;
    width: 25px;
    height: 25px;
    border-radius: 25px;
    background-color: white;
    border: #000 solid 1px;
    transform: translateY(-50%);
  }
`

const SpeechBubble: FC<{ text: ReactElement }> = ({ text }) => {
  return <SpeachBubble>{text}</SpeachBubble>
}

const speechBubbleText = (
  <>
    Remember to change the sign
    <br />
    and keep the same value.
  </>
)

const Oppositer: FC<{
  question: number
  onChange: (answer: boolean) => void
  disabled: boolean
}> = ({ question, onChange, disabled = false }) => {
  const [inputVal, setInputVal] = useState(NaN)
  const [currentState, setCurrentState] = useState(2)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') setInputVal(NaN)
    else setInputVal(+event.target.value)
  }

  useEffect(() => {
    if (Number.isNaN(inputVal)) {
      onChange(false)
      setCurrentState(2)
    } else {
      if (inputVal * -1 === question) {
        setCurrentState(1)
        onChange(true)
      } else {
        setCurrentState(0)
        onChange(false)
      }
    }
  }, [inputVal, question])

  return (
    <TextHolder>
      <TextBox>
        Opposite number of&nbsp;&nbsp;
        <ColoredText colorBlock={orangeBlock}>{question}</ColoredText>
        &nbsp;&nbsp;is&nbsp;
      </TextBox>
      <EntryField
        disabled={disabled}
        type="number"
        state={currentState}
        wrongBlock={redBlock}
        rightBlock={greenBlock}
        defaultBlock={defaultBlock}
        onChange={handleChange}
      />
      {currentState === 0 ? <SpeechBubble text={speechBubbleText} /> : null}
    </TextHolder>
  )
}

export const OppositeDisplay: FC<{
  question: number
}> = ({ question }) => {
  return (
    <TextHolder>
      <TextBox>
        Opposite number of&nbsp;&nbsp;
        <ColoredText colorBlock={orangeBlock}>{question}</ColoredText>
        &nbsp;&nbsp;is&nbsp;
        <ColoredText colorBlock={purpleBlock}>{question * -1}</ColoredText>
      </TextBox>
    </TextHolder>
  )
}

export default Oppositer
