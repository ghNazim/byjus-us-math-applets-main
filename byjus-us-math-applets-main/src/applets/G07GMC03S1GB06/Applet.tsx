import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ResetIcon from './assets/resetIcon.svg'
import DropDownSimple from './components/DropDownSimple'
import RadioButton from './components/RadioButton'

export type RadioButtonIds = 'B1VX' | 'C1VX' | 'A1VX'

const StyledGgb = styled(Geogebra)`
  position: absolute;
  top: 60px;
  width: 96%;
  height: 70%;
  left: 2%;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 40px;
  width: 100%;
`
const Button = styled.div<{ locked?: boolean }>`
  padding: 10px 15px;
  border-radius: 5px;
  color: white;
  background: #1a1a1a;
  text-align: center;
  text-align: center;
  font-family: Nunito;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  cursor: ${(a) => (a.locked ? 'default' : 'pointer')};
  opacity: ${(a) => (a.locked ? 0.5 : 1)};
`

const BottomText = styled.div<{ bottom: number }>`
  color: var(--monotone-100, #444);
  width: 100%;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  bottom: ${(a) => a.bottom}px;
  padding: 0 50px;
  position: absolute;
  display: flex;
  justify-content: center;
  gap: 2rem;
  align-items: center;
`

const RadioButtonHolder = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  bottom: 100px;
  justify-content: center;
  align-items: center;
  gap: 20px;
`

const PatchForPausebtn = styled.div<{ color?: string }>`
  width: 30px;
  height: 30px;
  background-color: ${(a) => (a.color ? a.color : 'white')};
  position: absolute;
  top: 546px;
  left: 20px;
  /* border: 1px solid red; */
