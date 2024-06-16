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
import { useHasChanged } from '@/hooks/useHasChanged'
import { useSFX } from '@/hooks/useSFX'
import { RangeInput } from '@/molecules/RangeInput'

import noteIcon from './Assets/noteIcon.svg'
import plot from './Assets/plot.svg'
import showAllIcon from './Assets/showAllIcon.svg'
import table from './Assets/table.svg'
import tableBox from './Assets/tableBox.svg'
import tryNew from './Assets/tryNew.svg'
import { OutlineButton, TextButton, TextImgButton, ToggleButtton } from './Buttons/Buttons'

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 61px;
  left: 1px;
`
const LeftSlider = styled(RangeInput)`
  width: 300px;
  height: 100px;
`
const RightSlider = styled(RangeInput)`
  width: 300px;
  height: 100px;
`
const CentreSlider = styled(RangeInput)`
  width: 640px;
  height: 16px;
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
const ValueFlexBox = styled.div<{ moveUp?: boolean; moveLeft?: boolean; move?: boolean }>`
  top: ${(props) =>
    props.moveUp || props.moveLeft || props.move
      ? props.moveLeft
        ? props.move
          ? 150
          : 205
        : 153
      : 217}px;
  left: ${(props) => (props.moveLeft ? 110 : 306)}px;
  width: 50px;
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: row;
  transition: 0.3s;
`
const ValueText1 = styled.label`
  position: relative;
  left: -15px;
  width: auto;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #1cb9d9;
  transition: 0.3s;
`
const ValueText2 = styled.label`
  position: relative;
  left: 60px;
  width: auto;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ed6b90;
  transition: 0.3s;
`
const ValueText3 = styled.label<{ moveUp: boolean }>`
  position: relative;
  top: ${(props) => (props.moveUp ? -67 : -12)}px;
  left: 187px;
  width: auto;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #1cb9d9;
  transition: 0.3s;
`
const ValueText4 = styled.label<{ moveUp: boolean }>`
  position: relative;
  top: ${(props) => (props.moveUp ? -67 : -12)}px;
  left: 250px;
  width: auto;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ed6b90;
  transition: 0.3s;
`
const TextFlexBox = styled.div`
  position: absolute;
  top: 400px;
  left: 50%;
  width: 700px;
  height: 28px;
  translate: -50%;
  display: flex;
  justify-content: center;
  flex-direction: row;
`
const PageFeedbacks = styled.label`
  width: auto;
  height: 28px;
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
`
const ToggleContainer = styled.div`
  position: absolute;
  top: 620px;
  left: 50%;
  translate: -50%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 15px;
`
const NumberLabel1 = styled.label<{ left: number }>`
  position: relative;
  top: 102px;
  left: ${(props) => props.left - 332}px;
  width: 20px;
  height: 24px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
`
const NumberLabel2 = styled.label<{ left: number }>`
  position: relative;
  top: 102px;
  left: ${(props) => props.left - 332}px;
  width: auto;
  padding: 1px 1px;
  height: 24px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
`
const TableContainer = styled.div`
  position: absolute;
  left: 20px;
  top: 100px;
  justify-content: center;
  flex-direction: column;
`
const BgBox = styled.div`
  position: absolute;
  top: 80px;
  width: 800px;
  height: 500px;
  background: #ffffff;
`
const TableBox = styled.img`
  width: 680px;
  height: 320px;
`
const PositiveContainer = styled.div`
  position: relative;
  top: 80px;
  left: 240px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`
const PurpleTableText = styled.label`
  width: 220px;
  height: 60px;
  background: #faf2ff;
  border: 1px solid #f4e5ff;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #aa5ee0;
  align-items: center;
  text-align: center;
  justify-content: center;
  display: flex;
  flex: none;
  order: 0;
  flex-grow: 0;
`
const NegativeContainer = styled.div`
  position: relative;
  top: -160px;
  left: 460px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`
