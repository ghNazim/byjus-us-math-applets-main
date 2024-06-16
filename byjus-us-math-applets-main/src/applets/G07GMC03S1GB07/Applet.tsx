import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import arrow from './assets/arrow.svg'
import reset from './assets/reset.svg'
const GGB = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 140px;
  width: 664px;
  height: 440px;
`
const ButtonElement = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  background: #1a1a1a;
  border-radius: 10px;
  height: 60px;
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  cursor: pointer;
  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`
const HelperText = styled.div`
  display: flex;
  width: 650px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  position: absolute;
  top: 560px;
  left: 50%;
  translate: -50%;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`
const Text = styled.div`
  margin-top: 10px;
  max-width: 500px;
`
const CheckBoxes = styled.div`
  display: flex;
  width: 600px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 625px;
  left: 50%;
  translate: -50%;
`
const CheckBoxContainer = styled.div<{ selected: boolean }>`
  cursor: pointer;
  display: flex;
  width: 114px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  background-color: ${(p) => (p.selected ? '#c7c7c7' : '#fff')};
  border-radius: 12px;
  border: 1px solid ${(p) => (p.selected ? '#212121' : '#c7c7c7')};
  box-shadow: ${(p) => (p.selected ? 'inset 0 0 0 4px #fff' : '0px -4px 0px 0px #C7C7C7 inset')};
  span {
    color: #212121;
    text-align: center;
    font-family: Nunito;
    font-size: 20px;
    font-style: normal;
    font-weight: ${(p) => (p.selected ? 700 : 400)};
    line-height: 28px;
  }
`
const CheckBox = styled.div<{ selected: boolean }>`
  width: 24px;
  height: 24px;
  border: 2px solid #212121;
  box-shadow: ${(p) => (p.selected ? 'inset 0 0 0 4px #C7C7C7' : '')};
  background-color: ${(p) => (p.selected ? '#212121' : '#fff')};
`
const Box = styled.div`
  position: relative;
  width: 86px;
  display: flex;
  height: 60px;
  padding: 3px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #1a1a1a;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  border-radius: 12px;
  border: 1px solid #1a1a1a;
  background: #fff;
  cursor: pointer;
`
const OptionsContainer = styled.button<{ stage: Stage }>`
  position: absolute;
  top: -130%;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  display: flex;
  padding: 12px;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  border: none;
  background: #c7c7c7;
  opacity: ${(props) => (props.stage !== 'enter' ? 0 : 1)};
  transition: opacity 350ms;
  z-index: 1;
  ::after {
    content: ' ';
    position: absolute;
    left: 50%;
    translate: -50%;
    top: 99%;
    border-bottom: none;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    border-top: 8px solid #c7c7c7;
  }
`
const Option = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 10px;
  border-radius: 8px;
  border: none;
  width: 44px;
  height: 44px;
  font-family: 'Nunito';
  background: #ffffff;
  color: #646464;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  cursor: pointer;
  :hover {
    background: #1a1a1a;
    color: #fff;
  }
`
const Label = styled.div`
  position: relative;
  width: 68px;
  height: 52px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #1a1a1a;
`
const Arrow = styled.div`
  position: relative;
  width: 36px;
  height: 52px;
  background: #1a1a1a;
  border-radius: 0px 8px 8px 0px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
