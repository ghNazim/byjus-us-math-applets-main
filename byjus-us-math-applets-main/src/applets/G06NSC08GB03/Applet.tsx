import { FC, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import { AnimatedTryButton, TextButton } from './Buttons/AnimatedButtons'
import { ProgressBar } from './Components/FractionBar'
import tryNewSVG from './Dropdown/Asset/tryNew.svg'
import { Dropdown } from './Dropdown/Dropdown'

const animateSplit = keyframes`
  from {
    --split-degree: 90deg;
  }
  to {
    --split-degree: 180deg;
  }
`
const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
`
const ColoredBG = styled.div<{ isHorizontal: boolean; animated: boolean }>`
  @property --split-degree {
    syntax: '<angle>';
    inherits: false;
    initial-value: 90deg;
  }
  position: absolute;
  top: 90px;
  left: 20px;
  width: 680px;
  height: 440px;
  border-radius: 12px;
  background: linear-gradient(var(--split-degree), #ffe9d4 50%, #dff1f1 50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 200px;
  transition: 0.3s ease-out;
  animation: ${(props) => (props.isHorizontal ? animateSplit : 'none')} 1s ease-out both;
`
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`
const PageFeedbacks = styled.label<{ move?: boolean; fading?: boolean }>`
  position: absolute;
  top: 610px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #444444;
  transition: 0.3s ease-out;
  animation: ${({ fading }) => (fading ? fadeOut : fadeIn)} 0.3s ease-out;
  opacity: ${({ fading }) => (fading ? 0 : 1)};
`
const FractionLabels = styled.label<{ color: string }>`
  color: ${(props) => props.color};
  font-family: 'Nunito';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ComparisonLabels = styled.label`
  position: absolute;
  top: 290px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 42px;
  border-radius: 4px;
  background: var(--monotone-500, #fff);
  color: var(--monotone-100, #444);
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const AppletOnboarding = styled(OnboardingAnimation)<{ left: number; top: number; type: string }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  width: 400px;
  z-index: 1;
  pointer-events: none;
`

const dropDownVals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export const AppletG06NSC08GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [numA, setNumA] = useState(0)
  const [numB, setNumB] = useState(0)
  const [denA, setDenA] = useState(0)
  const [denB, setDenB] = useState(0)
  const [selectStage, setStage] = useState(0)
  const [dropDownArrA, setDropDownArrA] = useState(dropDownVals)
  const [dropDownArrB, setDropDownArrB] = useState(dropDownVals)
  const [clickStage, setClickStage] = useState(0)
  const [comparedVal, setComparedVal] = useState<'greater' | 'lesser' | 'equal'>()

  function ResetApp() {
    setNumA(0)
    setNumB(0)
    setDenA(0)
    setDenB(0)
    setStage(0)
    setClickStage(0)
    setDropDownArrA(dropDownVals)
    setDropDownArrB(dropDownVals)
    return null
  }

  useEffect(() => {
    if (numA > 0) setStage(1)
    else if (denA > 0) setStage(2)
    else setStage(0)
  }, [denA, numA])

  useEffect(() => {
    if (numB > 0) setStage(3)
    else if (denB > 0) setStage(4)
    else setStage(0)
  }, [denB, numB])

  useEffect(() => {
    switch (selectStage) {
      case 1:
        setDropDownArrA(dropDownVals.filter((i) => i >= numA))
        break
      case 2:
        setDropDownArrA(dropDownVals.filter((i) => i <= denA))
        break
      case 3:
        setDropDownArrB(dropDownVals.filter((i) => i >= numB))
        break
      case 4:
        setDropDownArrB(dropDownVals.filter((i) => i <= denB))
        break
      default:
        setDropDownArrA(dropDownVals)
    }
  }, [denA, denB, numA, numB, selectStage])

  const onNextClick = () => {
    setClickStage(1)
  }

  const onTryNewClick = () => {
    setClickStage(0)
    ResetApp()
  }

  useEffect(() => {
    const valA = numA / denA
    const valB = numB / denB

    if (valA > valB) setComparedVal('greater')
    else if (valA < valB) setComparedVal('lesser')
    else setComparedVal('equal')
  }, [denA, denB, numA, numB])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-rpc01-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Comparison of the Rational Numbers."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <ColoredBG
        isHorizontal={clickStage !== 0}
        key={clickStage}
        animated={clickStage === 0 || clickStage === 1}
      >
        {clickStage === 0 && (
          <>
            <DropdownContainer>
              <Dropdown
                dropDownArray={dropDownArrA}
                menuPosition="top"
                onValueChange={setNumA}
              ></Dropdown>
              <line style={{ width: '100%', height: '1px', backgroundColor: '#000' }}></line>
              <Dropdown
                dropDownArray={dropDownArrA}
                menuPosition="bottom"
                onValueChange={setDenA}
              ></Dropdown>
            </DropdownContainer>
            <DropdownContainer>
              <Dropdown
                dropDownArray={dropDownArrB}
                menuPosition="top"
                onValueChange={setNumB}
              ></Dropdown>
              <line style={{ width: '100%', height: '1px', backgroundColor: '#000' }}></line>
              <Dropdown
                dropDownArray={dropDownArrB}
                menuPosition="bottom"
                onValueChange={setDenB}
              ></Dropdown>
            </DropdownContainer>
          </>
        )}
        {clickStage === 1 && (
          <div
            style={{
              position: 'relative',
              left: '35px',
              display: 'flex',
              flexDirection: 'column',
              gap: 130,
            }}
          >
            <ProgressBar
              numerator={numA}
              denominator={denA}
              highlightColor="#FF8F1F"
              dehighlightColor="#FFD2A6"
            />
            <ProgressBar
              numerator={numB}
              denominator={denB}
              highlightColor="#428C94"
              dehighlightColor="#BCDFDF"
            />
          </div>
        )}
      </ColoredBG>
      {clickStage === 1 && (
        <>
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '173px',
              left: '100px',
              translate: '-50%',
              flexDirection: 'column',
            }}
          >
            <FractionLabels style={{ borderBottom: '2px solid #FF8F1F' }} color="#FF8F1F">
              {numA}
            </FractionLabels>
            <FractionLabels color="#FF8F1F">{denA}</FractionLabels>
          </div>
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '388px',
              left: '100px',
              translate: '-50%',
              flexDirection: 'column',
            }}
          >
            <FractionLabels style={{ borderBottom: '2px solid #428C94' }} color="#428C94">
              {numB}
            </FractionLabels>
            <FractionLabels color="#428C94">{denB}</FractionLabels>
          </div>
          <ComparisonLabels>
            {comparedVal === 'greater'
              ? 'is greater than'
              : comparedVal === 'lesser'
              ? 'is lesser than'
              : 'is equal to'}
          </ComparisonLabels>
        </>
      )}
      <PageFeedbacks fading={clickStage == 1}>
        Insert the rational numbers to compare.
      </PageFeedbacks>
      <PageFeedbacks fading={clickStage == 0} style={{ top: '600px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '5px',
            background: '#FFE9D4',
            height: '56px',
            width: '34px',
          }}
        >
          <FractionLabels style={{ borderBottom: '2px solid #FF8F1F' }} color="#FF8F1F">
            {numA}
          </FractionLabels>
          <FractionLabels color="#FF8F1F">{denA}</FractionLabels>
        </div>
        &nbsp; &nbsp;
        {comparedVal === 'greater'
          ? 'is greater than'
          : comparedVal === 'lesser'
          ? 'is lesser than'
          : 'is equal to'}
        &nbsp; &nbsp;
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '5px',
            background: '#DFF1F1',
            height: '56px',
            width: '34px',
          }}
        >
          <FractionLabels style={{ borderBottom: '2px solid #428C94' }} color="#428C94">
            {numB}
          </FractionLabels>
          <FractionLabels color="#428C94">{denB}</FractionLabels>
        </div>
      </PageFeedbacks>
      {clickStage == 0 && (
        <TextButton
          onClick={onNextClick}
          disabled={!(numA > 0 && numB > 0 && denA > 0 && denB > 0)}
        >
          Next
        </TextButton>
      )}
      {clickStage == 1 && (
        <AnimatedTryButton imgSource={tryNewSVG} onClick={onTryNewClick}>
          Try new
        </AnimatedTryButton>
      )}
      <OnboardingController>
        <OnboardingStep index={0}>
          <AppletOnboarding type="click" top={200} left={40} complete={numA > 0} />
        </OnboardingStep>
        <OnboardingStep index={1}>
          <AppletOnboarding type="click" top={320} left={40} complete={denA > 0} />
        </OnboardingStep>
        <OnboardingStep index={2}>
          <AppletOnboarding type="click" top={200} left={360} complete={numB > 0} />
        </OnboardingStep>
        <OnboardingStep index={3}>
          <AppletOnboarding type="click" top={320} left={360} complete={denB > 0} />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}
