import { FC, ReactComponentElement, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { RangeInput } from '@/molecules/RangeInput'
import { approxeq } from '@/utils/math'

import next from './Assets/next.svg'
import resetbut from './Assets/reset.svg'
import start from './Assets/start.svg'
import tryagain from './Assets/tryagain.svg'

const GepgebraContainer = styled(Geogebra)`
  position: absolute;
  left: 30px;
  top: 100px;
`
const SliderContainer = styled.div`
  position: absolute;
  top: 590px;
  left: 50%;
  translate: -50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 22px;
`
const LeftSlider = styled(RangeInput)`
  width: 300px;
  height: 100px;
`
const RightSlider = styled(RangeInput)`
  width: 300px;
  height: 100px;
`
const Text = styled.div`
  width: 500px;
  height: 40px;

  position: absolute;
  left: 50%;
  translate: -50%;
  top: 520px;

  font-family: 'Brioso Pro';
  font-style: italic;
  font-weight: 400;
  font-size: 32px;
  line-height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  color: #444444;
`
const Button = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  transition: all.3s;
  :hover {
    scale: 1.05;
    cursor: pointer;
  }
  z-index: 1;
`
const ResetButton = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  transition: all.3s;
  :hover {
    scale: 1.05;
    cursor: pointer;
  }
  z-index: 2;
`

export const AppletG08EEC09S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [s1, sets1] = useState(0)
  const [s2, sets2] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [show, setShow] = useState(true)
  const [showResetButton, setShowresetButton] = useState(false)

  const onApihandle = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (!api) return
    setGgbLoaded(true)
  }, [])

  const onButtonClick = useCallback(() => {
    if (correct === -1) {
      ggbApi.current?.evalCommand('RunClickScript(TryAgainbutton)')
      setCorrect(0)
    } else if (correct === 0) {
      ggbApi.current?.evalCommand('RunClickScript(pic4)')
      setShow(false)
      const onUpdate = () => {
        const qNo = ggbApi.current?.getValue('NextQuestion')
        ggbApi.current?.evalCommand(`e = PathParameter(${qNo === 3 ? 'U_1' : 'V'})`)
        const progress = ggbApi.current?.getValue('e') ?? 0
        if (approxeq(progress, 0.85, 0.05)) {
          const answer = ggbApi.current?.getValue('boolright1')
          if (answer) setCorrect(1)
          else setCorrect(-1)
          setShow(true)
          ggbApi.current?.unregisterObjectUpdateListener('V')
          ggbApi.current?.unregisterObjectUpdateListener('U_1')
        }
      }
      ggbApi.current?.registerObjectUpdateListener('V', onUpdate)
      ggbApi.current?.registerObjectUpdateListener('U_1', onUpdate)
    } else {
      ggbApi.current?.evalCommand('RunClickScript(NextButton)')
      setCorrect(0)
      sets1(0)
      sets2(0)
    }
    if (ggbApi.current?.getValue('NextQuestion') === 3 && correct === 1) {
      setShowresetButton(true)
    }
  }, [correct])

  const handleLeftSliderChange = useCallback((value: number) => {
    if (!ggbApi.current) return
    ggbApi.current.setValue('m', value)
    sets1(value)
  }, [])

  const handleRightSliderChange = useCallback((value: number) => {
    if (!ggbApi.current) return
    ggbApi.current.setValue('b', value)
    sets2(value)
  }, [])

  useEffect(() => {
    if (!ggbApi.current) return

    // Handle Left Slider Change
    ggbApi.current.setValue('m', s1)

    // Handle Right Slider Change
    ggbApi.current.setValue('b', s2)

    const nextQuestion = ggbApi.current.getValue('NextQuestion')
    if (nextQuestion === 3 && correct === 1) {
      setShowresetButton(true)
    } else {
      setShowresetButton(false)
    }
  }, [correct, s1, s2])

  const onCLickResetButton = useCallback(() => {
    if (!ggbApi.current) return
    ggbApi.current?.evalCommand('RunClickScript(button1)')
    setCorrect(0)
    sets1(0)
    sets2(0)
  }, [])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec09-s1-gb04',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Guide your plane to the island."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />

      <GepgebraContainer materialId="yev82wdt" onApiReady={onApihandle} />
      {ggbLoaded && (
        <>
          {correct === 0 && show && (
            <SliderContainer>
              <LeftSlider
                min={-3}
                max={3}
                value={s1}
                defaultValue={0}
                label={() => {
                  return (
                    <div
                      style={{
                        color: '#D97A1A',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '16px',
                      }}
                    >
                      {'Slope'}
                    </div>
                  )
                }}
                onChange={handleLeftSliderChange}
              ></LeftSlider>
              <RightSlider
                min={-3}
                max={3}
                value={s2}
                defaultValue={0}
                label={() => {
                  return (
                    <div
                      style={{
                        color: '#AA5EE0',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '16px',
                      }}
                    >
                      {'y-intercept'}
                    </div>
                  )
                }}
                onChange={handleRightSliderChange}
              ></RightSlider>
            </SliderContainer>
          )}
          {show && (
            <Text>
              {correct === 0 && (
                <>
                  y =
                  <div
                    style={{
                      display: 'inline',
                      aspectRatio: 1,
                      height: '40px',
                      background: '#f7d4b1',
                      color: '#D97A1A',
                      borderRadius: '5px',
                      margin: '4px',
                      fontFamily: 'Nunito',
                      fontStyle: 'normal',
                    }}
                  >
                    {s1}
                  </div>
                  x+
                  <div
                    style={{
                      display: 'inline',
                      aspectRatio: 1,
                      height: '40px',
                      background: '#e4c6fa',
                      color: '#AA5EE0',
                      borderRadius: '5px',
                      margin: '4px',
                      fontFamily: 'Nunito',
                      fontStyle: 'normal',
                    }}
                  >
                    {s2}
                  </div>
                </>
              )}
              {correct == 1 && (
                <div
                  style={{
                    display: 'inline',
                    width: '500px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontFamily: 'Nunito',
                    fontWeight: 700,
                    fontStyle: 'normal',
                  }}
                >
                  Great! Keep going and land more planes safely.
                </div>
              )}
              {correct == -1 && (
                <div
                  style={{
                    display: 'inline',
                    width: '500px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontFamily: 'Nunito',
                    fontWeight: 700,
                    fontStyle: 'normal',
                  }}
                >
                  Don’t worry, landing can be challenging.
                </div>
              )}
            </Text>
          )}
          {show && (
            <Button
              src={correct === -1 ? tryagain : correct === 1 ? next : start}
              onClick={onButtonClick}
            />
          )}
        </>
      )}
      {ggbLoaded && showResetButton && (
        <ResetButton src={resetbut} onClick={onCLickResetButton}></ResetButton>
      )}
    </AppletContainer>
  )
}
