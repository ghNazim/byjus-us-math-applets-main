import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FactorTree } from '@/atoms/FactorTree'
import { FactorTreeRef } from '@/atoms/FactorTree/FactorTree.types'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { getFactors, getPrimeFactors } from '@/utils/math'

import tryNewSymb from './Asset/tryNewSymb.svg'
import { Dropdown } from './Dropdown/Dropdown'

const MainContainer = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  box-sizing: border-box;
  width: 650px;
  height: 554px;
  border: 1px dashed #1cb9d9;
  border-radius: 5px 5px 5px 5px;
  z-index: 1;
`
const TreeContainer = styled.div`
  position: relative;
  width: 650px;
  height: 554px;
  top: 15px;
  left: 50%;
  translate: -50%;
`
const TryNewButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 9px 18px;

  position: absolute;
  width: 160px;
  height: 60px;
  left: 280px;
  top: 695px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  background: #1a1a1a;
  border-radius: 10px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;
  flex: none;
  order: 1;
  flex-grow: 0;
  z-index: 2;
  &:disabled {
    cursor: none;
    background-color: #c7c7c7;
  }

  &:hover:not([disabled]) {
    scale: 1.05;
    transition: scale 0.3s;
    background-color: #1a1a1a99;
  }

  &:active:not([disabled]) {
    background-color: #1a1a1a99;
    color: #1a1a1a;
  }
`
const TryNewSymbol = styled.img`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 9px 10px;

  position: absolute;
  width: 45px;
  height: 45px;
  left: 290px;
  top: 702px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  z-index: 2;
`
const LastText = styled.p`
  position: absolute;
  width: 600px;
  height: 45px;
  left: 50%;
  translate: -50%;
  top: 582px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  color: #d97a1a;
`

function randomNumber() {
  const max = 300
  const min = 4
  let rnd = 1
  while (getPrimeFactors(rnd, false).length === 0)
    rnd = Math.floor(Math.random() * (max - min + 1)) + min

  return rnd
}

export const AppletG07EEC01S2GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [DropdownInput, setDropdownInput] = useState<number[]>([])
  const [value, setValue] = useState(Number)
  const factorTreeRef = useRef<FactorTreeRef>(null)
  const [isComplete, setComplete] = useState(false)

  const handleValueChange = (value: number) => {
    setDropdownInput((ip) => [...ip, value])
  }

  useEffect(() => {
    setValue(36)
  }, [])

  const onTryNewClick = () => {
    setComplete(false)
    setValue(randomNumber())
  }

  useEffect(() => {
    setDropdownInput([])
  }, [value])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-eec01-s2-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Prime factorization of a number using the
        factor tree."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <MainContainer>
        <TreeContainer>
          <FactorTree
            value={value}
            inputFactors={DropdownInput}
            inputComponentLeft={({ parentNodeValue }) => (
              <Dropdown
                dropDownArray={getFactors(parentNodeValue, false)}
                onValueChange={handleValueChange}
              ></Dropdown>
            )}
            ref={factorTreeRef}
            onComplete={setComplete}
          />
        </TreeContainer>
      </MainContainer>
      {isComplete && (
        <LastText>
          <span style={{ color: '#1CB9D9' }}> {value} </span>
          <span style={{ color: '#646464' }}> =</span>{' '}
          {factorTreeRef.current?.expandedFactors.join(' × ')}
        </LastText>
      )}
      <TryNewButton disabled={!isComplete} onClick={onTryNewClick}>
        Try New
      </TryNewButton>
      <TryNewSymbol src={tryNewSymb}></TryNewSymbol>
    </AppletContainer>
  )
}
