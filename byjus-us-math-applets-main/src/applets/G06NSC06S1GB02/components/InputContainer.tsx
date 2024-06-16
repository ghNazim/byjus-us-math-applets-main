import { FC } from 'react'
import styled from 'styled-components'

import InputField from './InputField'
interface InputContainerProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  onChangeValue1: (value: number) => void
  onChangeValue2: (value: number) => void
}

const Container = styled.div`
  display: flex;
  gap: 4rem;
  width: 100%;
  justify-content: center;
  /* position: ; */
`

const InputContainer: FC<InputContainerProps> = ({ onChangeValue1, onChangeValue2, ...props }) => {
  return (
    <Container className={props.className}>
      <InputField onChange={(val) => onChangeValue1(val)} placeHolder="" state="default" />
      <InputField onChange={(val) => onChangeValue2(val)} placeHolder="" state="default" />
    </Container>
  )
}

export default InputContainer
