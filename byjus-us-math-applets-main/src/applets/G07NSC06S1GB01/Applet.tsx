import { FC, useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import tryAgain from './assets/tryAgain.svg'
const GGB = styled(Geogebra)`
  position: absolute;
  top: 150px;
  left: 50px;
  width: 607px;
  height: 600px;
  scale: 1.132;
`
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
  background: ${(p) => (p.colorTheme == 'white' ? '#fff' : '#1a1a1a')};
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
const HelperText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 620px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const Text = styled.div`
  margin-left: 10px;
  max-width: 570px;
`
const InputBox = styled.input<{ textColor: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  gap: 20px;
  width: 66px;
  justify-content: center;
  height: 60px;
  background: #f6f6f6;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: ${(p) => p.textColor};
  text-align: center;
`
const Input = styled.div<{ top: number; left: number }>`
  position: absolute;
  width: 66px;
  height: 60px;
  top: ${(p) => p.top}px;
  left: ${(p) => p.left}px;
`
export const AppletG07NSC06S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [pageNum, setPageNum] = useState(1)
  const [position, setPosition] = useState(0)
  const [answer, setAnswer] = useState(0)
  const [input, setInput] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(true)
  const [textColor, setTextColor] = useState('#646464')
  const playClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const [pointer, setPointer] = useState({ left: 0, top: 0 })
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      api.registerObjectUpdateListener('Qcounter', () => {
        setPageNum(api.getValue('Qcounter'))
      })
      api.registerObjectUpdateListener('check4correct', () => {
        if (api.getValue('check4correct')) {
          setPageNum(5)
          setTextColor('#32A66C')
        }
      })
      api.registerObjectUpdateListener('FishPointPositive', () => {
        setPosition(api.getValue('FishPointPositive'))
      })
      api.registerObjectUpdateListener('answer', () => {
        setAnswer(Math.round(api.getValue('answer') * 10) / 10)
      })
      api.registerObjectUpdateListener('l', () => {
        if (api.getVisible('l')) setPointer(locatePoint2d('L', api))
      })
      api.registerObjectUpdateListener('check4wrong', () => {
        if (api.getValue('check4wrong')) {
          setTextColor('#C66')
        }
      })
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && (e.hits[0] === 'pic19' || e.hits[0] === 'pic6')) {
          onInteraction('drag')
          playMouseIn()
        } else if (e.type === 'dragEnd' && (e.target === 'pic19' || e.target === 'pic6')) {
          onInteraction('drop')
          playMouseOut()
          setNextDisabled(false)
        }
      })
    },
    [ggbApi],
  )
  const onNextHandle = () => {
    playClick()
    if (!ggbApi.current) return
    if (pageNum == 1) {
      ggbApi.current.evalCommand('RunClickScript(pic37)')
      onInteraction('next')
      setNextDisabled(true)
    } else if (pageNum == 2) {
      ggbApi.current.evalCommand('RunClickScript(pic15)')
      onInteraction('next')
    } else if (pageNum == 4) {
      ggbApi.current.evalCommand('RunClickScript(pic33)')
      onInteraction('next')
    } else if (pageNum == 5) {
      ggbApi.current.evalCommand('RunClickScript(pic12)')
      onInteraction('reset')
      setNextDisabled(true)
      setInput(0)
      setTextColor('#646464')
    }
  }
  const onInputHandle = (e: any) => {
    if (pageNum == 5) return
    if (e.target.value !== ' ' && e.target.value <= 20 && e.target.value >= 0) {
      setTextColor('#646464')
      setInput(e.target.value)
      if (!ggbApi.current) return
      ggbApi.current.setValue('compareslider', Number(e.target.value))
      ggbApi.current.setValue('check4wrong', 0)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-nsc06-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore rational numbers with sea level."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GGB materialId="ddatjsxx" onApiReady={onGGBHandle} />
      {pageNum > 3 && (
        <Input top={pointer.top + 115} left={pointer.left + 30}>
          <InputBox onChange={onInputHandle} placeholder="0" value={input} textColor={textColor} />
        </Input>
      )}
      <HelperText>
        <Text>
          {pageNum == 1 && 'Move the pointer to place Jack at an elevation of your choice.'}
          {pageNum == 2 &&
            'Move the pointer to place the fish/bird at an elevation of your choice.'}
          {pageNum == 4 &&
            'What is the height difference between Jack and the ' +
              (position > 0 ? 'bird' : 'fish') +
              '?'}
          {pageNum == 5 &&
            'Awesome! You got it right. The difference between Jack and the bird is ' +
              answer +
              ' meters.'}
        </Text>
      </HelperText>
      <ButtonElement
        onClick={onNextHandle}
        disabled={nextDisabled}
        colorTheme={pageNum == 5 ? 'white' : 'black'}
      >
        {pageNum < 3 && 'Next'}
        {pageNum == 4 && 'Check'}
        {pageNum == 5 && <img src={tryAgain} />}
      </ButtonElement>
    </AppletContainer>
  )
}
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
    left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
    top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
  }
}
