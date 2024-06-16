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
  top: 40px;
  scale: 0.82;
  width: 858.6px;
  height: 619px;
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
export const AppletG07GMC03S1GB03: FC<{
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
  const [checkedVal, setCheckedVal] = useState({ a: false, b: false, c: false })
  const playClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)

  const onNextHandle = () => {
    playClick()
    if (!ggbApi.current) return
    switch (pageNum) {
      case 0:
        ggbApi.current.evalCommand('RunClickScript(button5)')
        setPageNum((p) => p + 1)
        onInteraction('next')
        setNextDisabled(true)
        break
      case 1:
        ggbApi.current.evalCommand('RunClickScript(button6)')
        setPageNum((p) => p + 1)
        onInteraction('next')
        setNextDisabled(true)
        break
      case 2:
        ggbApi.current.evalCommand('RunClickScript(button8)')
        setPageNum((p) => p + 1)
        onInteraction('next')
        setNextDisabled(true)
        break
      case 3:
        ggbApi.current.evalCommand('RunClickScript(button9)')
        setPageNum((p) => p + 1)
        onInteraction('next')
        ggbApi.current.evalCommand('RunClickScript(button10)')
        setNextDisabled(true)
        break
      case 4:
        onInteraction('reset')
        ggbApi.current.evalCommand('RunClickScript(button4)')
        setPageNum(0)
        setOptionSel(0)
        setAnsRight(false)
        setAnsWrong(false)
        setCheckedVal({ a: false, b: false, c: false })
        setNextDisabled(false)
        break
    }
  }
  const onHandleGGB = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.registerObjectUpdateListener('trainglevis', () => {
        if (api.getValue('trainglevis')) {
          setAnsRight(true)
          setNextDisabled(false)
        } else {
          setAnsRight(false)
          setNextDisabled(true)
        }
      })
      api.registerObjectUpdateListener('wrong', () => {
        if (api.getValue('wrong')) {
          setAnsWrong(true)
          setNextDisabled(true)
        } else setAnsWrong(false)
      })
      api.registerObjectUpdateListener('move', () => {
        if (api.getValue('move') > 4) {
          setNextDisabled(false)
        }
      })
      api.registerClientListener((e: any) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'g_1' || e.hits[0] === 'e_1' || e.hits[0] === 'd_1')
        ) {
          onInteraction('drag')
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'g_1' || e.target === 'e_1' || e.target === 'd_1')
        ) {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [ggbApi],
  )
  const onCheck1 = () => {
    playClick()
    onInteraction('tap')
    if (checkedVal.a) setCheckedVal({ ...checkedVal, a: false })
    else if (checkedVal.b && checkedVal.c) setCheckedVal({ a: true, b: false, c: false })
    else setCheckedVal({ ...checkedVal, a: true })
  }
  const onCheck2 = () => {
    playClick()
    onInteraction('tap')
    if (checkedVal.b) setCheckedVal({ ...checkedVal, b: false })
    else if (checkedVal.a && checkedVal.c) setCheckedVal({ a: false, b: true, c: false })
    else setCheckedVal({ ...checkedVal, b: true })
  }
  const onCheck3 = () => {
    playClick()
    onInteraction('tap')
    if (checkedVal.c) setCheckedVal({ ...checkedVal, c: false })
    else if (checkedVal.b && checkedVal.a) setCheckedVal({ a: false, b: false, c: true })
    else setCheckedVal({ ...checkedVal, c: true })
  }
  useEffect(() => {
    if (pageNum == 1) {
      if (!ggbApi.current) return
      let c = 0
      if (checkedVal.a) {
        c++
        ggbApi.current.setValue('boolab', 1)
      } else ggbApi.current.setValue('boolab', 0)
      if (checkedVal.b) {
        c++
        ggbApi.current.setValue('boolbc', 1)
      } else ggbApi.current.setValue('boolbc', 0)
      if (checkedVal.c) {
        c++
        ggbApi.current.setValue('boolca', 1)
      } else ggbApi.current.setValue('boolca', 0)
      c == 2 ? setNextDisabled(false) : setNextDisabled(true)
    }
  }, [checkedVal])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-gmc03-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore if the triangle formed with two sides and an included angle is unique or not."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GGB materialId="d38rrxpg" onApiReady={onHandleGGB} />

      <HelperText>
        <Text>
          {pageNum == 0 &&
            'Create a new triangle using the same values to explore if it is unique or not.'}
          {pageNum == 1 && 'Select two sides to assign the included angle.'}
          {pageNum == 2 &&
            !ansRight &&
            !ansWrong &&
            'Adjust the vertices to create a triangle with the same side and angle values.'}
          {pageNum == 2 &&
            ansRight &&
            !ansWrong &&
            'Well done! Let’s proceed to verify if the triangle formed is unique.'}
          {pageNum == 2 &&
            ansWrong &&
            'Oh-uh! This is not a different triangle. Use different values for sides.'}
          {pageNum == 3 && 'What do you think, are these triangles unique?'}
          {pageNum == 4 &&
            !nextDisabled &&
            optionSel == 1 &&
            'Great job! The given triangle is unique as both triangles formed are identical.'}
          {pageNum == 4 &&
            !nextDisabled &&
            optionSel == 2 &&
            'Uh-oh! The given triangle is unique as both triangles formed are  identical.'}
        </Text>
        {pageNum == 3 && (
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
                    setOptionSel(1)
                    setNextDisabled(false)
                  }}
                >
                  Yes
                </Option>
                <Option
                  key={2}
                  onClick={() => {
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
          <CheckBoxContainer selected={checkedVal.a} onClick={onCheck1}>
            <CheckBox selected={checkedVal.a} />
            <span>AB</span>
          </CheckBoxContainer>
          <CheckBoxContainer selected={checkedVal.b} onClick={onCheck2}>
            <CheckBox selected={checkedVal.b} />
            <span>BC</span>
          </CheckBoxContainer>
          <CheckBoxContainer selected={checkedVal.c} onClick={onCheck3}>
            <CheckBox selected={checkedVal.c} />
            <span>CA</span>
          </CheckBoxContainer>
        </CheckBoxes>
      )}
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {pageNum == 0 ? 'Start' : pageNum < 4 ? 'Next' : <img src={reset} />}
      </ButtonElement>
    </AppletContainer>
  )
}