`

export const AppletG07GMC03S1GB06: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const [currentStage, setCurrentStage] = useState(0)
  //using this to control different stages of the ggb
  const [selectedRadioButtons, setSelectedRadioButtons] = useState<RadioButtonIds[]>([])
  const [placedInWrongArea, setPlacedInWrongArea] = useState(false)
  const [placedInCorrectArea, setPlacedInCorrectArea] = useState(false)
  const [userSelectedValue, setUserSelectedValue] = useState<string | null>(null)
  const [ggbSetValueChangedOnce, setGgbValueChangedOnce] = useState(false)

  //ggbVariables For Updating Animation complete
  const [t1, setT1] = useState(0) //first animation. complete when val==7
  const [t1bk, setT1bk] = useState(0) //merging animation. complete when val==7

  //sound
  const playMouseClick = useSFX('mouseClick')

  const onGgbLoad = useCallback((api: GeogebraAppApi | null) => {
    if (api) {
      ggbApi.current = api
      setGgbLoaded(true)
    }
  }, [])

  const handleReset = () => {
    if (ggbApi.current) {
      playMouseClick()
      setCurrentStage(0)
      setSelectedRadioButtons([])
      setPlacedInCorrectArea(false)
      setPlacedInCorrectArea(false)
      setUserSelectedValue(null)
      setGgbValueChangedOnce(false)
      ggbApi.current.evalCommand('SetValue(steps,0)')

      ggbApi.current.evalCommand('SetValue(t1,0)')
      ggbApi.current.evalCommand('SetValue(tx,0)')

      ggbApi.current.evalCommand('SetValue(A1VX,0)')
      ggbApi.current.evalCommand('SetValue(B1VX,0)')
      ggbApi.current.evalCommand('SetValue(C1VX,0)')

      ggbApi.current.evalCommand('SetValue(A1,(0,-3))')
      ggbApi.current.evalCommand('SetValue(B1,(8,-3))')
      ggbApi.current.evalCommand('SetValue(C1,(4,0))')

      ggbApi.current.evalCommand('SetFixed(A1,true)')
      ggbApi.current.evalCommand('SetFixed(B1,true)')
      ggbApi.current.evalCommand('SetFixed(C1,true)')

      ggbApi.current.evalCommand('SetValue(yes,0)')
      ggbApi.current.evalCommand('SetValue(no,0)')

      ggbApi.current.evalCommand('SetValue(check,0)')

      ggbApi.current.evalCommand('SetValue(t1bk,0)')
      ggbApi.current.evalCommand('SetValue(t2bk,0)')

      ggbApi.current.evalCommand('If(steps==0,SetValue(rot,0))')
      ggbApi.current.evalCommand('If(steps==0,StartAnimation(rot,false))')

      ggbApi.current.evalCommand('SetValue(α,0°)')

      ggbApi.current.evalCommand('SetValue(C_2,B_2)')
    }
  }

  useEffect(() => {
    if (ggbApi.current && ggbLoaded) {
      ggbApi.current.registerObjectUpdateListener('redbg1', () => {
        setPlacedInWrongArea(ggbApi.current ? ggbApi.current.getVisible('redbg1') : false)
      })

      ggbApi.current.registerObjectUpdateListener('t1', () => {
        setT1(ggbApi.current ? ggbApi.current.getValue('t1') : 0)
      })

      ggbApi.current.registerObjectUpdateListener('t1bk', () => {
        setT1bk(ggbApi.current ? ggbApi.current.getValue('t1bk') : 0)
      })

      ggbApi.current.registerObjectUpdateListener('greenbg', () => {
        if (!(ggbApi.current ? ggbApi.current.getVisible('redbg1') : false)) {
          setPlacedInCorrectArea(ggbApi.current ? ggbApi.current.getVisible('greenbg') : false)
        }
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('redbg1')
        // ggbApi.current?.unregisterObjectUpdateListener('s_1')
        ggbApi.current?.unregisterObjectUpdateListener('t1')
        ggbApi.current?.unregisterObjectUpdateListener('t1bk')
        ggbApi.current?.unregisterObjectUpdateListener('greenbg')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    if (userSelectedValue && ggbApi.current) {
      setGgbValueChangedOnce(true)
      //in ggb, the value paremeter has to be increased one at this stage
      if (userSelectedValue === 'yes') {
        ggbApi.current.evalCommand('SetValue(yes,1)')
        ggbApi.current.evalCommand('SetValue(no,0)')
        ggbApi.current.evalCommand('SetValue(check,1)')
        !ggbSetValueChangedOnce ? ggbApi.current.evalCommand('SetValue(steps,steps+1)') : null
      } else if (userSelectedValue === 'no') {
        ggbApi.current.evalCommand('SetValue(yes,0)')
        ggbApi.current.evalCommand('SetValue(no,1)')
        ggbApi.current.evalCommand('SetValue(check,1)')
        !ggbSetValueChangedOnce ? ggbApi.current.evalCommand('SetValue(steps,steps+1)') : null
      }
    }
  }, [userSelectedValue])

  const handleStart = () => {
    if (ggbApi.current) {
      ggbApi.current.evalCommand('StartAnimation(t1,true)')
      ggbApi.current.evalCommand('SetValue(steps,steps+1)')
      ggbApi.current.evalCommand('StartAnimation(tx,true)')
      setCurrentStage(1)
    }
  }

  const handleRadioButton = (id: RadioButtonIds) => {
    const mapping = { A1VX: 'B1VX', B1VX: 'C1VX', C1VX: 'A1VX' }
    const setValueMapping = { A1VX: 'C1VX', B1VX: 'A1VX', C1VX: 'B1VX' }
    if (ggbApi.current && !selectedRadioButtons.includes(id)) {
      playMouseClick()
      ggbApi.current.evalCommand(`SetValue(${id},1)`)
      ggbApi.current.evalCommand(
        `If(${id}==1&&${mapping[id]}==1,SetValue(${setValueMapping[id]},0))`,
      )

      setSelectedRadioButtons((prev) => {
        if (prev.length < 2) {
          return [...prev, id]
        } else {
          prev.shift()
          return [...prev, id]
        }
      })
    }
  }

  const handleNext = () => {
    if (ggbApi.current) {
      playMouseClick()
      switch (currentStage) {
        case 1:
          ggbApi.current.evalCommand('SetValue(steps,steps+1)')

          ggbApi.current.evalCommand('SetFixed(A1, false)')
          ggbApi.current.evalCommand('SetFixed(B1, false)')
          ggbApi.current.evalCommand('SetFixed(C1, false)')

          ggbApi.current.evalCommand(
            'If(steps >= 2, SetColor(A1, "#444444"), SetColor(A1, "#1A1A1A"))',
          )

          ggbApi.current.evalCommand(
            'If(steps >= 2, SetColor(B1, "#444444"), SetColor(B1, "#1A1A1A"))',
          )

          ggbApi.current.evalCommand(
            'If(steps >= 2, SetColor(C1, "#444444"), SetColor(C1, "#1A1A1A"))',
          )

          setCurrentStage(2)
          break
        case 2:
          ggbApi.current.evalCommand('SetValue(steps,steps+1)')
          setCurrentStage(3)
          break
        case 3:
          ggbApi.current.evalCommand('SetValue(steps,steps+1)')

          ggbApi.current.evalCommand('SetValue(check,check+1)')

          ggbApi.current.evalCommand('If(b_2==0&&IsToFlip,StartAnimation(α,true))')

          ggbApi.current.evalCommand('If(b_2!=0,StartAnimation(rot,true))')

          ggbApi.current.evalCommand(
            'If(b_2==0&&!IsToFlip,Execute({"StartAnimation(C_2,true)","StartAnimation(t1bk,true)"}))',
          )
          setCurrentStage(4)
          break
        default:
          ggbApi.current.evalCommand('SetValue(steps,steps+1)')
          setCurrentStage((prev) => prev + 1)
          break
      }
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-gmc03-s1-gb06',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore if the triangle formed with two angles and
an included side is unique or not."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <StyledGgb materialId="hsnw9bfz" onApiReady={onGgbLoad} />
      {ggbLoaded ? (
        <>
          {currentStage == 0 ? (
            <BottomText bottom={100}>
              Create a new triangle using the same values to explore if it is unique or not.
            </BottomText>
          ) : null}
          {currentStage == 1 ? (
            <BottomText bottom={170}>Select the two vertices to set the angles.</BottomText>
          ) : null}
          {currentStage == 2 && !placedInCorrectArea ? (
            <BottomText bottom={140}>
              {placedInWrongArea ? (
                <>This is the same triangle. Try other positions of angles or sides.</>
              ) : (
                <>Adjust the vertices to create a triangle with the same side and angle values.</>
              )}
            </BottomText>
          ) : null}
          {currentStage == 2 && placedInCorrectArea ? (
            <BottomText bottom={100}>
              Well done! Let’s proceed to verify if the triangle formed is unique.
            </BottomText>
          ) : null}
          {currentStage == 3 ? (
            <BottomText bottom={100}>
              What do you think, are these triangles unique?
              <div>
                <DropDownSimple
                  onSelecting={(val) => {
                    setUserSelectedValue(val)
                  }}
                  valueArr={['yes', 'no']}
                />
              </div>
            </BottomText>
          ) : null}
          {currentStage == 4 ? (
            <BottomText bottom={100}>
              {userSelectedValue === 'yes' ? (
                <>The given triangle is a unique triangle because both triangles are identical.</>
              ) : (
                <>Uh-oh! The given triangle is unique as both triangles formed are identical.</>
              )}
            </BottomText>
          ) : null}
          <ButtonContainer>
            {currentStage == 0 ? <Button onClick={handleStart}>Start</Button> : null}
            {currentStage == 1 ? (
              <Button
                locked={selectedRadioButtons.length < 2}
                onClick={selectedRadioButtons.length == 2 ? handleNext : undefined}
              >
                Next
              </Button>
            ) : null}
            {currentStage == 2 ? (
              <Button
                locked={!placedInCorrectArea}
                onClick={placedInCorrectArea ? handleNext : undefined}
              >
                Next
              </Button>
            ) : null}
            {currentStage == 3 ? (
              <Button
                locked={userSelectedValue == null}
                onClick={userSelectedValue !== null ? handleNext : undefined}
              >
                Next
              </Button>
            ) : null}
            {currentStage == 4 ? (
              <Button locked={t1bk < 6.9} onClick={t1bk >= 6.9 ? handleReset : undefined}>
                <img src={ResetIcon} />
                Reset
              </Button>
            ) : null}
          </ButtonContainer>
          {currentStage == 1 && t1 > 6.9 ? (
            <RadioButtonHolder>
              <RadioButton
                currentBtnState={selectedRadioButtons.includes('A1VX') ? 'selected' : 'default'}
                value="A"
                id="A1VX"
                onClick={handleRadioButton}
              />
              <RadioButton
                currentBtnState={selectedRadioButtons.includes('B1VX') ? 'selected' : 'default'}
                value="B"
                id="B1VX"
                onClick={handleRadioButton}
              />
              <RadioButton
                currentBtnState={selectedRadioButtons.includes('C1VX') ? 'selected' : 'default'}
                value="C"
                id="C1VX"
                onClick={handleRadioButton}
              />
            </RadioButtonHolder>
          ) : null}
          {currentStage < 2 ? <PatchForPausebtn color={t1 < 7 ? 'white' : '#f1edff'} /> : null}
          {currentStage == 4 ? <PatchForPausebtn /> : null}
        </>
      ) : null}
    </AppletContainer>
  )
}
