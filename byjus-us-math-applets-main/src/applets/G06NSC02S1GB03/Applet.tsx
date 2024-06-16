import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { clampPrecision } from '@/utils/math'

import LeftpopImg from './assets/leftpopup.svg'
import RightpopImg from './assets/rightpopup.svg'
import InputField from './components/InputField'

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 700px;
  height: 500px;
  left: 10px;
  top: 150px;
  z-index: 0;
  margin-right: -1px;
  border: none;
  scale: 1.6;
  z-index: 0;
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

const LeftPop = styled.img`
  position: absolute;
  left: 100px;
  top: 380px;
  z-index: 1;
`

const RightPop = styled.img`
  position: absolute;
  left: 400px;
  top: 380px;
  z-index: 1;
`
export const AppletG06NSC02S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ipValue1, setIpValue1] = useState<string>('')
  const [ipValue2, setIpValue2] = useState<string>('')
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [hideOnboarding1, setHideOnboarding1] = useState(false)
  const [hideNextBtn, setHideNextBtn] = useState(true)

  const playMouseClick = useSFX('mouseClick')

  const onApiReady = useCallback((api: GeogebraAppApi | null) => {
    if (api !== null) {
      setGgbLoaded(true)
      ggbApi.current = api
    }
  }, [])

  const value1 = parseFloat(ipValue1)
  const value2 = parseFloat(ipValue2)

  useEffect(() => {
    if (value1 >= 0.01 && value1 <= 1.99 && value2 >= 0.01 && value2 <= 1.99) {
      setHideNextBtn(false)
    } else {
      setHideNextBtn(true)
    }

    if (ggbApi.current) {
      if (Number.isNaN(value1) || Number.isNaN(value2)) return
      ggbApi.current.setValue('a', value1)
      ggbApi.current.setValue('b', value2)
    }
    if (value1 === value2 || value1 > value2) {
      setHideNextBtn(false)
    } else {
      setHideNextBtn(true)
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
        setIpValue1('')
        setIpValue2('')
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('frame')
        ggbApi.current?.unregisterObjectClickListener('next')
        ggbApi.current?.unregisterObjectClickListener('add')
        ggbApi.current?.unregisterObjectClickListener('trynew')
      }
    }
  }, [ggbLoaded, playMouseClick])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc02-s1-gb02',
        onEvent,
        className,
      }}
    >
      <StyledGeogebra materialId="t5zqqmza" onApiReady={onApiReady} />
      {ggbLoaded ? (
        <>
          <OnboardingController>
            {currentFrame === 0 ? (
              <Inputs>
                <InputField
                  currentValue={clampPrecision(ipValue1, 2)}
                  onChange={(val) => {
                    setIpValue1(val)
                  }}
                  placeHolder="0.00"
                  onClick={() => setHideOnboarding1(true)}
                  errorState={value2 > value1 || value1 > 1.99} // Pass a boolean
                />

                <span>-</span>

                <InputField
                  currentValue={clampPrecision(ipValue2, 2)}
                  onChange={(val) => {
                    setIpValue2(val)
                  }}
                  placeHolder="0.00"
                  errorState={value2 > value1 || value2 > 1.99} // Pass a boolean
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
            <BottomText>Enter decimal numbers between 0 and 2.</BottomText>
          ) : null}
        </>
      ) : undefined}

      {/* <TextHeader text="Hello World!" backgroundColor="#E7FBFF" buttonColor="#D1F7FF" /> */}

      {(value1 < 0.01 || value1 > 1.99) && <LeftPop src={LeftpopImg} />}
      {value2 > value1 && <RightPop src={RightpopImg} />}
    </AppletContainer>
  )
}
