import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header/TextHeader'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { RangeInput } from '@/molecules/RangeInput'

import DecimalValue1 from './assets/dec1.jpg'
import DecimalValue2 from './assets/dec2.jpg'
import SquareImage from './assets/square.svg'
import Button, { ButtonState } from './components/Button'
import ShowFractionAndDecimal from './components/ShowFractionAndDecimal'

export type ButtonTypes = '10 Divisions' | '100 Divisions'

const StyledGgb = styled(Geogebra)`
  width: 100%;
  height: 40%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`

const BottomText = styled.div<{ top: number }>`
  position: absolute;
  width: 100%;
  top: ${(a) => a.top}px;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`

const OnboardingAnima = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`

const ButtonContainer = styled.div<{ top: number }>`
  position: absolute;
  width: 100%;
  justify-content: center;
  display: flex;
  gap: 3rem;
  top: ${(a) => a.top}px;
`

const SqrImg = styled.img`
  position: absolute;
  left: 78px;
  top: 136px;
  width: 166px;
  opacity: 0.95;
`

const SqrImg1 = styled.img`
  position: absolute;
  left: 280px;
  top: 136px;
  width: 166px;
  opacity: 0.95;
`
const SqrImg2 = styled.img`
  position: absolute;
  left: 482px;
  top: 136px;
  width: 166px;
  opacity: 0.95;
`
const DecValue1for10 = styled.img`
  position: absolute;
  left: 251px;
  top: 410px;
  width: 59.5px;
  height: 59.5px;
`

const DecValue2for10 = styled.img`
  position: absolute;
  left: 410px;
  top: 415px;
  width: 50px;
  height: 45px;
`
const BottomButton = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  background: #1a1a1a;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
  cursor: ${(a) => (a.isActive ? 'pointer' : 'default')};
  opacity: ${(a) => (a.isActive ? 1 : 0.2)};
  user-select: none;
`

const targetsForClickSound = ['button1', 'button2', 'button3', 'button4']
const sliderVariables = ['a', 'b']

