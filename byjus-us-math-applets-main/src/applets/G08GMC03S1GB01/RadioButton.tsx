import { FC, useContext, useState } from 'react'
import styled from 'styled-components'

import { AnalyticsContext } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
const Holder = styled.div<{ active: boolean,disabled: boolean }>`
  width: 129px;
  height: 60px;
  background-color: #fff;
  border: 1px solid ${(props) => (props.active ? '#1a1a1a' : '#c7c7c7')};
  border-radius: 12px;
  box-shadow: inset 0px ${(props) => (props.active ? 0 : -4)}px 0px 0px #c7c7c7;
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  padding: 20px 20px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: ${(props) => (props.active ? 700 : 400)};
  font-size: 20px;
  line-height: 28px;
  color: #212121;
  position: relative;
  z-index: 0;
  opacity: ${(props) => (props.disabled ? .3 : 1)};
  &::before {
    content: '';
    position: absolute;
    width: 118px;
    height: 52px;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    border-radius: 8px;
    background-color: ${(props) => (props.active ? '#c7c7c7' : '#fff')};
  }
`
const TextDiv = styled.div`
  z-index: 2;
`
const BlackCircle=styled.div<{active: boolean}>`
  z-index: 2;
  width: 22px;
  height: 22px;
  border: 2px solid #212121;
  border-radius: 50%;

  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    translate: 3px 3px;
    border-radius: 50%;
    background-color: ${(props) => (props.active ? '#212121' : 'none')};
    transition: background-color .2s ease-in;
  }

`

const RadioButton: FC<{ onClick: (e:any) => void; active: boolean; text: string, disabled: boolean }> = ({
  onClick,
  text,
  active,
  disabled
}) => {
  return (
    <>
      <Holder active={active} onClick={onClick} disabled={disabled}>
        <BlackCircle active={active}/>
        <TextDiv>{text}</TextDiv>
      </Holder>
    </>
  )
}

export default RadioButton
