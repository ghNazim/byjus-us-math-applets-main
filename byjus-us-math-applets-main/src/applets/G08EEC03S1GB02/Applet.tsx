import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FactorTree } from '@/atoms/FactorTree'
import { FactorTreeRef } from '@/atoms/FactorTree/FactorTree.types'
import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'
import { getFactors, getPrimeFactors } from '@/utils/math'
import { isNumber } from '@/utils/types'

import tryNewSymb from './Assets/tryNewSymb.svg'
import { Dropdown } from './Dropdown/Dropdown'

function getOrderedPrimeCubes(
  factors: number[],
): [boolean, Array<[number, number, number] | number>, number] {
  const countMap = new Map<number, number>()

  for (const factor of factors) {
    const count = countMap.get(factor) ?? 0
    countMap.set(factor, count + 1)
  }

  const cubes: Array<[number, number, number] | number> = []
  let groupCount = 0
  let isPerfectCube = true
  for (const [factor, count] of countMap) {
    let i = count
    while (i > 0) {
      if (i >= 3) {
        cubes.push([factor, factor, factor])
        groupCount++
        i -= 3
      } else if (i === 2) {
        cubes.push(factor)
        cubes.push(factor)
        isPerfectCube = false
        i -= 2
      } else {
        cubes.push(factor)
        isPerfectCube = false
        i -= 1
      }
    }
  }

  return [isPerfectCube, cubes, groupCount]
}

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
  height: 480px;
  border: 1px dashed #1cb9d9;
  background-color: #ffffff;
  border-radius: 5px 5px 5px 5px;
  z-index: 1;
`
const TreeContainer = styled.div<{ isVisible: boolean }>`
  position: relative;
  top: 15px;
  left: 50%;
  translate: -50%;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: 0.2s;
`
const InputContainer = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 10px;
  width: 650px;
  height: 480px;
  left: 50px;
  display: flex;
  flex-direction: column;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: 0.2s;
`
const AnswerInputContainer = styled.div`
  position: absolute;
  top: 250px;
  left: 162px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  z-index: 1;
  transition: top 0.2s ease-out;
`
const AnswerInputLabel = styled.p`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #444444;
`
const AnswerInputBorder = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 8px 8px 8px;
  gap: 8px;
  border: 3px solid #1a1a1a;
  background-color: #f6f6f6;
  border-radius: 15px;
  &:disabled {
    pointer-events: none;
    background-color: #77777730;
    border: 3px solid #777777;
  }
`
const AnswerInput = styled.input`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 34px;
  color: #444444;
  background-color: transparent;
  border: 0;
  max-width: 80px;
  &:focus {
    outline: 0;
  }
`
const PageText = styled.p`
  position: relative;
  width: 500px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const EndText = styled.p`
  position: absolute;
  top: 600px;
  left: 50%;
  translate: -50%;
  width: 500px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const TextBox = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 615px;
  left: 34px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 4px;
  width: 650px;
  height: 60px;
  background: rgba(255, 204, 204, 0.4);
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: 0.2s ease-out;
`
const FactorText = styled.p`
  position: absolute;
  width: 600px;
  height: 45px;
  left: 50%;
  translate: -50%;
  top: 520px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #d97a1a;
  z-index: 1;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 9px 18px;
  transition: 0.2s ease-out;
  position: absolute;
  width: 160px;
  height: 60px;
  left: 297px;
  top: 690px;
`
const TryNewButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 9px 18px;
  width: 160px;
  height: 60px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease-out;
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
  z-index: 1;

  &:disabled {
    cursor: none;
    background-color: #f6f6f6;
  }

  &:hover:not([disabled]) {
    background-color: #1a1a1a99;
  }

  &:active:not([disabled]) {
    background-color: #1a1a1a99;
    color: #b4a6e1;
  }
`
const TryNewSymbol = styled.img`
  position: relative;
  top: 48px;
  left: -105px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 9px 10px;
  width: 45px;
  height: 45px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease-out;
  z-index: 1;
`
const SubmitButton = styled.button`
  position: absolute;
  top: 350px;
  left: 229px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 9px 18px;
  width: 160px;
  height: 60px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease-out;
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
  z-index: 1;

  &:disabled {
    cursor: none;
    background-color: #f6f6f6;
  }

  &:hover:not([disabled]) {
    background-color: #1a1a1a99;
  }

  &:active:not([disabled]) {
    background-color: #1a1a1a99;
    color: white;
  }
`
const AnswerInputOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 240px;
  left: 390px;
  pointer-events: none;
  z-index: 1;
`

