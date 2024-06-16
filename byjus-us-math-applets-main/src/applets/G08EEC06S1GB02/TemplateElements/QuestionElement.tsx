import { FC } from 'react'
import styled from 'styled-components'

interface SpanProps {
  variable: string
  criteria1: boolean
  criteria2: boolean
  criteria3: boolean
  criteria4: boolean
  leftCoefficient: number
  leftConstant: number
  rightCoefficient: number
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

const formatCoefficient = (a: number, v: string) => {
  if (a === 1) return v
  if (a === 0) return null
  if (a < 0) return `(${a}${v})`
  else return `${a}${v}`
}

const formatConstant = (a: number) => {
  if (a === 0) return null
  if (a < 0) return `(${a})`
  else return a
}

const plusReturn = (coeff: number, constant: number) => {
  if (coeff === 0 || constant === 0) return null
  else return <span>&nbsp;+&nbsp;</span>
}

export const QuestionElement: FC<SpanProps> = ({
  variable,
  leftCoefficient,
  leftConstant,
  rightCoefficient,
  rightConstant,
  criteria1,
  criteria2,
  criteria3,
  criteria4,
}) => {
  // console.log(rightCoefficient, criteria1, criteria2, criteria3, criteria4)
  if (criteria1 && criteria2 && criteria3 && criteria4)
    return (
      <Div>
        {/* All criteria solved */}
        {criteria1 && criteria2 && criteria3 && criteria4 ? (
          <ColoredSpan>
            {formatCoefficient(leftCoefficient, variable)}
            {plusReturn(leftCoefficient, leftConstant)}
            {formatConstant(leftConstant)} = {formatCoefficient(rightCoefficient, variable)}
            {plusReturn(rightCoefficient, rightConstant)}
            {formatConstant(rightConstant)}
          </ColoredSpan>
        ) : null}
      </Div>
    )
  else
    return (
      <Div>
        {criteria1 && criteria2 ? (
          <ColoredSpan>
            {formatCoefficient(leftCoefficient, variable)}
            {plusReturn(leftCoefficient, leftConstant)}
            {formatConstant(leftConstant)}
          </ColoredSpan>
        ) : null}
        {criteria1 && !(criteria1 && criteria2) ? (
          <ColoredSpan>{formatCoefficient(leftCoefficient, variable)}</ColoredSpan>
        ) : (
          !(criteria1 && criteria2) && <>{formatCoefficient(leftCoefficient, variable)}</>
        )}
        {/*--------------- plus------------- */}
        {!(criteria1 && criteria2) && plusReturn(leftCoefficient, leftConstant)}
        {/*-------------- plus --------------*/}
        {criteria2 && !(criteria1 && criteria2) ? (
          <ColoredSpan>{formatConstant(leftConstant)}</ColoredSpan>
        ) : (
          !(criteria1 && criteria2) && <>{formatConstant(leftConstant)}</>
        )}
        {/*-------------- equal-------------- */}
        &nbsp;=&nbsp;
        {/*-------------- equal --------------*/}
        {criteria3 ? (
          rightCoefficient === 0 ? null : (
            <ColoredSpan>{formatCoefficient(rightCoefficient, variable)}</ColoredSpan>
          )
        ) : (
          <>{formatCoefficient(rightCoefficient, variable)}</>
        )}
        {plusReturn(rightCoefficient, rightConstant)}
        {criteria4 ? (
          <ColoredSpan>{formatConstant(rightConstant)}</ColoredSpan>
        ) : (
          <>{formatConstant(rightConstant)}</>
        )}
      </Div>
    )
}
