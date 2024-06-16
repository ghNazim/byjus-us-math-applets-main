import { number } from 'mathjs'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import InputField from './components/InputField'

const StyledGeogebra = styled(Geogebra)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
`

const Inputs = styled.div`
  display: inline-flex;
  justify-content: center;
  position: absolute;
  top: 300px;
  width: 100%;
  gap: 10px;
  align-items: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`

const OnbaordingAnim = styled(OnboardingAnimation)<{ top: number; left: number }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
`

const PathToHideNextBtn = styled.div`
  height: 80px;
  width: 100%;
  background-color: white;
  opacity: 0.6;
  position: absolute;
  bottom: 30px;
`
const PathToHidePause = styled.div`
  height: 30px;
  width: 30px;
  background-color: white;
  position: absolute;
  bottom: 41px;
  left: 22px;
  /* border: 1px solid black; */
`

const BottomText = styled.div`
  //styleName: Sub heading/Bold;
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
  color: #444;
  position: absolute;
  width: 100%;
  bottom: 130px;
`

export const AppletG06NSC02S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [value1, setValue1] = useState<number>(-1)
  const [value2, setValue2] = useState<number>(-1)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [hideOnboarding1, setHideOnboarding1] = useState(false)
  const [hideNextBtn, setHideNextBtn] = useState(true)
  const [value1GreaterThanTwo, setValue1GreaterThanTwo] = useState(false)
  const [value2GreaterThanTwo, setValue2GreaterThanTwo] = useState(false)

  const playMouseClick = useSFX('mouseClick')

  const onApiReady = useCallback((api: GeogebraAppApi | null) => {
    if (api !== null) {
      setGgbLoaded(true)
      ggbApi.current = api
    }
  }, [])

  useEffect(() => {
    if (value1 >= 0 && value1 <= 2 && value2 >= 0 && value2 <= 2) {
      setHideNextBtn(false)
    } else {
      setHideNextBtn(true)
    }

    if (ggbApi.current) {
      ggbApi.current.setValue('b', value1)
      ggbApi.current.setValue('a', value2)
    }
  }, [value1, value2])

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.registerObjectUpdateListener('frame', () => {
        setCurrentFrame(ggbApi.current ? ggbApi.current.getValue('frame') : 0)
      })

      ggbApi.current.registerObjectClickListener('next', () => {
        playMouseClick()
      })
      ggbApi.current.registerObjectClickListener('add', () => {
        playMouseClick()
      })
      ggbApi.current.registerObjectClickListener('trynew', () => {
        playMouseClick()
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('frame')
        ggbApi.current?.unregisterObjectClickListener('next')
        ggbApi.current?.unregisterObjectClickListener('add')
        ggbApi.current?.unregisterObjectClickListener('trynew')
      }
    }
  }, [ggbLoaded])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#fafafa',
        id: 'g06-nsc02-s1-gb02',
        onEvent,
        className,
      }}
    >
      <StyledGeogebra materialId="ubsegczv" onApiReady={onApiReady} />
      {ggbLoaded ? (
        <>
          <OnboardingController>
            {currentFrame === 0 ? (
              <Inputs>
                <InputField
                  onChange={(val) => {
                    setValue1(val)
                  }}
                  currentValue={value1 >= 0 ? value1.toString() : ''}
                  placeHolder="0.00"
                  side="left"
                  onClick={() => setHideOnboarding1(true)}
                  errorState={(err) => setValue1GreaterThanTwo(err)}
                />

                <span>+</span>
                <InputField
                  currentValue={value2 >= 0 ? value2.toString() : ''}
                  onChange={(val) => {
                    setValue2(val)
                  }}
                  placeHolder="0.00"
                  side="right"
                  errorState={(err) => setValue2GreaterThanTwo(err)}
                />
              </Inputs>
            ) : undefined}
            <OnboardingStep index={0}>
              <OnbaordingAnim top={297} left={221} type="click" complete={hideOnboarding1} />
            </OnboardingStep>
          </OnboardingController>
          {hideNextBtn && <PathToHideNextBtn />}
          <PathToHidePause />
          {currentFrame == 0 ? (
            <BottomText>
              {value1GreaterThanTwo || value2GreaterThanTwo ? (
                <>Enter decimal numbers between 0 and 2 to find the sum.</>
              ) : (
                <>Enter decimal numbers between 0 and 2.</>
              )}
            </BottomText>
          ) : null}
        </>
      ) : undefined}

      {/* <TextHeader text="Hello World!" backgroundColor="#E7FBFF" buttonColor="#D1F7FF" /> */}
    </AppletContainer>
  )
}