const BlueTableText = styled.label`
  width: 220px;
  height: 60px;
  background: #e7fbff;
  border: 1px solid #f4e5ff;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #1cb9d9;
  flex: none;
  order: 0;
  flex-grow: 0;
`
const GrayText = styled.label`
  position: absolute;
  width: 220px;
  height: 60px;
  background: #ffffff;
  border: 1px solid #f4e5ff;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #b3b1b1;
  flex: none;
  order: 0;
  flex-grow: 0;
`
const LeftOnBoarding = styled(OnboardingAnimation).attrs({ type: 'moveHorizontally' })`
  position: absolute;
  top: 510px;
  left: 50px;
  height: 300px;
  width: 300px;
  pointer-events: none;
  z-index: 2;
`
const RightOnBoarding = styled(OnboardingAnimation).attrs({ type: 'moveHorizontally' })`
  position: absolute;
  top: 510px;
  left: 370px;
  height: 300px;
  width: 300px;
  pointer-events: none;
  z-index: 2;
`

function locatePoint2d(pointName: string, ggbApi: GeogebraAppApi, xOffset = 0) {
  const pointX = ggbApi.getValue(`x(${pointName})`) + xOffset
  const pointY = ggbApi.getValue(`y(${pointName})`)
  const cornor1X = ggbApi.getValue('x(Corner(1))')
  const cornor1Y = ggbApi.getValue('y(Corner(1))')
  const cornor2X = ggbApi.getValue('x(Corner(2))')
  const cornor4Y = ggbApi.getValue('y(Corner(4))')
  const heightInPixel = ggbApi.getValue('y(Corner(5))')
  const widthInPixel = ggbApi.getValue('x(Corner(5))')

  return {
    leftPixel: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
    topPixel: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
  }
}

const operators = ['Adding', 'Subtracting', 'Multiplying', 'Dividing']

