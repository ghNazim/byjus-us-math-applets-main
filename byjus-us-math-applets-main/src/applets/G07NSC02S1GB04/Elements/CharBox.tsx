import React, { FC, ReactElement, useState } from 'react'
import styled, { keyframes } from 'styled-components'

export interface IColorBlock {
  textColor: string
  backgroundColor: string
}

export const blueBlock: IColorBlock = {
  textColor: '#1CB9D9',
  backgroundColor: '#E7FBFF',
}

export const purpleBlock: IColorBlock = {
  textColor: '#AA5EE0',
  backgroundColor: '#FAF2FF',
}

const defaultColorBlock: IColorBlock = {
  textColor: '#888888',
  backgroundColor: '#EcECEC',
}

const Holder = styled.div<{ colorBlock: IColorBlock }>`
  width: 50px;
  height: 50px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${(props) => props.colorBlock.backgroundColor};
  color: ${(props) => props.colorBlock.textColor};
`

const DotHolder = styled.div<{ colorBlock: IColorBlock; active: boolean }>`
  width: 50px;
  height: 50px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #${(props) => (props.active ? 'ECFFD9' : 'fff')};
  color: #6ca621;

  border: 1px dotted;
  border: 1.5px dashed #888888;
  border-radius: 4px;
`

const CharBox: FC<{
  value: ReactElement | string
  colorBlock?: IColorBlock
}> = ({ value, colorBlock = defaultColorBlock }) => {
  return (
    <>
      <Holder colorBlock={colorBlock}>{value}</Holder>
    </>
  )
}

export default CharBox

export const DotBox: FC<{
  value: ReactElement | string
  active: boolean
  colorBlock?: IColorBlock
}> = ({ value, colorBlock = defaultColorBlock, active }) => {
  return (
    <>
      <DotHolder active={active} colorBlock={colorBlock}>
        {value}
      </DotHolder>
    </>
  )
}
