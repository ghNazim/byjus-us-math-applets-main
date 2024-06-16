import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { StepperButton } from '@/atoms/StepperButton'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import ClickAnimation from '../../assets/onboarding/click.json'
import Reseticon from './assets/Retry.svg'

const StyledGgb = styled(Geogebra)`
  position: absolute;
  top: 80px;
  height: 400px;
  width: 100%;
  /* border: 1px solid black; */
  overflow: hidden;
  display: flex;
  justify-content: center;
`

const Button = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  height: 60px;
  background: #1a1a1a;
  border-radius: 10px;
  color: white;
  font-size: 22px;
  opacity: ${(a) => (a.isActive ? 1 : 0.3)};
  cursor: ${(a) => (a.isActive ? 'pointer' : 'default')};
`

const ButtonWithTitle = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  gap: 1rem;
`

const ButtonContainer = styled.div<{ bottom: number }>`
  position: absolute;
  width: 100%;
  bottom: ${(a) => a.bottom}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  color: #444444;
`

const ColoredLabel = styled.div<{ top: number }>`
  position: absolute;
  top: ${(a) => a.top}px;
  color: #565656;
  background-color: white;
  padding: 2px;
  font-size: 22px;
  left: 180px;
`

const StepperBtn = styled(StepperButton)`
  width: 180px !important;
`

const Text = styled.div<{ left: number; top: number }>`
  position: relative;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  /* display: flex; */
  /* align-items: center; */
  text-align: center;
  color: #444444;
  width: 100%;
`