export const AppletG06NSC02S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbReady, setGgbReady] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const [currentBtnSelected, setCurrentBtnSelected] = useState<ButtonTypes | null>(null)
  const [currentSliderVal, setCurrentSliderVal] = useState(1)
  const [showNextBtn, setShowNextBtn] = useState(true)

  //sound
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const clientEvent: ClientListener = useCallback((e) => {
    if (e.type === 'select' && targetsForClickSound.includes(e.target)) {
      playMouseClick()
    }

    if (e.type == 'select' && sliderVariables.includes(e.target)) {
      playMouseIn()
    } else if (e.type == 'dragEnd' && sliderVariables.includes(e.target)) {
      playMouseOut()
    } else if (
      e.type == 'mouseDown' &&
      (e.hits.includes(sliderVariables[0]) || e.hits.includes(sliderVariables[1]))
    ) {
      playMouseIn()
    }
  }, [])

  const onGGbReady = useCallback((api: GeogebraAppApi | null) => {
    if (!api) return
    setGgbReady(true)
    ggbApi.current = api
  }, [])

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.registerClientListener(clientEvent)

      return () => ggbApi.current?.unregisterClientListener(clientEvent)
    }
  }, [clientEvent, ggbReady])

  const handleBtnPress = (val: string) => {
    if (val === '10 Divisions') {
      setCurrentBtnSelected('10 Divisions')
    } else {
      setCurrentBtnSelected('100 Divisions')
    }
    playMouseClick()
  }

  useEffect(() => {
    if (currentBtnSelected === null) return
    else if (currentBtnSelected === '10 Divisions') {
      ggbApi.current?.setValue('type', 1)
    } else {
      ggbApi.current?.setValue('type', 2)
    }
  }, [currentBtnSelected])

  const handleCurrentBtnState = (btnState: ButtonTypes): ButtonState => {
    if (btnState === currentBtnSelected) {
      return 'selected'
    } else if (showNextBtn) {
      return 'default'
    } else {
      return 'disabled'
    }
  }

  const handleSlider = (val: number) => {
    setCurrentSliderVal(currentBtnSelected === '10 Divisions' ? val * 10 : val)
  }

  const handleNextBtn = () => {
    if (currentBtnSelected !== null) {
      ggbApi.current?.setValue('nextValue', 2)
      setShowNextBtn(false)
      playMouseClick()
    }
  }

  const handleRetryBtn = () => {
    if (currentSliderVal === 300) {
      setShowNextBtn(true)
      ggbApi.current?.setValue('type', 0)
      setCurrentBtnSelected(null)
      setCurrentSliderVal(1)
      playMouseClick()
    }
  }

  useEffect(() => {
    if (ggbApi.current && ggbReady) {
      ggbApi.current?.setValue('a', currentSliderVal)
    }
  }, [currentSliderVal, ggbReady, showNextBtn])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-nsc02-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Visual representation of decimals and fractions."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />

      <OnboardingController>
        <StyledGgb materialId="c9wercbc" onApiReady={onGGbReady} />
        {ggbReady && (
          <>
            {showNextBtn ? (
              <>
                <BottomText top={350}>Choose the number of divisions</BottomText>
                <ButtonContainer top={400}>
                  <Button
                    onClick={handleBtnPress}
                    value="10 Divisions"
                    currentBtnState={handleCurrentBtnState('10 Divisions')}
                  />
                  <Button
                    onClick={handleBtnPress}
                    value="100 Divisions"
                    currentBtnState={handleCurrentBtnState('100 Divisions')}
                  />
                </ButtonContainer>
                <ButtonContainer top={640}>
                  <BottomButton onClick={handleNextBtn} isActive={currentBtnSelected !== null}>
                    Next
                  </BottomButton>
                </ButtonContainer>
              </>
            ) : (
              <>
                <div
                  style={{
                    position: 'absolute',
                    top: '520px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <RangeInput
                    min={1}
                    max={currentBtnSelected === '100 Divisions' ? 300 : 30}
                    step={1}
                    onChange={handleSlider}
                    disableTicks
                  />
                </div>
                <ButtonContainer top={640}>
                  <BottomButton onClick={handleRetryBtn} isActive={currentSliderVal === 300}>
                    Retry
                  </BottomButton>
                </ButtonContainer>
                <div
                  style={{
                    position: 'absolute',
                    top: '400px',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  <ShowFractionAndDecimal val={currentSliderVal} valType={currentBtnSelected!} />
                </div>
              </>
            )}
            <OnboardingStep index={0}>
              <OnboardingAnima
                left={157}
                top={376}
                type="click"
                complete={currentBtnSelected !== null}
              />
            </OnboardingStep>

            <OnboardingStep index={1}>
              <OnboardingAnima left={290} top={630} type="click" complete={!showNextBtn} />
            </OnboardingStep>
            <OnboardingStep index={2}>
              <OnboardingAnima
                left={-90}
                top={540}
                type="moveRight"
                complete={currentSliderVal !== 0}
              />
            </OnboardingStep>
          </>
        )}
      </OnboardingController>
      {currentSliderVal >= 100 && currentBtnSelected === '10 Divisions' && (
        <SqrImg src={SquareImage} />
      )}
      {currentSliderVal >= 200 && currentBtnSelected === '10 Divisions' && (
        <SqrImg1 src={SquareImage} />
      )}
      {currentSliderVal >= 300 && currentBtnSelected === '10 Divisions' && (
        <SqrImg2 src={SquareImage} />
      )}
      {currentSliderVal >= 100 && currentBtnSelected === '100 Divisions' && (
        <SqrImg src={SquareImage} />
      )}
      {currentSliderVal >= 200 && currentBtnSelected === '100 Divisions' && (
        <SqrImg1 src={SquareImage} />
      )}
      {currentSliderVal >= 300 && currentBtnSelected === '100 Divisions' && (
        <SqrImg2 src={SquareImage} />
      )}

      {currentSliderVal === 1 &&
        ggbApi.current?.getValue('nextValue') === 2 &&
        currentBtnSelected === '10 Divisions' &&
        ggbApi.current?.getValue('type') === 1 && <DecValue1for10 src={DecimalValue1} />}
      {currentSliderVal === 1 &&
        ggbApi.current?.getValue('nextValue') === 2 &&
        currentBtnSelected === '10 Divisions' &&
        ggbApi.current?.getValue('type') === 1 && <DecValue2for10 src={DecimalValue2} />}
    </AppletContainer>
  )
}
