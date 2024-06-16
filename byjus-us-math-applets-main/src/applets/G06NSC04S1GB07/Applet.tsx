import { FC, ReactNode, useEffect, useRef, useState } from 'react'
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
import { useSFX } from '@/hooks/useSFX'
import { interleave } from '@/utils/array'
import { getFactors, getPrimeFactors } from '@/utils/math'

import add from './Assets/addBtn.svg'
import retry from './Assets/retry.svg'
import tryNew from './Assets/tryNew.svg'
import { TextButton, TextImgButton } from './Buttons/Buttons'

const MainContainer = styled.div<{ answerCheck?: boolean }>`
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
  background: ${(props) => (props.answerCheck ? '#fff6db' : '#FFD1D1')};
  border-radius: 15px;
  transition: 0.3s;
`
const TreeContainer = styled(FactorTree)`
  position: relative;
  top: 130px;
  left: 50%;
  translate: -50%;
  transition: 0.2s;
  z-index: 1;
`
const AddBtn = styled.button`
  position: absolute;
  top: 55px;
  background: none;
  border: none;
  scale: 0.8;
  transition: opacity 0.3s;
  &:hover:not([disabled]) {
    scale: 0.9;
    transition: scale 0.3s;
  }
  &:disabled {
    filter: grayscale();
  }
`
const BtnImg = styled.img`
  background: none;
  border: none;
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
const TextFlexBox = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 680px;
  left: 50%;
  translate: -50%;
  width: 700px;
  height: 28px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  transition: 0.3s;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
`
const PageFeedbacks = styled.label`
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #444444;
  flex: none;
  order: 2;
  flex-grow: 0;
`
const FactorsFlexBox = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 640px;
  left: 50%;
  translate: -50%;
  width: 700px;
  height: 28px;
  display: flex;
  justify-content: center;
  transition: 0.3s;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
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
const AnswerInputOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 200px;
  left: 240px;
  pointer-events: none;
  z-index: 1;
`

const AnswerInputContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  gap: 20px;
  transition: top 0.2s ease-out;
  z-index: 1;
`
const AnswerInputBorder = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 8px 8px 8px;
  gap: 20px;
  border: 2px solid #1a1a1a99;
  background: #ffffff;
  border-radius: 7px;
  width: 45px;
  height: 45px;
  &:disabled {
    pointer-events: none;
    background-color: #77777730;
    border: 3px solid #777777;
  }
`
const AnswerInput = styled.input.attrs({ type: 'number' })`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 34px;
  color: #444444;
  background-color: transparent;
  border: 0;
  max-width: 45px;

  appearance: textfield; /* Override the default number input appearance */
  -moz-appearance: textfield; /* Firefox */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0; /* Remove the default margin */
  }

  &:focus {
    outline: 0;
  }
