import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { InputFactorTree } from '@/applets/G06NSC04S1GB05/InputFactorTree'
import { InputFactorTreeRef } from '@/applets/G06NSC04S1GB05/InputFactorTree/InputFactorTree.types'
import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useSFX } from '@/hooks/useSFX'
import { getFactors, getPrimeFactors } from '@/utils/math'
import { isNumber } from '@/utils/types'

import tryNew from './Assets/tryNew.svg'
import { TextButton, TextImgButton } from './Buttons/Buttons'

const MainContainer = styled.div<{ answerCheck: boolean }>`
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
const TreeContainer = styled.div<{ isVisible: boolean }>`
  position: relative;
  top: 130px;
  left: 50%;
  translate: -50%;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: 0.2s;
  z-index: 1;
`
const AnswerInputContainer = styled.div<{ isVisible: boolean; move?: boolean }>`
  position: absolute;
  top: ${(props) => (props.move ? 120 : 300)}px;
  scale: ${(props) => (props.move ? 0.6 : 1)};
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  gap: 20px;
  transition: 0.3s ease-in;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  z-index: 1;
`
const AnswerInputBorder = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 8px 8px 8px;
  gap: 20px;
  border: 2px solid #1a1a1a;
  background: #ffffff;
  border-radius: 15px;
  width: 56px;
  height: 60px;
  &:disabled {
    pointer-events: none;
    background-color: #77777730;
    border: 3px solid #777777;
  }
`
const AnswerInputCircle = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #eaccff;
  border: none;
  border-radius: 100px;
  width: 116px;
  height: 116px;
`
const AnswerInput = styled.input.attrs({ type: 'number' })`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 34px;
  color: #444444;
  background-color: transparent;
  border: 0;
  max-width: 58px;

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
const TextFlexBox = styled.div`
  position: absolute;
  top: 650px;
  left: 50%;
  width: 720px;
  height: 28px;
  translate: -50%;
  display: flex;
  justify-content: center;
  flex-direction: row;
`
const PageFeedbacks = styled.label<{ isVisible: boolean }>`
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
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: 0.2s;
`
const AnswerInputOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 310px;
  left: 280px;
  pointer-events: none;
  z-index: 1;
`

export const AppletG06NSC04S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [nextClick, setNextClick] = useState(false)
  const [submittedVal, setSubmittedVal] = useState(4)
  const [treeComplete, setComplete] = useState(false)
  const factorTreeRef = useRef<InputFactorTreeRef>(null)
  const [inputValue, setInputValue] = useState<number | undefined | ''>()
  const resolvedInputValue = isNumber(inputValue) ? inputValue : 4
  const [answerState, setAnswerState] = useState(true)
  const [hasInput, setHasInput] = useState(false)
  const [showTryBtn, setShowTryBtn] = useState(false)
  const [primeFactors, setPrimeFactors] = useState<number[]>([])

  const hasClicked = useHasChanged(hasInput == false)

  const playMouseClick = useSFX('mouseClick')

  const onNextClick = () => {
    playMouseClick()
    setSubmittedVal(resolvedInputValue)
    setNextClick(true)
    setShowTryBtn(true)
  }

  const onTryNewClick = () => {
    playMouseClick()
    setInputValue('')
    setNextClick(false)
    setShowTryBtn(false)
  }

  useEffect(() => {
    if (resolvedInputValue < 2) setAnswerState(false)
    if (resolvedInputValue > 2) setAnswerState(true)
  }, [resolvedInputValue])

  useEffect(() => {
    if (inputValue && answerState) {
      setHasInput(true)
    } else setHasInput(false)
  }, [answerState, inputValue])

  useEffect(() => {
    setPrimeFactors(getPrimeFactors(resolvedInputValue, false))
  }, [resolvedInputValue])

  useEffect(() => {
    if (resolvedInputValue > 100) setAnswerState(false)
  }, [resolvedInputValue])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc04-s1-gb05',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Prime or Composite number finder."
        backgroundColor="#F6F6F6"
        buttonColor="#1a1a1a"
      />
      <MainContainer answerCheck={answerState}></MainContainer>
      <TreeContainer isVisible={nextClick}>
        <InputFactorTree
          value={submittedVal}
          inputFactors={getFactors(resolvedInputValue, false)}
          onComplete={setComplete}
          ref={factorTreeRef}
        ></InputFactorTree>
      </TreeContainer>
      <AnswerInputContainer isVisible={!nextClick} move={nextClick}>
        <AnswerInputCircle>
          <AnswerInputBorder>
            <AnswerInput
              value={inputValue}
              onChange={(e) =>
                setInputValue(e.currentTarget.value ? +e.currentTarget.value : undefined)
              }
            ></AnswerInput>
          </AnswerInputBorder>
        </AnswerInputCircle>
      </AnswerInputContainer>
      {!showTryBtn && (
        <ButtonContainer>
          <TextButton onClick={onNextClick} disabled={!hasInput}>
            Next
          </TextButton>
        </ButtonContainer>
      )}
      {showTryBtn && (
        <ButtonContainer>
          <TextImgButton imgSource={tryNew} onClick={onTryNewClick} disabled={!hasInput}>
            Try new
          </TextImgButton>
        </ButtonContainer>
      )}
      <TextFlexBox>
        <PageFeedbacks isVisible={!hasInput}>Enter any number between 2 to 100</PageFeedbacks>
      </TextFlexBox>
      <TextFlexBox>
        <PageFeedbacks isVisible={hasInput && !showTryBtn}>
          Proceed to find out if the number is prime or composite.
        </PageFeedbacks>
      </TextFlexBox>
      <TextFlexBox>
        <PageFeedbacks isVisible={showTryBtn && primeFactors.length > 0}>
          <span
            style={{
              color: '#AA5EE0',
              background: '#F4E5FF',
              width: '40px',
              height: '28px',
              borderRadius: '5px',
              marginLeft: '3px',
              marginRight: '3px',
            }}
          >
            {resolvedInputValue}
          </span>{' '}
          is a
          <span
            style={{
              color: ' #D97A1A',
              background: ' #FFEDB8',
              width: '185px',
              height: '28px',
              borderRadius: '5px',
              marginLeft: '3px',
              marginRight: '3px',
            }}
          >
            &nbsp;composite number&nbsp;
          </span>{' '}
          composed of prime number
          {primeFactors.length > 1 ? 's' : ''}&nbsp;{primeFactors.join(', ')}.
        </PageFeedbacks>
      </TextFlexBox>
      <TextFlexBox>
        <PageFeedbacks isVisible={showTryBtn && primeFactors.length == 0}>
          <span
            style={{
              color: '#AA5EE0',
              background: '#F4E5FF',
              width: '40px',
              height: '28px',
              borderRadius: '5px',
              marginLeft: '5px',
              marginRight: '5px',
            }}
          >
            {resolvedInputValue}
          </span>{' '}
          is a
          <span
            style={{
              color: ' #FFFFFF',
              background: ' #FF8F1F',
              width: '145px',
              height: '28px',
              borderRadius: '5px',
              marginLeft: '5px',
              marginRight: '5px',
            }}
          >
            &nbsp;prime number&nbsp;
          </span>{' '}
          with only two factors, 1 and itself.
        </PageFeedbacks>
      </TextFlexBox>
      <OnboardingController>
        <OnboardingStep index={0}>
          <AnswerInputOnboarding complete={hasClicked} />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}
