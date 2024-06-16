import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { moveUp } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import circle from './assets/circle.svg'
import rectangle from './assets/rectangle.svg'
import square from './assets/square.svg'
import triangle from './assets/triangle.svg'
import tryNew from './assets/tryNew.svg'
const GGBContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 90px;
  width: 680px;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f7fe;
  span {
    background: #f3f7fe;
    height: 400px;
    width: 10px;
    position: absolute;
    right: 60px;
  }
`
const GGB = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: -45px;
  width: 680px;
  height: 500px;
  scale: 0.8;
`
const ButtonElement = styled.button`
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
  background: #1a1a1a;
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
const HelperText = styled.div<{ top: number }>`
  display: flex;
  width: 650px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: ${(p) => p.top}px;
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
const ColoredSpan = styled.span`
  padding: 0 5px;
  background: #ffe9d4;
  color: #d97a1a;
  border-radius: 5px;
  margin: 0 5px;
`
const CheckBoxes = styled.div`
  display: flex;
  width: 700px;
  height: 140px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 560px;
  left: 50%;
  translate: -50%;
`
const CheckBoxContainer = styled.div<{ selected: boolean }>`
  cursor: pointer;
  display: flex;
  width: 140px;
  height: 140px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  background-color: ${(p) => (p.selected ? '#c7c7c7' : '#fff')};
  border-radius: 12px;
  border: 1px solid ${(p) => (p.selected ? '#212121' : '#c7c7c7')};
  box-shadow: ${(p) => (p.selected ? 'inset 0 0 0 4px #fff' : '0px -4px 0px 0px #C7C7C7 inset')};
`
const HandPointer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: ${(p) => p.left}px;
  pointer-events: none;
`
const shape = ['triangles', 'squares', 'rectangles', 'circles']
const prism = ['triangular', 'square', 'rectangular', 'circular']
const top = [150, 150, 150, 150]
const left = [310, 276, 276, 310]
export const AppletG08GMC08S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [optionSel, setOptionSel] = useState(-1)
  const [nextDisabled, setNextDisabled] = useState(true)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const playClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'A') {
          onInteraction('drag')
          playMouseIn()
          setShowHandPointer(false)
        } else if (e.type === 'dragEnd' && e.target === 'A') {
          onInteraction('drop')
          playMouseOut()
        }
      })
      api.registerObjectUpdateListener('d', () => {
        if (api.getValue('d') > 76) setNextDisabled(false)
        else setNextDisabled(true)
      })
      api.registerObjectUpdateListener('an', () => {
        if (api.getValue('an') == 1) setShowHandPointer(true)
      })
    },
    [ggbApi],
  )
  const onNextHandle = () => {
    if (!ggbApi.current) return
    playClick()
    if (pageNum == 0) {
      setPageNum(1)
      onInteraction('next')
      ggbApi.current.setValue('next', 2)
      setNextDisabled(true)
    } else {
      setPageNum(0)
      onInteraction('reset')
      ggbApi.current.setValue('next', 1)
      ggbApi.current.setValue('p', 0)
      ggbApi.current.evalCommand('SetCoords(A, 2.5, 2.5, 0)')
      setNextDisabled(true)
      setOptionSel(-1)
    }
  }
  const onOptionClicked = (sel: number) => {
    if (!ggbApi.current) return
    playClick()
    onInteraction('tap')
    ggbApi.current.setValue('p', sel + 1)
    setOptionSel(sel)
    setNextDisabled(false)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g08-gmc08-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Creating 3D solids by stacking 2D shapes."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GGBContainer>
        <GGB materialId="rqqtdtzz" onApiReady={onGGBHandle} />
        <span />
      </GGBContainer>
      <HelperText top={pageNum == 0 ? 490 : 570}>
        <Text>
          {pageNum == 0 &&
            (nextDisabled ? (
              'Select a 2D shape for the base.'
            ) : (
              <>
                Stack the<ColoredSpan>{shape[optionSel]}</ColoredSpan>to create a 3D solid.
              </>
            ))}
          {pageNum == 1 &&
            (nextDisabled ? (
              <>
                Stack the<ColoredSpan>{shape[optionSel]}</ColoredSpan>to create a 3D solid.
              </>
            ) : (
              <>
                Well done! You have created a<ColoredSpan>{prism[optionSel]}</ColoredSpan>based 3D
                solid.
              </>
            ))}
        </Text>
      </HelperText>
      {showHandPointer && (
        <HandPointer src={moveUp} top={top[optionSel]} left={left[optionSel]} autoplay loop />
      )}
      {pageNum == 0 && (
        <CheckBoxes>
          <CheckBoxContainer
            selected={optionSel == 0}
            onClick={() => {
              onOptionClicked(0)
            }}
          >
            <img src={triangle} />
          </CheckBoxContainer>
          <CheckBoxContainer
            selected={optionSel == 1}
            onClick={() => {
              onOptionClicked(1)
            }}
          >
            <img src={square} />
          </CheckBoxContainer>
          <CheckBoxContainer
            selected={optionSel == 2}
            onClick={() => {
              onOptionClicked(2)
            }}
          >
            <img src={rectangle} />
          </CheckBoxContainer>
          <CheckBoxContainer
            selected={optionSel == 3}
            onClick={() => {
              onOptionClicked(3)
            }}
          >
            <img src={circle} />
          </CheckBoxContainer>
        </CheckBoxes>
      )}
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {pageNum == 0 && 'Submit'}
        {pageNum == 1 && <img src={tryNew} />}
      </ButtonElement>
    </AppletContainer>
  )
}