`

function randomNumber() {
  const max = 300
  const min = 4
  let rnd = 1
  while (getPrimeFactors(rnd, false).length === 0)
    rnd = Math.floor(Math.random() * (max - min + 1)) + min

  return rnd
}

const TypedInput: FC<{
  inputNode: ReactNode
  onAddClick: () => void
  showAdd: boolean
  answerState: string
  retry: boolean
}> = ({ inputNode, onAddClick, showAdd, answerState, retry }) => {
  return (
    <>
      <AnswerInputContainer>
        <AnswerInputBorder>{inputNode}</AnswerInputBorder>
      </AnswerInputContainer>
      {showAdd && (
        <AddBtn onClick={onAddClick}>
          <BtnImg src={add}></BtnImg>
        </AddBtn>
      )}
    </>
  )
}

export const AppletG06NSC04S1GB07: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [value, setValue] = useState(Number)
  const [isComplete, setComplete] = useState(false)
  const [inputFactors, setInputFactors] = useState<Array<[number, 'left' | 'right']>>([])
  const [leftInputVal, setLeftInputVal] = useState<number>()
  const [rightInputVal, setRightInputVal] = useState<number>()
  const [answerState, setAnswerState] = useState<'correct' | 'wrong'>('correct')
  const [checkClicked, setCheckClicked] = useState(false)
  const [hasInput, setHasInput] = useState(false)
  const [addClicked, setAddClicked] = useState(false)
  const [nodeValue, setNodeValue] = useState<number>()
  const [leftAddClicked, setLeftClick] = useState(false)
  const [rightAddClicked, setRightClick] = useState(false)
  const [pageFeedbacks, setPageFeedbacks] = useState<string>()
  const [hasPrime, setHasPrime] = useState(false)
  const [resetInput, setResetInput] = useState(false)
  const [retryClick, setRetryClick] = useState(false)

  const [showLeftBtn, setShowLeft] = useState(false)
  const [showRightBtn, setShowRight] = useState(false)

  const playMouseCLick = useSFX('mouseClick')

  const treeRef = useRef<FactorTreeRef>(null)

  const hasClicked = useHasChanged(leftInputVal)

  const isRightPrime =
    rightInputVal != null && rightInputVal > 0 && getPrimeFactors(rightInputVal, false).length == 0

  const isLeftPrime =
    leftInputVal != null && leftInputVal > 0 && getPrimeFactors(leftInputVal, false).length == 0

  const compositeValues = getFactors(nodeValue ?? 1, false)
    .filter((factor) => getPrimeFactors(factor, false).length !== 0)
    .shift()

  const lastComposite =
    nodeValue != null && nodeValue > 0 && getPrimeFactors(compositeValues ?? 1, false).length == 0

  const isProductFactor = (leftInputVal ?? -1) * (rightInputVal ?? -1) === nodeValue

  useEffect(() => {
    setValue(32)
  }, [])

  useEffect(() => {
    setLeftInputVal(undefined)
    setRightInputVal(undefined)
  }, [resetInput])

  const onTryNewClick = () => {
    playMouseCLick()
    setShowLeft(false)
    setShowRight(false)
    setAddClicked(false)
    setLeftInputVal(undefined)
    setRightInputVal(undefined)
    setHasInput(false)
    setCheckClicked(false)
    setComplete(false)
    setInputFactors([])
    setValue(randomNumber())
    setPageFeedbacks('')
    setLeftClick(false)
    setRightClick(false)
  }

  const addFactors = (value: number, dir: 'left' | 'right') => {
    setInputFactors((ip) => [...ip, [value, dir]])
  }

  const onAddLeftClick = () => {
    playMouseCLick()
    setLeftClick(true)
    setRightClick(false)
    setAddClicked(true)
    setCheckClicked(false)
    setShowLeft(false)
    setShowRight(false)
    if (!isLeftPrime) {
      addFactors(leftInputVal ?? 1, 'left')
      setLeftInputVal(undefined)
      setRightInputVal(undefined)
    }
  }

  const onAddRightClick = () => {
    playMouseCLick()
    setLeftClick(false)
    setRightClick(true)
    setAddClicked(true)
    setCheckClicked(false)
    setShowLeft(false)
    setShowRight(false)
    if (!isRightPrime) {
      addFactors(leftInputVal ?? 1, 'right')
      setLeftInputVal(undefined)
      setRightInputVal(undefined)
    }
  }

  const onCheckClick = () => {
    playMouseCLick()
    setCheckClicked(true)
    setRetryClick(true)
    setLeftClick(false)
    setRightClick(false)
    if (!hasInput) {
      setAnswerState('wrong')
      setCheckClicked(false)
    }
  }

  const onRetryClick = () => {
    playMouseCLick()
    setCheckClicked(false)
    setLeftClick(false)
    setRightClick(false)
    setRetryClick(false)
    setLeftInputVal(undefined)
    setRightInputVal(undefined)
    setInputFactors(inputFactors.slice(0, inputFactors.length))
  }

  useEffect(() => {
    if (checkClicked && answerState == 'wrong') setCheckClicked(false)
  }, [answerState, checkClicked])

  useEffect(() => {
    if (hasInput && checkClicked) {
      if (answerState == 'correct') {
        setShowLeft(true)
        setShowRight(true)
      }
      if (answerState == 'wrong') {
        setShowLeft(false)
        setShowRight(false)
      }
    }
  }, [answerState, checkClicked, hasInput])

  useEffect(() => {
    if (lastComposite) {
      if (checkClicked && isProductFactor) {
        addFactors(leftInputVal ?? 1, 'left')
        setResetInput(true)
      }
    }
  }, [checkClicked, isProductFactor, lastComposite, leftInputVal])

  useEffect(() => {
    if (checkClicked) {
      if (!isProductFactor) setAnswerState('wrong')
      else setAnswerState('correct')
    }
  }, [checkClicked, isProductFactor])

  useEffect(() => {
    if (leftAddClicked) {
      if (isLeftPrime) {
        setShowRight(true)
        setHasPrime(true)
        setPageFeedbacks(
          `Oops! ${leftInputVal ?? 0} is a prime number, you cannot factorize it further.`,
        )
      } else {
        setHasPrime(false)
      }
    }
  }, [checkClicked, isLeftPrime, lastComposite, leftAddClicked, leftInputVal])

  useEffect(() => {
    if (rightAddClicked) {
      if (isRightPrime) {
        setShowLeft(true)
        setHasPrime(true)
        setPageFeedbacks(
          `Oops! ${rightInputVal ?? 0} is a prime number, you cannot factorize it further.`,
        )
      } else {
        setHasPrime(false)
      }
    }
  }, [checkClicked, isRightPrime, lastComposite, leftInputVal, rightAddClicked, rightInputVal])

  useEffect(() => {
    if (leftInputVal !== undefined && rightInputVal !== undefined) {
      setHasInput(true)
      setCheckClicked(false)
      setAnswerState('correct')
    } else {
      setHasInput(false)
      setAnswerState('correct')
      setShowLeft(false)
      setShowRight(false)
    }
  }, [hasInput, leftInputVal, rightInputVal])

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

  const inputNodeLeft = (
    <AnswerInput
      key={'ip-left'}
      value={leftInputVal}
      onChange={(e) => {
        const val = e.currentTarget.value
        setLeftInputVal(val ? +val : undefined)
        setRightClick(false)
        setLeftClick(false)
      }}
    />
  )

  const inputNodeRight = (
    <AnswerInput
      key={'ip-right'}
      value={rightInputVal}
      onChange={(e) => {
        const val = e.currentTarget.value
        setRightInputVal(val ? +val : undefined)
        setRightClick(false)
        setLeftClick(false)
      }}
    />
  )

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
        id: 'g06-nsc04-s1-gb07',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Prime factorize the number"
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <MainContainer answerCheck={answerState === 'correct'}> </MainContainer>
      <TreeContainer
        value={value}
        nodeSize={35}
        levelSeparation={80}
        siblingSeparation={60}
        subtreeSeparation={60}
        onComplete={setComplete}
        inputFactors={inputFactors}
        inputComponentLeft={({ parentNodeValue }) => (
          <>
            <>{setNodeValue(parentNodeValue)}</>
            <TypedInput
              key={'left'}
              inputNode={inputNodeLeft}
              onAddClick={onAddLeftClick}
              showAdd={showLeftBtn}
              answerState={answerState}
              retry={retryClick}
            />
          </>
        )}
        inputComponentRight={() => (
          <TypedInput
            key={'right'}
            inputNode={inputNodeRight}
            onAddClick={onAddRightClick}
            showAdd={showRightBtn}
            answerState={answerState}
            retry={retryClick}
          />
        )}
        ref={treeRef}
      ></TreeContainer>
      {hasInput && (
        <ButtonContainer>
          <TextButton onClick={onCheckClick}>Check</TextButton>
        </ButtonContainer>
      )}
      {hasInput && answerState == 'wrong' && retryClick && (
        <ButtonContainer>
          <TextImgButton imgSource={retry} onClick={onRetryClick}>
            Retry
          </TextImgButton>
        </ButtonContainer>
      )}
      {isComplete && (
        <ButtonContainer>
          <TextImgButton imgSource={tryNew} onClick={onTryNewClick}>
            Try new
          </TextImgButton>
        </ButtonContainer>
      )}
      <TextFlexBox isVisible={!checkClicked && !hasPrime && !addClicked && answerState !== 'wrong'}>
        <PageFeedbacks>Enter the factor pair for the given number.</PageFeedbacks>
      </TextFlexBox>
      <TextFlexBox isVisible={answerState == 'wrong' && !hasPrime}>
        <PageFeedbacks>The product of this factor pair is not equal to {nodeValue}</PageFeedbacks>
      </TextFlexBox>
      <TextFlexBox isVisible={hasPrime && answerState !== 'wrong'}>
        <PageFeedbacks>{pageFeedbacks}</PageFeedbacks>
      </TextFlexBox>
      <TextFlexBox isVisible={addClicked && !hasPrime && answerState !== 'wrong' && !isComplete}>
        <PageFeedbacks>Well done! Select the number that can be further factorized.</PageFeedbacks>
      </TextFlexBox>
      <FactorsFlexBox
        isVisible={(addClicked && !hasPrime && answerState !== 'wrong') || isComplete}
      >
        <span style={{ background: '#F4E5FF', borderRadius: '5px', color: '#aa5ee0' }}>
          &nbsp;{value}&nbsp;
        </span>{' '}
        =&nbsp;
        {factorsProduct}
      </FactorsFlexBox>
      <TextFlexBox isVisible={isComplete}>
        <PageFeedbacks>Awesome! You have factorized the given number.</PageFeedbacks>
      </TextFlexBox>
      <OnboardingController>
        <OnboardingStep index={0}>
          <AnswerInputOnboarding complete={hasClicked} />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}
