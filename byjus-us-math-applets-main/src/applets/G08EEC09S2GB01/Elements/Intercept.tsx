import { FC } from 'react'
import styled from 'styled-components'

import InputField from './InputField'

const Interceptor = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const TextBox = styled.div<{ padding: boolean }>`
  text-align: center;
  color: #666;
  font-size: 24px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  width: 100%;
  padding: ${(props) => (props.padding ? 10 : 0)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CT = styled.div<{ color: string }>`
  color: ${(props) => props.color};
`

const Intercept: FC<{
  answerState: (state: number) => void
  interceptVal: number
  answered: (ans: boolean) => void
}> = ({ interceptVal, answered, answerState }) => {
  return (
    <Interceptor>
      <TextBox padding={false}>
        <CT color="#AA5EE0">y - intercept&nbsp;</CT> =&nbsp;
        <InputField
          text={
            <>
              In, y = mx + b,
              <br />b is the y-intercept.
            </>
          }
          answered={answered}
          answerVal={interceptVal}
          answerState={answerState}
        />
      </TextBox>
    </Interceptor>
  )
}

export default Intercept
