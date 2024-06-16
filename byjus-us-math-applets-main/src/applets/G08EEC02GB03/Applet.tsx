import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { PrimaryRangeSlider } from '@/atoms/RangeSlider'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import video from './Lottie File/Multiplication Table.json'

const AnimContainer = styled(Player)`
  position: absolute;
  top: -40px;
  width: 720px;
  height: 800px;
  border-radius: 6px;
`
const SliderContainer = styled.div`
  position: absolute;
  top: 710px;
  left: 51%;
  translate: -50%;
  width: 410px;
  height: 50px;
`
const MathContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  top: 645px;
  left: 51%;
  translate: -50%;
  width: auto;
  gap: 12px;
  height: 50px;
`
const RowContainer = styled.div`
  box-sizing: border-box;
  width: auto;
  padding: 4px 12px;
  height: 39px;
  background: #faf2ff;
  border: 2px solid #c882fa;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #aa5ee0;
`
const MultiplySymb = styled.div`
  width: 11px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const EqualSymb = styled.div`
  width: 11px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const ColumnContainer = styled.div`
  width: auto;
  padding: 4px 12px;
  height: 39px;
  background: #fff6db;
  border: 2px solid #f0a000;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #cf8b04;
`
const AnswerContainer = styled.div`
  box-sizing: border-box;
  width: auto;
  padding: 4px 12px;
  height: 39px;
  background: #ccffdd;
  border: 2px solid #41d98d;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #32a66c;
`
const XOnboarding = styled(OnboardingAnimation).attrs({ type: 'moveRight' })`
  position: absolute;
  top: 670px;
  left: -37px;
  pointer-events: none;
`
export const AppletG08EEC02GB03: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [coord, setCoord] = useState(1)

  const hasCoordChanged = useHasChanged(coord)
  const playerRef = useRef<Player>(null)

  const onSliderChange = useCallback((value: number) => {
    if (playerRef.current == null) {
      return
    }
    setCoord(value)
    playerRef.current.setSeeker(value * 19)
  }, [])

  useEffect(() => {
    if (playerRef.current) playerRef.current.setSeeker(22)
  }, [])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'G08EEC02GB03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Move the slider to locate a perfect square and observe its square root in the multiplication table."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <AnimContainer renderer="svg" src={video} ref={playerRef}></AnimContainer>
      <SliderContainer>
        <PrimaryRangeSlider
          min={1}
          max={12}
          onChangeBegin={() => playMouseIn()}
          onChangeComplete={() => playMouseOut()}
          onChange={onSliderChange}
        />
      </SliderContainer>
      <MathContainer>
        <AnswerContainer>{coord * coord}</AnswerContainer>
        <EqualSymb>=</EqualSymb>
        <RowContainer>{coord}</RowContainer>
        <MultiplySymb>×</MultiplySymb>
        <ColumnContainer>{coord}</ColumnContainer>
      </MathContainer>
      <OnboardingController>
        <OnboardingStep index={0}>
          <XOnboarding complete={hasCoordChanged} />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}
