import { FC } from 'react'
import styled from 'styled-components'

interface SpanProps {
  criteria1: boolean
  criteria2: boolean
  criteria3: boolean
  leftCoefficient: number
  leftConstant: number
  rightConstant: number
}

const ColoredSpan = styled.span`
  box-sizing: border-box;

  padding: 0 5px;
  background: #ccffdd;

  border: 1px solid #41d98d;
  border-radius: 5px;
  margin: 0 3px;
`

const Div = styled.div`
  border: 0px solid red;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: '#646464';
  padding: 5px 10px;
  text-align: center;

  color: #646464;
  font-size: 24px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  height: 30px;
`

const formatVariable = (a: number) => {
  if (a < 0) return `(${a})`
  else return a
}

export const QuestionElement: FC<SpanProps> = ({
  leftCoefficient,
  leftConstant,
  rightConstant,
  criteria1,
  criteria2,
  criteria3,
}) => {
  return (
    <Div>
      {criteria1 && criteria2 && criteria3 ? (
        <ColoredSpan>
          {leftCoefficient === 1
            ? ''
            : leftCoefficient == -1
            ? '-'
            : formatVariable(leftCoefficient)}
          x{leftConstant > 0 ? ' + ' : ' - '}
          {Math.abs(leftConstant)} = {formatVariable(rightConstant)}
        </ColoredSpan>
      ) : criteria1 && criteria2 && !criteria3 ? (
        <>
          <ColoredSpan>
            {leftCoefficient === 1
              ? ''
              : leftCoefficient == -1
              ? '-'
              : formatVariable(leftCoefficient)}
            x{leftConstant > 0 ? ' + ' : ' - '}
            {Math.abs(leftConstant)}
          </ColoredSpan>{' '}
          = {formatVariable(rightConstant)}
        </>
      ) : criteria1 ? (
        <>
          <ColoredSpan>
            {leftCoefficient === 1
              ? ''
              : leftCoefficient == -1
              ? '-'
              : formatVariable(leftCoefficient)}
            x
          </ColoredSpan>{' '}
          {leftConstant > 0 ? ' + ' : ' - '}
          {Math.abs(leftConstant)} ={' '}
          {criteria3 ? (
            <ColoredSpan>{formatVariable(rightConstant)}</ColoredSpan>
          ) : (
            <>{formatVariable(rightConstant)}</>
          )}
        </>
      ) : criteria2 ? (
        <>
          <ColoredSpan>
            {leftCoefficient === 1
              ? ''
              : leftCoefficient == -1
              ? '-'
              : formatVariable(leftCoefficient)}
            x{leftConstant > 0 ? ' + ' : ' - '}
            {Math.abs(leftConstant)}{' '}
          </ColoredSpan>{' '}
          ={' '}
          {criteria3 ? (
            <ColoredSpan>{formatVariable(rightConstant)}</ColoredSpan>
          ) : (
            <>{formatVariable(rightConstant)}</>
          )}
        </>
      ) : (
        <>
          {leftCoefficient === 1
            ? ''
            : leftCoefficient == -1
            ? '-'
            : formatVariable(leftCoefficient)}
          x{leftConstant > 0 ? ' + ' : ' - '}
          {Math.abs(leftConstant)} ={' '}
          {criteria3 ? (
            <ColoredSpan>{formatVariable(rightConstant)}</ColoredSpan>
          ) : (
            <>{formatVariable(rightConstant)}</>
          )}
        </>
      )}
    </Div>
  )
}
