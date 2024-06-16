import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { StepperButton } from '@/atoms/StepperButton'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import {
  AbsolutePosition,
  DisplayFlexJutifyAlignCenter,
  SpecifyWidthHeight,
  WidthFull,
} from '@/common/StyledComponents/StyledTemplates'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const OpacityDiv = styled.div<{ active: boolean }>`
  opacity: ${(props) => (props.active ? 1 : 0.5)};
`

const GeogebraContainer = styled(Geogebra)<{ visible: boolean }>`
  display: flex;
  opacity: ${(props) => (props.visible ? 1 : 0.01)};
  height: 100%;
  align-items: flex-end;
`

const AbsolutePositionDiv = styled.div`
  ${AbsolutePosition}
  ${DisplayFlexJutifyAlignCenter}
  ${WidthFull}
`

const OnboardingAnim = styled(OnboardingAnimation)`
  ${AbsolutePosition}
`

const FlexDirColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
`

const PatchForPauseBtn = styled.div`
  ${AbsolutePosition}
`
const PatchFill = styled.div`
  ${SpecifyWidthHeight}
  background-color: white;
`

const objectsArrayForClickSound = ['CTAstart', 'CTAadd', 'CTAnext', 'CTAcheck']

export const AppletG06RPC10S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbPart1Api = useRef<GeogebraAppApi | null>(null)
  const ggbPart2Api = useRef<GeogebraAppApi | null>(null)
  const [numberOfBottles, setNumberOfBottles] = useState(0)
  const [numberOfGlasses, setNumberOfGlasses] = useState(0)
  const [currentGgbLoaded, setCurrentGgbLoaded] = useState(1)
  const [isUserChangedBottleNumbersAgain, setIsUserChangedBottleNumbersAgain] = useState(false)
  const [ggbLoaded, setGgbLoaded] = useState(false)

  const [currentLayer, setCurrentLayer] = useState(0) //this is from ggb. They're tracking the progress
  //using this variable

  //sound
  const playWronAnswerSound = useSFX('incorrect')
  const playCorrectAnswerSound = useSFX('correct')
  const playMouseClick = useSFX('mouseClick')

  const clientListener: ClientListener = (e) => {
    if (e.type == 'mouseDown' && objectsArrayForClickSound.includes(e.hits[0])) {
      playMouseClick()
    }
  }

  const onGgbPart1Load = useCallback((api: GeogebraAppApi | null) => {
    ggbPart1Api.current = api
    if (api) {
      setGgbLoaded(true)
      api.registerObjectUpdateListener('layer', () => {
        if (api) {
          const layerVal = api.getValue('layer')
          setCurrentLayer(layerVal)
        }
      })

      api.registerObjectClickListener('CTAnext', () => {
        // playMouseClick()
        setCurrentGgbLoaded(2)
        setGgbLoaded(false)
        setNumberOfBottles(0)
      })

      api.registerClientListener(clientListener)

      return () => {
        if (api) {
          api.unregisterObjectUpdateListener('layer')
          api.unregisterObjectClickListener('CTAnext')
          api.unregisterClientListener(clientListener)
        }
      }
    }
  }, [])

  const onGgbPart2Load = useCallback((api: GeogebraAppApi | null) => {
    ggbPart2Api.current = api
    if (api) {
      setGgbLoaded(true)
      api.registerObjectUpdateListener('layer', () => {
        if (api) {
          const layerVal = api.getValue('layer')

          setCurrentLayer(layerVal)
        }
      })

      api.registerObjectClickListener('CTAreset', () => {
        api.unregisterObjectUpdateListener('layer')
        playMouseClick()
        setCurrentGgbLoaded(1)
        setNumberOfBottles(0)
        setNumberOfGlasses(0)
        setCurrentLayer(0)
      })

      api.registerObjectUpdateListener('VAgreen', () => {
        if (api.getVisible('VAgreen')) {
          playCorrectAnswerSound()
        }
      })

      api.registerClientListener(clientListener)

      return () => {
        if (api) {
          api.unregisterObjectUpdateListener('layer')
          api.unregisterObjectClickListener('CTAreset')
          api.unregisterObjectUpdateListener('VAgreen')
          api.unregisterClientListener(clientListener)
        }
      }
    }
  }, [])

  const handleStepperChangeForBottles = (val: number) => {
    setNumberOfBottles(val)
  }

  const handleStepperChangeForGlasses = (val: number) => {
    setNumberOfGlasses(val)
  }

  useEffect(() => {
    if (ggbPart1Api.current && currentGgbLoaded === 1) {
      ggbPart1Api.current.setValue('pint_{1}', numberOfBottles)
    } else if (ggbPart2Api.current && currentGgbLoaded == 2) {
      ggbPart2Api.current.setValue('pint_{1}', numberOfBottles)
    }
    //this will update the number of glasses in the ggb

    if (currentLayer === 3) {
      setIsUserChangedBottleNumbersAgain(true)
      //im doing this to hide the onboarding animation when user changes the number
      //of glasses second time
    }
  }, [numberOfBottles, currentGgbLoaded])

  useEffect(() => {
    if (ggbPart2Api.current) {
      ggbPart2Api.current.setValue('cup_1', numberOfGlasses)
    }
    //this will update the number of glasses in ggb
  }, [numberOfGlasses])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-rpc10-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Conversion of regular customary units to
mixed customary units."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />

      {currentGgbLoaded == 1 ? (
        <GeogebraContainer materialId="hu6vrkzr" onApiReady={onGgbPart1Load} visible />
      ) : (
        <GeogebraContainer materialId="azv6u3c6" onApiReady={onGgbPart2Load} visible />
      )}
      {ggbLoaded && (
        <OnboardingController>
          {currentLayer >= 1 && currentGgbLoaded === 1 && currentLayer !== 5 ? (
            <AbsolutePositionDiv top={600}>
              <FlexDirColumn>
                <OpacityDiv active={!(currentLayer == 2 || currentLayer == 4 || currentLayer == 7)}>
                  Pints
                </OpacityDiv>
                <StepperButton
                  max={4}
                  min={0}
                  onChange={handleStepperChangeForBottles}
                  disabled={currentLayer == 2 || currentLayer == 4}
                />
              </FlexDirColumn>
            </AbsolutePositionDiv>
          ) : null}

          {currentGgbLoaded === 2 ? (
            <>
              <AbsolutePositionDiv top={600} style={{ gap: '20px' }}>
                <FlexDirColumn>
                  <OpacityDiv
                    active={!(currentLayer == 2 || currentLayer == 4 || currentLayer == 7)}
                  >
                    Pints
                  </OpacityDiv>
                  <StepperButton
                    max={4}
                    min={0}
                    onChange={handleStepperChangeForBottles}
                    disabled={currentLayer == 2 || currentLayer == 4 || currentLayer === 7}
                  />
                </FlexDirColumn>
                <FlexDirColumn>
                  <OpacityDiv
                    active={!(currentLayer == 2 || currentLayer == 4 || currentLayer == 7)}
                  >
                    Cups
                  </OpacityDiv>
                  <StepperButton
                    max={4}
                    min={0}
                    onChange={handleStepperChangeForGlasses}
                    disabled={currentLayer == 2 || currentLayer == 4 || currentLayer === 7}
                  />
                </FlexDirColumn>
              </AbsolutePositionDiv>
            </>
          ) : null}
          <OnboardingStep index={0}>
            <OnboardingAnim type="click" complete={currentLayer > 0} left={280} top={700} />
          </OnboardingStep>
          {currentLayer === 1 && (
            <OnboardingStep index={1}>
              <OnboardingAnim type="click" complete={numberOfBottles > 0} left={350} top={620} />
            </OnboardingStep>
          )}

          {currentLayer === 3 && (
            <OnboardingStep index={2}>
              <OnboardingAnim
                type="click"
                complete={isUserChangedBottleNumbersAgain}
                left={numberOfBottles == 1 ? 350 : 220}
                top={620}
              />
            </OnboardingStep>
          )}
        </OnboardingController>
      )}
      <PatchForPauseBtn top={700}>
        <PatchFill height={100} width={50} />
      </PatchForPauseBtn>
    </AppletContainer>
  )
}
