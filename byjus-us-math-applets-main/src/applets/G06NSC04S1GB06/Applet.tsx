import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FactorTree } from '@/atoms/FactorTree'
import { FactorTreeRef } from '@/atoms/FactorTree/FactorTree.types'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { interleave } from '@/utils/array'
import { getFactors, getPrimeFactors } from '@/utils/math'

import tryNew from './Assets/tryNew.svg'
import { TextImgButton } from './Buttons/Buttons'
import { Dropdown } from './Dropdown/Dropdown'

const MainContainer = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  width: 680px;
  height: 520px;
  background: #fff6db;
  border-radius: 15px;
  transition: 0.3s;
`
const TreeContainer = styled.div<{ isVisible?: boolean }>`
  position: relative;
  top: 130px;
  left: 50%;
  translate: -50%;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: 0.2s;
  z-index: 1;
`
const TextFlexBox = styled.div`
  position: absolute;
  top: 680px;
  left: 50%;
  width: 720px;
  height: 28px;
  translate: -50%;
  display: flex;
  justify-content: center;
  flex-direction: row;
`
const PageFeedbacks = styled.label`
  width: 720px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #444444;
  flex: none;
  order: 2;
  flex-grow: 0;
`
const ButtonContainer = styled.div`
  position: absolute;
  width: 720px;
  top: 720px;
  left: 50%;
  translate: -50%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 20px;
  z-index: 1;
`
const FactorsFlexBox = styled.div`
  position: absolute;
  top: 640px;
  left: 50%;
  translate: -50%;
  width: 700px;
  height: 28px;
  display: flex;
  justify-content: center;
  gap: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #1a1a1a;
`

function randomNumber() {
  const max = 100
  const min = 4
  let rnd = 1
  while (getPrimeFactors(rnd, false).length === 0)
    rnd = Math.floor(Math.random() * (max - min + 1)) + min

  return rnd
}

export const AppletG06NSC04S1GB06: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [value, setValue] = useState(12)
  const [dropdownInput, setDropdownInput] = useState<number[]>([])
  const [isComplete, setComplete] = useState(false)
  const [isClicked, setClicked] = useState(false)
  const [compositeValue, setComposite] = useState<number>(0)

  const treeRef = useRef<FactorTreeRef>(null)

  const playMouseCLick = useSFX('mouseClick')

  const handleValueChange = (value: number) => {
    setDropdownInput((ip) => [...ip, value])
  }

  const onTryNewClick = () => {
    playMouseCLick()
    setComplete(false)
    setValue(randomNumber())
    setDropdownInput([])
  }

  useEffect(() => {
    setValue(randomNumber())
  }, [])

  useEffect(() => {
    setClicked(!(dropdownInput.length == 0))
  }, [dropdownInput])

  useEffect(() => {
    const factors = treeRef.current?.expandedFactors || []
    const newComposite =
      factors.find((val) => {
        const isPrime = getPrimeFactors(val, false).length === 0
        return !isPrime
      }) || 0

    if (compositeValue !== newComposite) {
      setComposite(newComposite)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeRef.current?.expandedFactors])

  const factorsArray =
    treeRef.current?.expandedFactors.map((val, i) => {
      const isPrime = getPrimeFactors(val, false).length == 0
      const backgroundColor = isPrime ? '#FF8F1F' : '#FFDC73'
      const color = isPrime ? '#FFFFFF' : '#CF8B04'

      return (
        <span
          style={{
            background: backgroundColor,
            borderRadius: '5px',
            color: color,
          }}
          key={i}
        >
          &nbsp; {val} &nbsp;
        </span>
      )
    }) ?? []

  const factorsProduct = [
    ...interleave(
      factorsArray,
      Array.from({ length: factorsArray.length - 1 }, (_, i) => (
        <span key={factorsArray.length + i}>{'×'}</span>
      )),
    ),
  ]

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc04-s1-gb06',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Prime factorize the number."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <MainContainer></MainContainer>
      <TreeContainer isVisible={true}>
        <FactorTree
          value={value}
          inputFactors={dropdownInput}
          inputComponentLeft={({ parentNodeValue }) => (
            <Dropdown
              dropDownArray={getFactors(parentNodeValue, false)}
              onValueChange={handleValueChange}
            ></Dropdown>
          )}
          ref={treeRef}
          onComplete={setComplete}
        ></FactorTree>
      </TreeContainer>
      {!isComplete && !isClicked && (
        <TextFlexBox>
          <PageFeedbacks>Choose a factor for the given number.</PageFeedbacks>
        </TextFlexBox>
      )}
      {isClicked && compositeValue > 3 && (
        <TextFlexBox>
          <PageFeedbacks>
            Let&#39;s break down {compositeValue}, as it&#39;s a composite number.
          </PageFeedbacks>
        </TextFlexBox>
      )}
      {isClicked && (
        <FactorsFlexBox>
          <span style={{ background: '#F4E5FF', borderRadius: '5px', color: '#aa5ee0' }}>
            &nbsp;{value}&nbsp;
          </span>{' '}
          =&nbsp;
          {factorsProduct}
        </FactorsFlexBox>
      )}
      {isComplete && (
        <ButtonContainer>
          <TextImgButton onClick={onTryNewClick} imgSource={tryNew}>
            Try New
          </TextImgButton>
        </ButtonContainer>
      )}
    </AppletContainer>
  )
}