export const AppletG07EEC04S1GB1: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGbLoaded] = useState(false)
  const [leftVal, setLeftVal] = useState(0)
  const [rightVal, setRightVal] = useState(0)
  const [centreVal, setCentreVal] = useState(0)
  const [clickStage, setClick] = useState(0)
  const [toggleStage, setToggle] = useState(0)
  const [leftAlt, setLeftAlt] = useState<number | undefined>()
  const [rightAlt, setRightAlt] = useState<number | undefined>()
  const [pointerRed, setPointerRed] = useState({ leftPixel: 0 })
  const [pointerBlue, setPointerBlue] = useState({ leftPixel: 0 })
  const [plotButtonDisable, setPlotDisable] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [showTryButton, setShowTry] = useState(false)
  const [addPos, setAddPos] = useState(false)
  const [addNeg, setAddNeg] = useState(false)
  const [subPos, setSubPos] = useState(false)
  const [subNeg, setSubNeg] = useState(false)
  const [mulPos, setMulPos] = useState(false)
  const [mulNeg, setMulNeg] = useState(false)
  const [divPos, setDivPos] = useState(false)
  const [divNeg, setDivNeg] = useState(false)
  const [noteClick, setNoteClick] = useState(false)

  const hasLeftValueChanged = useHasChanged(leftVal != 0)
  const hasRightValueChanged = useHasChanged(rightVal != 0)

  const playMouseClick = useSFX('mouseClick')

  const onApiReady = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGbLoaded(api != null)
  }, [])

  useEffect(() => {
    if (ggbApi.current) ggbApi.current.setValue('a', leftVal)
  }, [leftVal])

  useEffect(() => {
    if (ggbApi.current) ggbApi.current.setValue('b', rightVal)
  }, [rightVal])

  useEffect(() => {
    setLeftAlt(leftVal)
    setRightAlt(rightVal)
  }, [leftVal, rightVal])

  const onPlotOneClick = () => {
    playMouseClick()
    if (ggbApi.current) ggbApi.current.setValue('numberline', 1)
    setClick(1)
  }

  const onPlotTwoClick = () => {
    playMouseClick()
    if (ggbApi.current) ggbApi.current.setValue('frame', 5)
    setClick(3)
  }

  const onNext1Click = () => {
    playMouseClick()
    if (ggbApi.current) ggbApi.current.setValue('frame', 4)
    setClick(2)
  }

  const onNext2Click = () => {
    playMouseClick()
    if (ggbApi.current) ggbApi.current.setValue('frame', 4)
    setLeftAlt(leftVal)
    setRightAlt(rightVal)
    setNoteClick(false)
    setClick(2)
  }

  const onAddClick = () => {
    playMouseClick()
    if (ggbApi.current) ggbApi.current.setValue('operation', 1)
    setToggle(1)
  }

  const onSubtractClick = () => {
    playMouseClick()
    if (ggbApi.current) ggbApi.current.setValue('operation', 2)
    setToggle(2)
  }

  const onMultiplyClick = () => {
    playMouseClick()
    if (ggbApi.current) ggbApi.current.setValue('operation', 3)
    setToggle(3)
  }

  const onDivideClick = () => {
    playMouseClick()
    if (ggbApi.current) ggbApi.current.setValue('operation', 4)
    setToggle(4)
  }

  const onCentreSliderChange = (e: number) => {
    setCentreVal(e)
  }

  const onShowClick = () => {
    playMouseClick()
    setShowAll(true)
    setShowTry(true)
    setNoteClick(false)
  }

  const onTryNewClick = () => {
    playMouseClick()
    setClick(0)
    setToggle(0)
    setLeftVal(0)
    setNoteClick(false)
    setAddPos(false)
    setSubPos(false)
    setMulPos(false)
    setDivPos(false)
    setAddNeg(false)
    setSubNeg(false)
    setMulNeg(false)
    setDivNeg(false)
    setRightVal(0)
    setShowAll(false)
    setShowTry(false)
    if (ggbApi.current) {
      ggbApi.current.setValue('frame', 0)
      ggbApi.current.setValue('numberline', 0)
      ggbApi.current.setValue('operation', 0)
    }
  }

  const onNoteClick = () => {
    playMouseClick()
    setClick(4)
    setNoteClick(true)
  }

  useEffect(() => {
    if (ggbApi.current) ggbApi.current.setValue('o', centreVal)
  }, [centreVal])

  useEffect(() => {
    if (toggleStage == 1) {
      setLeftAlt(leftVal + centreVal)
      setRightAlt(rightVal + centreVal)
    }
    if (toggleStage == 2) {
      setLeftAlt(leftVal - centreVal)
      setRightAlt(rightVal - centreVal)
    }
    if (toggleStage == 3) {
      setLeftAlt(centreVal * leftVal)
      setRightAlt(centreVal * rightVal)
    }
    if (toggleStage == 4) {
      setLeftAlt(leftVal / centreVal)
      setRightAlt(rightVal / centreVal)
    }
  }, [centreVal, leftVal, rightVal, toggleStage])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener("BB'", () => setPointerRed(locatePoint2d("BB'", api)))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener("BB'")
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener("AA'", () => setPointerBlue(locatePoint2d("AA'", api)))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener("AA'")
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    if (centreVal == 0) {
      if (toggleStage == 4) {
        setLeftAlt(undefined)
        setRightAlt(undefined)
      }
    }
  }, [centreVal, toggleStage])

  useEffect(() => {
    if (centreVal > 0) {
      if (toggleStage == 1 && noteClick) setAddPos(true)
      if (toggleStage == 2 && noteClick) setSubPos(true)
      if (toggleStage == 3 && noteClick) setMulPos(true)
      if (toggleStage == 4 && noteClick) setDivPos(true)
    }
    if (centreVal < 0) {
      if (toggleStage == 1 && noteClick) setAddNeg(true)
      if (toggleStage == 2 && noteClick) setSubNeg(true)
      if (toggleStage == 3 && noteClick) setMulNeg(true)
      if (toggleStage == 4 && noteClick) setDivNeg(true)
    }
  }, [centreVal, noteClick, toggleStage])

  useEffect(() => {
    if (addPos && addNeg && subPos && subNeg && mulPos && mulNeg && divPos && divNeg) {
      setShowAll(true)
      setShowTry(true)
      setNoteClick(false)
    }
  }, [addNeg, addPos, divNeg, divPos, mulNeg, mulPos, subNeg, subPos])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-eec04-s1-gb1',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore how operations affect an inequality."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />

      <StyledGeogebra materialId={'auqjcgen'} width={720} height={339} onApiReady={onApiReady} />

      {ggbLoaded && (
        <>
          <ValueFlexBox
            moveUp={clickStage == 1}
            moveLeft={clickStage == 2 || clickStage == 3}
            move={clickStage == 3}
          >
            <ValueText1>{leftVal.toFixed(1)}</ValueText1>{' '}
          </ValueFlexBox>
          <ValueFlexBox
            moveUp={clickStage == 1}
            moveLeft={clickStage == 2 || clickStage == 3}
            move={clickStage == 3}
          >
            <ValueText2 style={{ color: '#ED6B90' }}>{rightVal.toFixed(1)}</ValueText2>
          </ValueFlexBox>
          {(clickStage == 2 || clickStage == 3) && (
            <>
              <ValueFlexBox>
                <ValueText3 moveUp={clickStage == 3}>{leftAlt?.toFixed(1)}</ValueText3>
              </ValueFlexBox>
              <ValueFlexBox>
                <ValueText4 moveUp={clickStage == 3} style={{ color: '#ED6B90' }}>
                  {rightAlt?.toFixed(1)}
                </ValueText4>
              </ValueFlexBox>
            </>
          )}
          {clickStage == 0 && (
            <>
              <SliderContainer>
                <LeftSlider
                  min={-3}
                  max={3}
                  defaultValue={0}
                  label={'Value of LHS'}
                  onChange={(e: number) => {
                    setLeftVal(e)
                    setPlotDisable(false)
                  }}
                ></LeftSlider>
                <RightSlider
                  min={-3}
                  max={3}
                  defaultValue={0}
                  label={'Value of RHS'}
                  onChange={(e: number) => {
                    setRightVal(e)
                    setPlotDisable(false)
                  }}
                ></RightSlider>
              </SliderContainer>
              <TextFlexBox>
                <PageFeedbacks>
                  Select values for{' '}
                  <span style={{ color: '#1CB9D9', marginLeft: '5px' }}> LHS</span>
                  <span style={{ marginLeft: '5px' }}>and</span>
                  <span style={{ color: '#ED6B90', marginLeft: '5px' }}>RHS</span>
                </PageFeedbacks>
              </TextFlexBox>
            </>
          )}
          <TextFlexBox>
            {clickStage == 1 && (
              <PageFeedbacks>Notice the position of numbers on the number line.</PageFeedbacks>
            )}
            {clickStage == 2 && !(toggleStage > 0) && (
              <PageFeedbacks>Select an operator</PageFeedbacks>
            )}
            {toggleStage > 0 && (
              <>
                {centreVal > 0 && (
                  <PageFeedbacks>
                    {' '}
                    {operators[toggleStage - 1]} a positive number{' '}
                    <span
                      style={{
                        color: '#AA5EE0',
                        background: '#F4E5FF',
                        width: '101px',
                        height: '28px',
                        borderRadius: '5px',
                        marginLeft: '6px',
                        marginRight: '6px',
                      }}
                    >
                      preserves
                    </span>{' '}
                    the inequality.
                  </PageFeedbacks>
                )}
                {centreVal < 0 && (toggleStage == 1 || toggleStage == 2) && (
                  <PageFeedbacks>
                    {operators[toggleStage - 1]} a negative number{' '}
                    <span
                      style={{
                        color: '#AA5EE0',
                        background: '#F4E5FF',
                        width: '101px',
                        height: '28px',
                        borderRadius: '5px',
                        marginLeft: '6px',
                        marginRight: '6px',
                      }}
                    >
                      preserves
                    </span>{' '}
                    the inequality.
                  </PageFeedbacks>
                )}
                {centreVal < 0 && (toggleStage == 3 || toggleStage == 4) && (
                  <PageFeedbacks>
                    {operators[toggleStage - 1]} a negative number{' '}
                    <span
                      style={{
                        color: '#ED6B90',
                        background: '#FFECF1',
                        width: '88px',
                        height: '28px',
                        borderRadius: '5px',
                        marginLeft: '6px',
                        marginRight: '6px',
                      }}
                    >
                      reverses
                    </span>{' '}
                    the inequality.
                  </PageFeedbacks>
                )}
                {centreVal == 0 && toggleStage == 4 && (
                  <PageFeedbacks>Undefined operation</PageFeedbacks>
                )}
              </>
            )}
          </TextFlexBox>
          <ButtonContainer>
            {clickStage == 0 && (
              <TextImgButton onClick={onPlotOneClick} imgSource={plot} disabled={plotButtonDisable}>
                Plot
              </TextImgButton>
            )}
            {clickStage == 1 && <TextButton onClick={onNext1Click}>Next</TextButton>}
            {clickStage == 2 && (
              <TextImgButton onClick={onPlotTwoClick} imgSource={plot}>
                Plot
              </TextImgButton>
            )}
            {clickStage == 3 && (
              <TextImgButton onClick={onNoteClick} imgSource={noteIcon}>
                Note
              </TextImgButton>
            )}
          </ButtonContainer>
          {(clickStage == 2 || clickStage == 3) && (
            <ToggleContainer>
              <ToggleButtton isClicked={toggleStage == 1} onClick={onAddClick}>
                Add
              </ToggleButtton>
              <ToggleButtton isClicked={toggleStage == 2} onClick={onSubtractClick}>
                Subtract
              </ToggleButtton>
              <ToggleButtton isClicked={toggleStage == 3} onClick={onMultiplyClick}>
                Multiply
              </ToggleButtton>
              <ToggleButtton isClicked={toggleStage == 4} onClick={onDivideClick}>
                Divide
              </ToggleButtton>
            </ToggleContainer>
          )}
          {toggleStage >= 1 && (
            <SliderContainer style={{ top: '510px' }}>
              <CentreSlider
                min={-3}
                max={3}
                defaultValue={0}
                onChange={onCentreSliderChange}
              ></CentreSlider>
            </SliderContainer>
          )}
          {clickStage == 3 && (
            <>
              <ValueFlexBox>
                <NumberLabel1 left={pointerBlue.leftPixel}>{leftAlt?.toFixed(1)}</NumberLabel1>
              </ValueFlexBox>
              <ValueFlexBox>
                <NumberLabel2 left={pointerRed.leftPixel}>{rightAlt?.toFixed(1)}</NumberLabel2>
              </ValueFlexBox>
            </>
          )}
        </>
      )}

      {clickStage == 4 && (
        <>
          <BgBox></BgBox>
          {
            <TableContainer>
              <TableBox src={table}></TableBox>
              {(addPos || showAll) && (
                <GrayText style={{ top: '80px', left: '240px' }}>Preserved</GrayText>
              )}
              {(subPos || showAll) && (
                <GrayText style={{ top: '140px', left: '240px' }}>Preserved</GrayText>
              )}
              {(mulPos || showAll) && (
                <GrayText style={{ top: '200px', left: '240px' }}>Preserved</GrayText>
              )}
              {(divPos || showAll) && (
                <GrayText style={{ top: '260px', left: '240px' }}>Preserved</GrayText>
              )}
              {(addNeg || showAll) && (
                <GrayText style={{ top: '80px', left: '460px' }}>Preserved</GrayText>
              )}
              {(subNeg || showAll) && (
                <GrayText style={{ top: '140px', left: '460px' }}>Preserved</GrayText>
              )}
              {(mulNeg || showAll) && (
                <GrayText style={{ top: '200px', left: '460px' }}>Reversed</GrayText>
              )}
              {(divNeg || showAll) && (
                <GrayText style={{ top: '260px', left: '460px' }}>Reversed</GrayText>
              )}
              {showAll && (
                <PageFeedbacks style={{ position: 'relative', top: '60px' }}>
                  Lets try this once more, but with a different inequality
                </PageFeedbacks>
              )}
              {!showAll && (
                <>
                  {centreVal > 0 && (
                    <PositiveContainer>
                      {toggleStage == 1 && (
                        <>
                          <PurpleTableText style={{ position: 'relative', top: '-325px' }}>
                            Preserved
                          </PurpleTableText>
                          <PageFeedbacks
                            style={{
                              justifyContent: 'center',
                              position: 'relative',
                              top: '-80px',
                              left: '-240px',
                            }}
                          >
                            Try out addition with a negative number now.
                          </PageFeedbacks>
                        </>
                      )}
                      {toggleStage == 2 && (
                        <>
                          <BlueTableText style={{ position: 'relative', top: '-265px' }}>
                            Preserved
                          </BlueTableText>
                          <PageFeedbacks
                            style={{
                              justifyContent: 'center',
                              position: 'relative',
                              top: '-80px',
                              left: '-240px',
                            }}
                          >
                            Try out subtraction with a negative number now.
                          </PageFeedbacks>
                        </>
                      )}
                      {toggleStage == 3 && (
                        <>
                          <PurpleTableText style={{ position: 'relative', top: '-205px' }}>
                            Preserved
                          </PurpleTableText>
                          <PageFeedbacks
                            style={{
                              justifyContent: 'center',
                              position: 'relative',
                              top: '-80px',
                              left: '-240px',
                            }}
                          >
                            Try out multiplication with a negative number now.
                          </PageFeedbacks>
                        </>
                      )}
                      {toggleStage == 4 && (
                        <>
                          <PurpleTableText style={{ position: 'relative', top: '-145px' }}>
                            Preserved
                          </PurpleTableText>
                          <PageFeedbacks
                            style={{
                              justifyContent: 'center',
                              position: 'relative',
                              top: '-80px',
                              left: '-240px',
                            }}
                          >
                            Try out division with a negative number now.
                          </PageFeedbacks>
                        </>
                      )}
                    </PositiveContainer>
                  )}
                  {centreVal < 0 && (
                    <NegativeContainer>
                      {toggleStage == 1 && (
                        <>
                          <BlueTableText style={{ position: 'relative', top: '-85px' }}>
                            Preserved
                          </BlueTableText>{' '}
                          <PageFeedbacks
                            style={{
                              justifyContent: 'center',
                              position: 'relative',
                              top: '160px',
                              left: '-460px',
                            }}
                          >
                            Try out addition with a positive number now.
                          </PageFeedbacks>
                        </>
                      )}
                      {toggleStage == 2 && (
                        <>
                          <BlueTableText style={{ position: 'relative', top: '-25px' }}>
                            Preserved
                          </BlueTableText>{' '}
                          <PageFeedbacks
                            style={{
                              justifyContent: 'center',
                              position: 'relative',
                              top: '160px',
                              left: '-460px',
                            }}
                          >
                            Try out subtraction with a positive number now.
                          </PageFeedbacks>
                        </>
                      )}
                      {toggleStage == 3 && (
                        <>
                          <BlueTableText style={{ position: 'relative', top: '35px' }}>
                            Reversed
                          </BlueTableText>{' '}
                          <PageFeedbacks
                            style={{
                              justifyContent: 'center',
                              position: 'relative',
                              top: '160px',
                              left: '-460px',
                            }}
                          >
                            Try out multiplication with a positive number now.
                          </PageFeedbacks>
                        </>
                      )}
                      {toggleStage == 4 && (
                        <>
                          <BlueTableText style={{ position: 'relative', top: '95px' }}>
                            Reversed
                          </BlueTableText>{' '}
                          <PageFeedbacks
                            style={{
                              justifyContent: 'center',
                              position: 'relative',
                              top: '160px',
                              left: '-460px',
                            }}
                          >
                            Try out division with a positive number now.
                          </PageFeedbacks>
                        </>
                      )}
                    </NegativeContainer>
                  )}
                </>
              )}
            </TableContainer>
          }
          {!showTryButton && (
            <ButtonContainer>
              <TextButton onClick={onNext2Click}>Next</TextButton>
              <OutlineButton imgSource={showAllIcon} onClick={onShowClick}>
                Show All
              </OutlineButton>
            </ButtonContainer>
          )}
          {showTryButton && (
            <ButtonContainer>
              <TextImgButton imgSource={tryNew} onClick={onTryNewClick}>
                Try New
              </TextImgButton>
            </ButtonContainer>
          )}
        </>
      )}
      {clickStage == 0 && ggbLoaded && (
        <OnboardingController>
          <OnboardingStep index={0}>
            <LeftOnBoarding complete={hasLeftValueChanged} />
          </OnboardingStep>
          <OnboardingStep index={1}>
            <RightOnBoarding complete={hasRightValueChanged} />
          </OnboardingStep>
        </OnboardingController>
      )}
    </AppletContainer>
  )
}
