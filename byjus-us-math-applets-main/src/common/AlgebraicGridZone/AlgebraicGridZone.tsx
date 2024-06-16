import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AlgebraicGridZoneProps } from './AlgebraicGridZone.types'

const GridZone = styled.div<{ selected: boolean }>`
  width: 184px;
  height: 190px;
  ${(props) =>
    props.selected
      ? ` background: #f6f6f6;
  border: 1px dashed #646464;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);`
      : ``}
  border-radius: 5px;
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 4px;
  padding: 5px;
  grid-template-rows: auto auto auto auto auto;
  align-content: end;
`

const GridElement = styled.div<{ type: number; childNum: number; rowNum: number; colNum: number }>`
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 33px;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.25);
  ${(props) =>
    props.type == 1 &&
    `:nth-child(` +
      props.childNum +
      `) {
    grid-column: 1 / 5  ;
    grid-row: ` +
      (props.childNum == 1
        ? `5`
        : props.childNum == 2
        ? `4`
        : props.childNum == 3
        ? `3`
        : props.childNum == 4
        ? `2`
        : `1`) +
      `;
    color: #ffffff;
    background: #d97a1a;
    border: 2px solid white;
  }`}
  ${(props) =>
    props.type == 2 &&
    `:nth-child(` +
      props.childNum +
      `) {
    grid-column: 1 / 5;
    grid-row: ` +
      (props.childNum == 1
        ? `5`
        : props.childNum == 2
        ? `4`
        : props.childNum == 3
        ? `3`
        : props.childNum == 4
        ? `2`
        : `1`) +
      `;
    background: #ffffff;
    color: #d97a1a;
    border: 2px solid #d97a1a;
  }`}
 ${(props) =>
    props.type == 3 &&
    `:nth-child(` +
      props.childNum +
      `) {
    grid-column: ` +
      props.colNum +
      ` / ` +
      props.colNum +
      `;
    grid-row: ` +
      props.rowNum +
      `;
    color: #ffffff;
    background: #1cb9d9;
    border: 2px solid white;
  }`}
${(props) =>
    props.type == 4 &&
    `:nth-child(` +
      props.childNum +
      `) {
        grid-column: ` +
      props.colNum +
      ` / ` +
      props.colNum +
      `;
    grid-row: ` +
      props.rowNum +
      `;
    color: #1cb9d9;
    background: #ffffff;
    border: 2px solid #1cb9d9;
  }`}
`
const AlgebraicGridZone: FC<AlgebraicGridZoneProps> = ({
  selected = false,
  xMax = 5,
  constantMax = 20,
  zoneStatus,
  xCoeffValue,
  constantValue,
  className,
}) => {
  const [xCoefficient, setXCoefficient] = useState(0)
  const [constant, setConstant] = useState(0)
  const [isSelected, setIsSelected] = useState(selected)

  const xElements = []
  const constantElements = []

  useEffect(() => {
    setXCoefficient(xCoeffValue)
  }, [xCoeffValue])

  useEffect(() => {
    setConstant(constantValue)
  }, [constantValue])

  useEffect(() => {
    setIsSelected(selected)
  }, [selected])
  useEffect(() => {
    const plusXDisable =
      xCoefficient >= xMax ? true : 20 - Math.abs(constant) <= xCoefficient * 4 + 3 ? true : false
    const minusXDisable =
      xCoefficient <= -xMax
        ? true
        : -(20 - Math.abs(constant)) >= xCoefficient * 4 - 3
        ? true
        : false
    const plusOneDisable =
      constant >= constantMax ? true : 20 - Math.abs(xCoefficient) * 4 <= constant ? true : false
    const minusOneDisble =
      constant <= -constantMax
        ? true
        : -(20 - Math.abs(xCoefficient) * 4) >= constant
        ? true
        : false
    zoneStatus([plusXDisable, minusXDisable, plusOneDisable, minusOneDisble])
  }, [xCoefficient, constant, xMax, constantMax, zoneStatus])
  for (let i = 1; i <= Math.abs(xCoefficient); i++) {
    if (xCoefficient > 0)
      xElements.push(
        <GridElement type={1} childNum={i} rowNum={i} colNum={i}>
          x
        </GridElement>,
      )
    else if (xCoefficient < 0)
      xElements.push(
        <GridElement type={2} childNum={i} rowNum={i} colNum={i}>
          -x
        </GridElement>,
      )
  }
  for (let i = 1; i <= Math.abs(constant); i++) {
    if (constant > 0)
      constantElements.push(
        <GridElement
          type={3}
          childNum={Math.abs(xCoefficient) + i}
          rowNum={
            -Math.abs(xCoefficient) -
            (i % 21 < 5 ? 2 : i % 21 < 9 ? 3 : i % 21 < 13 ? 4 : i % 21 < 17 ? 5 : 6)
          }
          colNum={i % 4 == 0 ? 4 : i % 4}
        >
          1
        </GridElement>,
      )
    else if (constant < 0)
      constantElements.push(
        <GridElement
          type={4}
          childNum={Math.abs(xCoefficient) + i}
          rowNum={
            -Math.abs(xCoefficient) -
            (i % 21 < 5 ? 2 : i % 21 < 9 ? 3 : i % 21 < 13 ? 4 : i % 21 < 17 ? 5 : 6)
          }
          colNum={i % 4 == 0 ? 4 : i % 4}
        >
          -1
        </GridElement>,
      )
  }

  return (
    <div className={className}>
      <GridZone selected={isSelected}>
        {xElements}
        {constantElements}
      </GridZone>
    </div>
  )
}

export default AlgebraicGridZone