export const AppletG08EEC03S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [DropdownInput, setDropdownInput] = useState<number[]>([])
  const [inputValue, setInputValue] = useState<number | undefined | ''>()
  const [submittedVal, setSubmittedVal] = useState(4)
  const resolvedInputValue = isNumber(inputValue) ? inputValue : 4
  const isPrime = getPrimeFactors(resolvedInputValue, false).length === 0
  const [errorCase, setErrorCase] = useState(false)
  const [notPrime, setNotPrime] = useState(false)
  const [treeComplete, setComplete] = useState(false)
  const [notInRange, setNotInRange] = useState(false)
  const factorTreeRef = useRef<FactorTreeRef>(null)
  const [hasInput, setHasInput] = useState(false)
  const [dropdownClick, setDropdownClick] = useState(false)
  const [submitClick, setSubmitClick] = useState(false)
  const hasClicked = useHasChanged(hasInput == false)

  const [isPerfectCube, groupedFactors] = (factorTreeRef.current &&
    getOrderedPrimeCubes(factorTreeRef.current.expandedFactors)) ?? [false, []]

  const handleValueChange = (value: number) => {
    setDropdownInput((ip) => [...ip, value])
    setDropdownClick(true)
  }

  useEffect(() => {
    if (inputValue) {
      setHasInput(true)
    } else setHasInput(false)
  }, [inputValue, resolvedInputValue])

  useEffect(() => {
    if (resolvedInputValue == 1 || resolvedInputValue == 0) {
      setErrorCase(true)
      setNotPrime(false)
    }
    if (resolvedInputValue > 1 && resolvedInputValue < 4 && isPrime) {
      setErrorCase(false)
      setNotPrime(true)
      setNotInRange(false)
    }
    if (resolvedInputValue > 4 && resolvedInputValue < 1200 && isPrime) {
      setErrorCase(false)
      setNotPrime(true)
      setNotInRange(false)
    }
    if (resolvedInputValue > 1200) {
      setNotInRange(true)
    }
    if (!isPrime && resolvedInputValue < 1200) {
      setErrorCase(false)
      setNotPrime(false)
      setNotInRange(false)
    }
  }, [isPrime, resolvedInputValue])

  const onTryNewClick = () => {
    setDropdownInput([])
    setInputValue('')
    setDropdownClick(false)
    setSubmitClick(false)
  }

  const onSubmitClick = () => {
    setSubmittedVal(resolvedInputValue)
    setSubmitClick(true)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g08-eec03-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Enter a number and construct its factor tree."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <MainContainer>
        <TreeContainer isVisible={submitClick}>
          <FactorTree
            value={submittedVal}
            inputFactors={DropdownInput}
            inputComponentLeft={({ parentNodeValue }) => (
              <Dropdown
                dropDownArray={getFactors(parentNodeValue, false)}
                onValueChange={handleValueChange}
                disabled={errorCase || notPrime || treeComplete || notInRange || !hasInput}
              ></Dropdown>
            )}
            onComplete={setComplete}
            ref={factorTreeRef}
          ></FactorTree>
        </TreeContainer>
      </MainContainer>
      <InputContainer isVisible={!submitClick}>
        <AnswerInputContainer>
          <AnswerInputLabel>Enter the number:</AnswerInputLabel>
          <AnswerInputBorder
            disabled={hasInput && !notPrime && !notInRange && !errorCase && dropdownClick}
          >
            <AnswerInput
              value={inputValue}
              onChange={(e) =>
                setInputValue(e.currentTarget.value ? +e.currentTarget.value : undefined)
              }
            ></AnswerInput>
          </AnswerInputBorder>
        </AnswerInputContainer>
        <SubmitButton
          onClick={onSubmitClick}
          disabled={errorCase || notPrime || notInRange || isNaN(resolvedInputValue) || !hasInput}
        >
          Submit
        </SubmitButton>
      </InputContainer>
      <TextBox isVisible={errorCase && !notInRange && !notPrime && !isNaN(resolvedInputValue)}>
        <PageText>
          {resolvedInputValue == 1 || resolvedInputValue == 0 ? resolvedInputValue : undefined} is
          neither a prime nor a composite number.
        </PageText>
      </TextBox>

      <TextBox isVisible={!errorCase && (notInRange || notPrime || isNaN(resolvedInputValue))}>
        <PageText>Enter a composite number betweeen 4 - 1200.</PageText>
      </TextBox>

      {treeComplete && !errorCase && !notPrime && !notInRange && !isNaN(resolvedInputValue) && (
        <>
          <FactorText>
            {' '}
            <span style={{ color: '#1CB9D9' }}> {resolvedInputValue} </span>
            <span style={{ color: '#646464' }}> =</span>{' '}
            {factorTreeRef.current &&
              groupedFactors
                ?.map((pair) => (isNumber(pair) ? pair : `(${pair.join(' × ')})`))
                .join(' × ')}
          </FactorText>
          {isPerfectCube ? (
            <EndText>
              These prime factors can be grouped in triples. <br />
              {resolvedInputValue} is a perfect cube.
            </EndText>
          ) : (
            <EndText>
              These prime factors cannot be grouped in triples.
              <br /> {resolvedInputValue} is not a perfect cube.
            </EndText>
          )}
        </>
      )}
      {treeComplete && (
        <ButtonContainer>
          <TryNewButton onClick={onTryNewClick} disabled={!treeComplete}>
            Try New
          </TryNewButton>
          <TryNewSymbol src={tryNewSymb}></TryNewSymbol>
        </ButtonContainer>
      )}
      <OnboardingController>
        <OnboardingStep index={0}>
          <AnswerInputOnboarding complete={hasClicked} />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}