`
export const AppletG07GMC03S1GB07: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [isOpen, setOpen] = useState(false)
  const { shouldMount, stage } = useTransition(isOpen, 350)
  const [pageNum, setPageNum] = useState(0)
  const [optionSel, setOptionSel] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [ansRight, setAnsRight] = useState(false)
  const [ansWrong, setAnsWrong] = useState(false)
  const [checkedAngle, setCheckedAngle] = useState({ a: false, b: false, c: false })
  const [checkedSide, setCheckedSide] = useState({ ab: false, bc: false, ac: false })
  const playClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const onNextHandle = () => {
    playClick()
    if (!ggbApi.current) return
    switch (pageNum) {
      case 0:
        ggbApi.current.evalCommand('RunClickScript(pic2)')
        setPageNum((p) => p + 1)
        onInteraction('next')
        setNextDisabled(true)
        break
      case 1:
        ggbApi.current.evalCommand('RunClickScript(next)')
        setPageNum((p) => p + 1)
        onInteraction('next')
        setNextDisabled(true)
        break
      case 2:
        ggbApi.current.evalCommand('RunClickScript(next)')
        setPageNum((p) => p + 1)
        onInteraction('next')
        setNextDisabled(true)
        break
      case 3:
        ggbApi.current.evalCommand('RunClickScript(next)')
        setPageNum((p) => p + 1)
        onInteraction('next')
        setNextDisabled(true)
        break
      case 4:
        ggbApi.current.evalCommand('RunClickScript(next)')
        setPageNum((p) => p + 1)
        onInteraction('next')
        setNextDisabled(true)
        break
      case 5:
        onInteraction('reset')
        ggbApi.current.evalCommand('RunClickScript(resbut)')
        setNextDisabled(false)
        setPageNum(0)
        setOptionSel(0)
        setAnsRight(false)
        setAnsWrong(false)
        setCheckedAngle({ a: false, b: false, c: false })
        setCheckedSide({ ab: false, bc: false, ac: false })
        break
    }
  }
  const onHandleGGB = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.registerObjectUpdateListener('pic12', () => {
        if (api.getVisible('pic12')) {
          setAnsRight(true)
          setNextDisabled(false)
        } else {
          setAnsRight(false)
          setNextDisabled(true)
        }
      })
      api.registerObjectUpdateListener('pic13', () => {
        if (api.getVisible('pic13')) {
          setAnsWrong(true)
          setNextDisabled(true)
        } else setAnsWrong(false)
      })
      api.registerObjectUpdateListener('trans', () => {
        if (api.getValue('trans') > 0.9 && api.getValue('frame') > 4) {
          setNextDisabled(false)
        }
      })
      api.registerClientListener((e: any) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'A' || e.hits[0] === 'B' || e.hits[0] === 'C')
        ) {
          onInteraction('drag')
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'A' || e.target === 'B' || e.target === 'C')
        ) {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [ggbApi],
  )
  const onCheckAng1 = () => {
    if (!ggbApi.current) return
    playClick()
    onInteraction('tap')
    if (checkedAngle.a) {
      setCheckedAngle({ ...checkedAngle, a: false })
      ggbApi.current.evalCommand('RunClickScript(clkA)')
    } else if (checkedAngle.b && checkedAngle.c) {
      setCheckedAngle({ a: true, b: false, c: false })
      ggbApi.current.evalCommand('RunClickScript(butA)')
    } else {
      setCheckedAngle({ ...checkedAngle, a: true })
      ggbApi.current.evalCommand('RunClickScript(butA)')
    }
  }
  const onCheckAng2 = () => {
    if (!ggbApi.current) return
    playClick()
    onInteraction('tap')
    if (checkedAngle.b) {
      setCheckedAngle({ ...checkedAngle, b: false })
      ggbApi.current.evalCommand('RunClickScript(clkB)')
    } else if (checkedAngle.a && checkedAngle.c) {
      setCheckedAngle({ a: false, b: true, c: false })
      ggbApi.current.evalCommand('RunClickScript(butB)')
    } else {
      setCheckedAngle({ ...checkedAngle, b: true })
      ggbApi.current.evalCommand('RunClickScript(butB)')
    }
  }
  const onCheckAng3 = () => {
    if (!ggbApi.current) return
    playClick()
    onInteraction('tap')
    if (checkedAngle.c) {
      setCheckedAngle({ ...checkedAngle, c: false })
      ggbApi.current.evalCommand('RunClickScript(clkC)')
    } else if (checkedAngle.b && checkedAngle.a) {
      setCheckedAngle({ a: false, b: false, c: true })
      ggbApi.current.evalCommand('RunClickScript(butC)')
    } else {
      setCheckedAngle({ ...checkedAngle, c: true })
      ggbApi.current.evalCommand('RunClickScript(butC)')
    }
  }
  const onCheckSide1 = () => {
    if (!ggbApi.current) return
    playClick()
    onInteraction('tap')
    if (checkedSide.bc || checkedSide.ac) ggbApi.current.evalCommand('RunClickScript(butAB)')
    if (checkedSide.ab) setCheckedSide({ ab: false, bc: false, ac: false })
    else setCheckedSide({ ab: true, bc: false, ac: false })
    ggbApi.current.evalCommand('RunClickScript(butAB)')
  }
  const onCheckSide2 = () => {
    if (!ggbApi.current) return
    playClick()
    onInteraction('tap')
    if (checkedSide.ab || checkedSide.ac) ggbApi.current.evalCommand('RunClickScript(butBC)')
    if (checkedSide.bc) setCheckedSide({ ab: false, bc: false, ac: false })
    else setCheckedSide({ ab: false, bc: true, ac: false })
    ggbApi.current.evalCommand('RunClickScript(butBC)')
  }
  const onCheckSide3 = () => {
    if (!ggbApi.current) return
    playClick()
    onInteraction('tap')
    if (checkedSide.bc || checkedSide.ab) ggbApi.current.evalCommand('RunClickScript(butAC)')
    if (checkedSide.ac) setCheckedSide({ ab: false, bc: false, ac: false })
    else setCheckedSide({ ab: false, bc: false, ac: true })
    ggbApi.current.evalCommand('RunClickScript(butAC)')
  }
  useEffect(() => {
    if (pageNum == 1) {
      if (!ggbApi.current) return
      let c = 0
      if (checkedAngle.a) c++
      if (checkedAngle.b) c++
      if (checkedAngle.c) c++
      c == 2 ? setNextDisabled(false) : setNextDisabled(true)
    }
  }, [checkedAngle])
  useEffect(() => {
    if (pageNum == 2) {
      if (checkedSide.ab || checkedSide.bc || checkedSide.ac) setNextDisabled(false)
      else setNextDisabled(true)
    }
  }, [checkedSide])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-gmc03-s1-gb07',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore if the triangle formed with two angles and a non-included side is unique or not."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GGB materialId="jsxw7er4" onApiReady={onHandleGGB} />
      <HelperText>
        <Text>
          {pageNum == 0 &&
            'Create a new triangle using the same values to explore if it is unique or not.'}
          {pageNum == 1 && 'Select the two vertices to set the angles.'}
          {pageNum == 2 && 'Select the non-included side.'}
          {pageNum == 3 &&
            !ansRight &&
            !ansWrong &&
            'Adjust the vertices to create a triangle with the same side and angle values.'}
          {pageNum == 3 &&
            ansRight &&
            !ansWrong &&
            'Well done! Let’s proceed to verify if the triangle formed is unique.'}
          {pageNum == 3 &&
            ansWrong &&
            'This is the same triangle. Try other positions of angles or sides.'}
          {pageNum == 4 && 'What do you think, are these triangles unique?'}
          {pageNum == 5 &&
            !nextDisabled &&
            optionSel == 2 &&
            'Great job! The given triangle is not unique as both triangles formed are non-identical.'}
          {pageNum == 5 &&
            !nextDisabled &&
            optionSel == 1 &&
            'Uh-oh! The given triangle is not unique as both triangles formed are non-identical.'}
        </Text>
        {pageNum == 4 && (
          <Box
            onClick={() => {
              setOpen((open) => !open)
              onInteraction('tap')
              playClick()
            }}
          >
            <Label>{optionSel == 1 ? 'Yes' : optionSel == 2 ? 'No' : ''}</Label>
            <Arrow>
              <img src={arrow} />
            </Arrow>
            {shouldMount && (
              <OptionsContainer {...{ stage }}>
                <Option
                  key={1}
                  onClick={() => {
                    if (!ggbApi.current) return
                    ggbApi.current.evalCommand('RunClickScript(pic5)')
                    setOptionSel(1)
                    setNextDisabled(false)
                  }}
                >
                  Yes
                </Option>
                <Option
                  key={2}
                  onClick={() => {
                    if (!ggbApi.current) return
                    ggbApi.current.evalCommand('RunClickScript(pic4)')
                    setOptionSel(2)
                    setNextDisabled(false)
                  }}
                >
                  No
                </Option>
              </OptionsContainer>
            )}
          </Box>
        )}
      </HelperText>
      {pageNum == 1 && (
        <CheckBoxes>
          <CheckBoxContainer selected={checkedAngle.a} onClick={onCheckAng1}>
            <CheckBox selected={checkedAngle.a} />
            <span>A</span>
          </CheckBoxContainer>
          <CheckBoxContainer selected={checkedAngle.b} onClick={onCheckAng2}>
            <CheckBox selected={checkedAngle.b} />
            <span>B</span>
          </CheckBoxContainer>
          <CheckBoxContainer selected={checkedAngle.c} onClick={onCheckAng3}>
            <CheckBox selected={checkedAngle.c} />
            <span>C</span>
          </CheckBoxContainer>
        </CheckBoxes>
      )}
      {pageNum == 2 && (
        <CheckBoxes>
          {((checkedAngle.a && checkedAngle.c) || (checkedAngle.b && checkedAngle.c)) && (
            <CheckBoxContainer selected={checkedSide.ab} onClick={onCheckSide1}>
              <CheckBox selected={checkedSide.ab} />
              <span>AB</span>
            </CheckBoxContainer>
          )}
          {((checkedAngle.a && checkedAngle.c) || (checkedAngle.b && checkedAngle.a)) && (
            <CheckBoxContainer selected={checkedSide.bc} onClick={onCheckSide2}>
              <CheckBox selected={checkedSide.bc} />
              <span>BC</span>
            </CheckBoxContainer>
          )}
          {((checkedAngle.a && checkedAngle.b) || (checkedAngle.b && checkedAngle.c)) && (
            <CheckBoxContainer selected={checkedSide.ac} onClick={onCheckSide3}>
              <CheckBox selected={checkedSide.ac} />
              <span>CA</span>
            </CheckBoxContainer>
          )}
        </CheckBoxes>
      )}
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {pageNum == 0 ? 'Start' : pageNum < 5 ? 'Next' : <img src={reset} />}
      </ButtonElement>
    </AppletContainer>
  )
}