const Onboarding = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`

export const AppletG08EEC03S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const [outerBoxFixed, setOuterBoxFixed] = useState(false)
  const [outerBoxSizeChanged, setOuterBoxSizeChanged] = useState(false)
  const [outerBoxValue, setOuterBoxValue] = useState(0)
  const [innerBoxValue, setInnerBoxValue] = useState({ x: 0, y: 0, z: 0 })
  const [isNextBtnActive, setIsNextBtnActive] = useState(false)
  const [showFinalAnswer, setShowFinalAnswer] = useState(false)
  const [showOnBoardingForOuterbox, setShowOnBoardingForOuterBox] = useState(true)
  const [showOnBoardingForInnerbox, setShowOnBoardingForInnerBox] = useState(false)

  const handlereset = () => {
    setOuterBoxFixed(false)
    setOuterBoxSizeChanged(false)
    setOuterBoxValue(2)
    setInnerBoxValue({ x: 0, y: 0, z: 0 })
    setIsNextBtnActive(false)
    setShowFinalAnswer(false)
    setShowOnBoardingForInnerBox(false)
    setShowOnBoardingForOuterBox(true)
  }

  const handleGGBready = useCallback((api: GeogebraAppApi | null) => {
    if (api === null) return
    ggbApi.current = api
    setGGBLoaded(true)
    if (ggbApi.current) setOuterBoxValue(ggbApi.current.getValue('a'))

    // api.registerUpdateListener((e: any) => console.log(e))
  }, [])

  const changeSizeOfOuterBox = (e: number) => {
    setShowOnBoardingForOuterBox(false)
    setIsNextBtnActive(true)
    if (!outerBoxSizeChanged) setOuterBoxSizeChanged(true)
    setOuterBoxValue(e)
  }

  useEffect(() => {
    if (outerBoxFixed && ggbLoaded) {
      //onPressing next button and changing the values of boxes
      //inside
      setInnerBoxValue({ x: 1, y: 1, z: 1 })
    }
  }, [outerBoxFixed, ggbLoaded])

  useEffect(() => {
    //changing outerBoxValue with stepper
    ggbApi.current?.setValue('a', outerBoxValue)
  }, [outerBoxValue])

  useEffect(() => {
    ggbApi.current?.setValue('xSlider', innerBoxValue.x)
    ggbApi.current?.setValue('ySlider', innerBoxValue.y)
    ggbApi.current?.setValue('zSlider', innerBoxValue.z)

    if (
      innerBoxValue.x === outerBoxValue &&
      innerBoxValue.y === innerBoxValue.z &&
      innerBoxValue.y === outerBoxValue &&
      ggbLoaded
    ) {
      setIsNextBtnActive(true)
    } else {
      setIsNextBtnActive(false)
    }
  }, [innerBoxValue])

  const handleAlongLength = (e: number) => {
    const tmp = innerBoxValue
    tmp.x = e
    setInnerBoxValue({ ...tmp })

    if (showOnBoardingForInnerbox) setShowOnBoardingForInnerBox(false)
  }
  const handleAlongWidth = (e: number) => {
    const tmp = innerBoxValue
    tmp.y = e
    setInnerBoxValue({ ...tmp })

    if (showOnBoardingForInnerbox) setShowOnBoardingForInnerBox(false)
  }
  const handleAlongHeight = (e: number) => {
    const tmp = innerBoxValue
    tmp.z = e
    setInnerBoxValue({ ...tmp })

    if (showOnBoardingForInnerbox) setShowOnBoardingForInnerBox(false)
  }

  const handleNextBtn = () => {
    if (isNextBtnActive) {
      setOuterBoxFixed(true)
    }
    setIsNextBtnActive(false)

    if (
      innerBoxValue.x === outerBoxValue &&
      innerBoxValue.y === innerBoxValue.z &&
      innerBoxValue.y === outerBoxValue &&
      !showFinalAnswer
    ) {
      setShowFinalAnswer(true)
    }

    if (!showOnBoardingForInnerbox) setShowOnBoardingForInnerBox(true)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec03-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Fill the cube with unit cubes and find the volume"
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <StyledGgb materialId="sjqp9we9" onApiReady={handleGGBready} pointToTrack="s1" />
      {/* <ColoredLabel top={100}>{outerBoxValue}</ColoredLabel> */}
      {ggbLoaded && (
        <>
          {!outerBoxFixed ? (
            <Text left={0} top={520}>
              Construct a cube.
            </Text>
          ) : undefined}
          <ButtonContainer bottom={120}>
            {!outerBoxFixed ? (
              <ButtonWithTitle key={1}>
                Length of side
                <StepperBtn defaultValue={2} min={1} max={4} onChange={changeSizeOfOuterBox} />
              </ButtonWithTitle>
            ) : (
              !showFinalAnswer && (
                <>
                  <ButtonWithTitle key={2}>
                    Along length
                    <StepperBtn defaultValue={1} min={1} max={5} onChange={handleAlongLength} />
                  </ButtonWithTitle>
                  <ButtonWithTitle key={3}>
                    Along width
                    <StepperBtn defaultValue={1} min={1} max={5} onChange={handleAlongWidth} />
                  </ButtonWithTitle>
                  <ButtonWithTitle key={4}>
                    Along height
                    <StepperBtn defaultValue={1} min={1} max={5} onChange={handleAlongHeight} />
                  </ButtonWithTitle>
                </>
              )
            )}
          </ButtonContainer>

          {!showFinalAnswer && (
            <>
              <ButtonContainer bottom={40}>
                <Button onClick={handleNextBtn} isActive={isNextBtnActive}>
                  Next
                </Button>
              </ButtonContainer>
            </>
          )}

          {outerBoxFixed && (
            <Text left={0} top={490}>
              Count of unit cubes = {innerBoxValue.x} × {innerBoxValue.y} × {innerBoxValue.z}
            </Text>
          )}

          {showFinalAnswer ? (
            <>
              <Text left={0} top={500}>
                Volume of the cube = count of unit cubes x volume of 1 unit cube
                <br />= {innerBoxValue.x * innerBoxValue.y * innerBoxValue.z} unit cubes
              </Text>
              <ButtonContainer bottom={40}>
                <Button isActive={true} onClick={handlereset}>
                  <img src={Reseticon} /> Reset
                </Button>
              </ButtonContainer>
            </>
          ) : (
            <>
              {innerBoxValue.x > outerBoxValue ||
              innerBoxValue.y > outerBoxValue ||
              innerBoxValue.z > outerBoxValue ? (
                <Text top={500} left={0}>
                  Oops! remove the protruding unit cube
                  {innerBoxValue.x + innerBoxValue.y + innerBoxValue.z > outerBoxValue + 3
                    ? 's'
                    : ''}
                  .
                </Text>
              ) : innerBoxValue.x === outerBoxValue &&
                innerBoxValue.y === innerBoxValue.z &&
                innerBoxValue.y === outerBoxValue ? (
                <Text left={0} top={500}>
                  Fantastic! You&apos;ve filled the cube with unit cubes.
                </Text>
              ) : outerBoxFixed ? (
                <Text left={0} top={500}>
                  Now, add unit cubes to fill the cube.
                </Text>
              ) : undefined}
              {showOnBoardingForOuterbox && (
                <Onboarding src={ClickAnimation} left={340} top={620} autoplay loop />
              )}
              {showOnBoardingForInnerbox && (
                <div className="oaaaaa">
                  <Onboarding src={ClickAnimation} left={145} top={620} autoplay key={1} loop />
                  <Onboarding src={ClickAnimation} left={345} top={620} autoplay key={2} loop />
                  <Onboarding src={ClickAnimation} left={540} top={620} autoplay key={3} loop />
                </div>
              )}
            </>
          )}
        </>
      )}
    </AppletContainer>
  )
}
