import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { Dropdown } from '@/molecules/Dropdown'

import fivestage from './assets/fivestage.svg'
import fourstage from './assets/fourstage.svg'
import onestage from './assets/onestage.svg'
import pop1 from './assets/pop1.svg'
import reset from './assets/reset.svg'
import threestage from './assets/threestage.svg'
import twostage from './assets/twostage.svg'
import { RangeInput } from './CustomRangeInput'

const ButtonElement = styled.button<{ colorTheme: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  height: 60px;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  background-color: #1a1a1a;
  border: 2px solid #1a1a1a;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
  :disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`
const GGbcontainer = styled(Geogebra)`
  position: absolute;
  width: 653px;
  height: 507px;
  left: 50%;
  translate: -50%;
  top: 100px;
`
const Slider = styled(RangeInput)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 580px;
`

const Popup = styled.img`
  position: absolute;
  top: 685px;
  left: 320px;
  z-index: 2;
`

const DropdownContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 625px;
`

const FeedbackTop = styled.div`
  position: absolute;
  top: 530px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
`
const FeedbackCenter = styled(FeedbackTop)`
  top: 575px;
  translate: 0 -50%;
`
const Coordinatetextposition3 = styled.img`
  position: absolute;
  top: 185px;
  left: 48%;
  translate: -48%;
`
const Coordinatetextposition5 = styled.img`
  position: absolute;
  top: 120px;
  left: 48%;
  translate: -48%;
`
const Coordinatetextposition4 = styled.img`
  position: absolute;
  top: 151px;
  left: 48%;
  translate: -48%;
`
const Coordinatetextposition2 = styled.img`
  position: absolute;
  top: 215px;
  left: 49%;
  translate: -49%;
`
const Coordinatetextposition1 = styled.img`
  position: absolute;
  top: 250px;
  left: 49%;
  translate: -49%;
`
export const AppletG08GMC04S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)

  const [pageNum, setPageNum] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [sValue, setSValue] = useState(3)
  const [dropdownIndex, SetDropdownIndex] = useState(-1)
  const [dropdownIndex1, SetDropdownIndex1] = useState(-1)
  const [ggbReload, setGgbReload] = useState(0)

  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGGBLoaded(api !== null)
      api.registerObjectUpdateListener('next', () => {
        if (ggbApi.current == null) return
        if (ggbApi.current.getValue('next') == 1) {
          setNextDisabled(false)
        } else setNextDisabled(true)
      })
    },
    [ggbApi],
  )

  const onNextHandle = () => {
    switch (pageNum) {
      case 0:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(pic1)')
        setNextDisabled(true)
        setPageNum(1)
        break

      case 1:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(NEXTBUTTON1)')
        setNextDisabled(true)
        setPageNum(2)
        break

      case 2:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(nextbutton2)')
        setNextDisabled(true)
        setPageNum(3)
        break

      case 3:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(nextbutton3)')
        setNextDisabled(true)
        setPageNum(4)
        setSValue(3)
        ggbApi.current.setValue('a', 3)
        break

      case 4:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(NEXTBUTTON1)')
        setNextDisabled(true)
        setPageNum(5)
        break

      case 5:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(pic7)')
        setNextDisabled(true)
        setPageNum(7)
        break

      case 7:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(pic11)')
        setNextDisabled(false)
        setPageNum(0)
        break
    }
  }

  function handleOnChange(value: number) {
    setSValue(value)
    ggbApi.current?.setValue('a', sValue)
    if (sValue == 4 || sValue == 5) setNextDisabled(false)
    else setNextDisabled(true)
  }

  function handleOnChange1(value: number) {
    setSValue(value)
    ggbApi.current?.setValue('a', sValue)
    if (sValue == 1 || sValue == 2) setNextDisabled(false)
    else setNextDisabled(true)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g08-gmc04-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore dilation in a coordinate plane."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />

      <GGbcontainer key={ggbReload} materialId="wd9ndhcc" onApiReady={onGGBLoaded} />

      {sValue == 3 && pageNum == 0 && (
        <FeedbackCenter>
          Visualize the effect of dilation <br /> to note your observation in the table.
        </FeedbackCenter>
      )}

      {pageNum == 1 && (
        <FeedbackCenter>
          Enlarge the figure and observe the coordinates of the vertices.
        </FeedbackCenter>
      )}

      {pageNum == 1 && sValue == 3 && (
        <Coordinatetextposition3 src={threestage} draggable={false} />
      )}
      {pageNum == 4 && sValue == 3 && (
        <Coordinatetextposition3 src={threestage} draggable={false} />
      )}
      {pageNum == 1 && sValue == 5 && <Coordinatetextposition5 src={fivestage} draggable={false} />}
      {pageNum == 2 && sValue == 5 && <Coordinatetextposition5 src={fivestage} draggable={false} />}
      {pageNum == 4 && sValue == 5 && <Coordinatetextposition5 src={fivestage} draggable={false} />}

      {pageNum == 1 && sValue == 4 && <Coordinatetextposition4 src={fourstage} draggable={false} />}
      {pageNum == 2 && sValue == 4 && <Coordinatetextposition4 src={fourstage} draggable={false} />}
      {pageNum == 4 && sValue == 4 && <Coordinatetextposition4 src={fourstage} draggable={false} />}

      {pageNum == 1 && sValue == 2 && <Coordinatetextposition2 src={twostage} draggable={false} />}
      {pageNum == 2 && sValue == 2 && <Coordinatetextposition2 src={twostage} draggable={false} />}
      {pageNum == 4 && sValue == 2 && <Coordinatetextposition2 src={twostage} draggable={false} />}
      {pageNum == 5 && sValue == 1 && <Coordinatetextposition1 src={onestage} draggable={false} />}

      {pageNum == 1 && sValue == 1 && <Coordinatetextposition1 src={onestage} draggable={false} />}
      {pageNum == 2 && sValue == 1 && <Coordinatetextposition1 src={onestage} draggable={false} />}
      {pageNum == 4 && sValue == 1 && <Coordinatetextposition1 src={onestage} draggable={false} />}
      {pageNum == 5 && sValue == 1 && <Coordinatetextposition1 src={onestage} draggable={false} />}

      {pageNum == 2 && (
        <FeedbackCenter>
          On enlarging the figure centered at the origin, <br /> what will happen to its absolute
          values of x and y coordinates?
        </FeedbackCenter>
      )}

      {pageNum == 3 && <FeedbackCenter>Great! Now, try compressing the figure.</FeedbackCenter>}

      {pageNum == 4 && (
        <FeedbackCenter>
          Compress the figure and observe the coordinates of the vertices.
        </FeedbackCenter>
      )}

      {pageNum == 5 && (
        <FeedbackCenter>
          On compressinging the figure centered at the origin, <br /> what will happen to its
          absolute values of x and y coordinates?
        </FeedbackCenter>
      )}

      {pageNum == 7 && (
        <FeedbackCenter>
          Great! You’ve explored the effect of dilation on the coordinate plane.
        </FeedbackCenter>
      )}

      {pageNum == 1 && <Slider value={sValue} min={1} max={5} step={1} onChange={handleOnChange} />}

      {pageNum == 4 && (
        <Slider value={sValue} min={1} max={5} step={1} onChange={handleOnChange1} />
      )}

      {pageNum == 2 && (
        <DropdownContainer>
          <Dropdown
            dropDownArray={['It increases', 'It decreases']}
            position="top"
            listOrientation="vertical"
            onValueChange={SetDropdownIndex}
            checkStatus={
              dropdownIndex === 0 ? 'correct' : dropdownIndex === 1 ? 'incorrect' : 'default'
            }
          />
        </DropdownContainer>
      )}

      {pageNum == 5 && (
        <DropdownContainer>
          <Dropdown
            dropDownArray={['It increases', 'It decreases']}
            position="top"
            listOrientation="vertical"
            onValueChange={SetDropdownIndex1}
            checkStatus={
              dropdownIndex1 === 0 ? 'incorrect' : dropdownIndex1 === 1 ? 'correct' : 'default'
            }
          />
        </DropdownContainer>
      )}

      {pageNum == 2 && dropdownIndex === 1 && <Popup src={pop1} />}

      {pageNum == 5 && dropdownIndex1 === 0 && <Popup src={pop1} />}

      <ButtonElement
        disabled={
          (pageNum < 2 && nextDisabled) ||
          (pageNum == 2 && dropdownIndex !== 0) ||
          (pageNum == 4 && nextDisabled) ||
          (pageNum == 5 && dropdownIndex1 !== 1)
        }
        onClick={onNextHandle}
        colorTheme="black"
      >
        {pageNum == 0 && 'Start'}
        {pageNum == 1 && 'Next'}
        {pageNum == 2 && 'Next'}
        {pageNum == 3 && 'Next'}
        {pageNum == 4 && 'Next'}
        {pageNum == 5 && 'Next'}
        {pageNum == 6 && 'Next'}

        {pageNum == 7 && (
          <img
            src={reset}
            onClick={() => {
              setGgbReload((g) => g + 1)
              setSValue(3)
              SetDropdownIndex(-1)
              SetDropdownIndex1(-1)
            }}
          />
        )}
      </ButtonElement>
    </AppletContainer>
  )
}
