import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { moveAllDirections } from '@/assets/onboarding'
import { DnDOnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { PageControl } from '@/common/PageControl'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'

import patchimage from './assets/p12.jpg'
const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`
const PatchContainer = styled.img`
  position: absolute;
  width: 40px;
  height: 40px;
  left: 27.5px;
  top: 441px;
`
const HelperText = styled.div<{ top: number }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: ${(p) => p.top}px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  pointer-events: none;
`

const HelperText2 = styled.div<{ top: number }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 80%;
  translate: -72%;
  top: ${(p) => p.top}px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  pointer-events: none;
`
const ColouredSpan = styled.span<{ bgColor: string; color: string }>`
  padding: 0 3px;
  margin: 0 3px;
  background: ${(p) => p.bgColor};
  color: ${(p) => p.color};
  border-radius: 5px;
`
const Fraction = styled.div`
  width: fit-content;
  min-width: 24px;
  height: 60px;
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
  margin: 0 5px;
`

const FractionText = styled.div`
  width: 100%;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #444444;
  text-align: center;
  padding: 0 3px;
`
const FractionLine = styled.div`
  width: 100%;
  height: 0px;
  border: 2px solid #444444;
  border-radius: 25px;
`

const HandPlayer = styled(Player)`
  position: absolute;
  left: 113px;
  top: 105px;
  pointer-events: none;
  z-index: 1;
`

const initialPos = { top: 195, left: 430 }
const finalPos = { top: 195, left: 150 }

export const AppletG06GMC03S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [index, setIndex] = useState(-1)
  const [ggbLoaded, setGGBLoaded1] = useState(false)
  const ggb = useRef<GeogebraAppApi | null>(null)
  const [nextDisable, setNextDisable] = useState(true)
  const [backDisable, setBackDisable] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [prevPageIndex, setPrevPageIndex] = useState(0)
  const hasStateOneChanged = useHasChanged(index == 0)

  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [helperText, setHelperText] = useState(0)
  const [showHandPointer2, setShowHandPointer2] = useState(false)
  const [showHandPointer1, setShowHandPointer1] = useState(true)

  // const [helperText, setHelperText] = useState(0)
  const [showPageIndex2Text, setShowPageIndex2Text] = useState(false)
  const [showPageIndex4Text1, setShowPageIndex4Text1] = useState(true)
  const [showPageIndex4Text2, setShowPageIndex4Text2] = useState(false)
  const [showPageIndex6Text, setShowPageIndex6Text] = useState(false)

  const [timer, setTimer] = useState(false)
  const [counter, setCounter] = useState(4000)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGGBLoaded1(api != null)
  }, [])

  useEffect(() => {
    const api = ggb.current
    if (api != null && ggbLoaded) {
      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'R') {
          setNextDisable(false)
          playMouseIn()
          setShowHandPointer1(false)
        } else if (e.type === 'dragEnd' && e.target === 'R') {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'A_1') {
          setShowHandPointer2(false)
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'A_1') {
          playMouseOut()
        }

        api.registerObjectUpdateListener('t1', () => {
          const valueT1 = api.getValue('t1')
          if (valueT1 > 5.5) {
            setShowPageIndex2Text(true)
          }
        })

        api.registerObjectUpdateListener('fcenter', () => {
          const valuefcenter = api.getValue('fcenter')
          if (valuefcenter > 3) {
            setShowPageIndex6Text(true)
          }
        })

        api.registerObjectUpdateListener('v', () => {
          const dragOption = Boolean(api.getValue('v'))
          if (dragOption === true) {
            setShowPageIndex4Text2(true)
            setShowPageIndex4Text1(false)
            setNextDisable(false)
          }
        })
      }
      api.registerClientListener(onGGBClient)

      return () => {
        ggb.current?.unregisterClientListener(onGGBClient)
      }
    }
  }, [ggbLoaded, playMouseIn, playMouseOut])

  const onPageChange = useCallback(
    (current: number) =>
      setPageIndex((c) => {
        setPrevPageIndex(c)
        return current
      }),

    [],
  )

  const onNextHandle = () => {
    switch (pageIndex) {
      case 0:
        if (ggb.current === null) return
        ggb.current.evalCommand('SetVisibleInView(R,1,false)')
        ggb.current.evalCommand('SetVisibleInView(handle1,1,false)')
        ggb.current.evalCommand('SetVisibleInView(grid,1,false)')
        setBackDisable(false)
        break
      case 1:
        if (ggb.current === null) return
        ggb.current.evalCommand('SetValue(master,1)')
        ggb.current.evalCommand('StartAnimation(t1,true)')
        ggb.current.evalCommand('StartAnimation(t2,true)')
        setBackDisable(true)
        setNextDisable(true)
        setTimer(true)
        setCounter(3000)
        break
      case 2:
        if (ggb.current === null) return
        ggb.current?.evalCommand('StartAnimation(rot,true)')
        setBackDisable(true)
        setNextDisable(true)
        setTimer(true)
        setCounter(7200)
        setHelperText(0)
        break
      case 3:
        if (ggb.current === null) return
        ggb.current.evalCommand('SetValue(master,2)')
        ggb.current.evalCommand('SetValue(v,false)')
        setShowHandPointer2(true)
        setNextDisable(true)
        ggb.current.registerObjectUpdateListener('A_1', () => {
          const A1ValueX = ggb.current?.getXcoord('A_1')
          const A1ValueY = ggb.current?.getYcoord('A_1')
        })
        break
      case 4:
        if (ggb.current === null) return
        setNextDisable(true)
        setTimer(true)
        setCounter(3000)
        break
      case 5:
        if (ggb.current === null) return
        setNextDisable(true)
        ggb.current.evalCommand('SetValue(master,3)')
        ggb.current?.evalCommand('StartAnimation(fcenter,true)')
        break
    }
  }
  const onBackHandle = () => {
    if (ggb.current == null) return
    switch (pageIndex) {
      case 0:
        return
      case 1:
        if (ggb.current === null) return
        ggb.current.evalCommand('SetVisibleInView(R,1,true)')
        ggb.current.evalCommand('SetVisibleInView(handle1,1,true)')
        ggb.current.evalCommand('SetVisibleInView(grid,1,true)')
        break
      case 2:
        if (ggb.current === null) return
        ggb.current.evalCommand('SetValue(master,0)')
        ggb.current.evalCommand('SetValue(t1,0)')
        ggb.current.evalCommand('SetValue(t2,0)')
        setBackDisable(false)
        setNextDisable(false)
        setTimer(false)
        setShowPageIndex2Text(false)
        break
      case 3:
        if (ggb.current === null) return
        ggb.current?.evalCommand('SetValue(rot,0)')
        ggb.current?.evalCommand('SetValue(tcenter,0)')
        break
      case 4:
        if (ggb.current === null) return

        setShowHandPointer2(false)
        ggb.current.evalCommand('SetValue(master,1)')
        setNextDisable(false)
        ggb.current.evalCommand('SetValue(v,false)')
        ggb.current?.setCoords('A_1', 9.2, 6)
        break
      case 5:
        setNextDisable(false)
        break
      case 6:
        if (ggb.current === null) return
        ggb.current.evalCommand('SetValue(master,2)')
        ggb.current?.evalCommand('SetValue(fcenter,0)')
        break
    }
  }
  const onResetHandle = () => {
    if (ggb.current == null) return
    ggb.current?.evalCommand('RunClickScript(reset)')
    ggb.current.evalCommand('SetVisibleInView(R,1,true)')
    ggb.current.evalCommand('SetVisibleInView(handle1,1,true)')
    ggb.current.evalCommand('SetVisibleInView(grid,1,true)')
    setShowHandPointer1(true)
  }

  useInterval(
    () => {
      if (pageIndex == 2) {
        setNextDisable(false)
        setBackDisable(false)
      } else if (pageIndex == 3) {
        if (helperText == 0) {
          setHelperText(1)
          setCounter(800)
        } else if (helperText == 1) {
          setHelperText(2)
          setNextDisable(false)
          setBackDisable(false)
          setTimer(false)
        }
      } else if (pageIndex == 5) {
        setNextDisable(false)
        setTimer(false)
      }
    },
    timer ? counter : null,
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-gmc03-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Derive area of trapezoid by transforming it into a rectangle."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="qbdrmbus" top={90} left={35} onApiReady={onGGBLoaded} />
      <PageControl
        total={7}
        onNext={onNextHandle}
        onBack={onBackHandle}
        onChange={onPageChange}
        nextDisabled={nextDisable}
        backDisabled={backDisable}
        onReset={onResetHandle}
      />

      {ggbLoaded && (
        <HelperText top={576}>
          {pageIndex == 0 && 'Move the vertex to create a trapezoid of your choice.'}
          {pageIndex == 1 && 'Good job! Now create an identical trapezoid.'}
          {pageIndex == 2 && showPageIndex2Text && (
            <>
              {'Flip and join the new trapezoid to the original to form a'}
              <ColouredSpan bgColor="#6595DE" color="#FFFFFF">
                parallelogram.
              </ColouredSpan>
            </>
          )}
          {pageIndex == 4 && showPageIndex4Text1 && (
            <>
              {'To create rectangle, move the selected triangle to the '}
              <ColouredSpan bgColor="#F4E5FF" color="#AA5EE0">
                marked region
              </ColouredSpan>
              {'.'}
            </>
          )}
        </HelperText>
      )}
      <HelperText top={550}>
        {pageIndex == 3 && helperText >= 1 && (
          <>
            {'Length of the '}
            <ColouredSpan bgColor="#6595DE" color="#FFFFFF">
              parallelogram
            </ColouredSpan>
            {' = '}
            <ColouredSpan bgColor="#7F5CF4" color="#FFFFFF">
              sum of the bases of trapezoid
            </ColouredSpan>
          </>
        )}
      </HelperText>

      <HelperText top={602}>
        {pageIndex == 3 && helperText == 2 && (
          <>
            {'Height of the '}
            <ColouredSpan bgColor="#6595DE" color="#FFFFFF">
              parallelogram
            </ColouredSpan>
            {' = '}
            <ColouredSpan bgColor="#F4E5FF" color="#AA5EE0">
              height of trapezoid
            </ColouredSpan>
          </>
        )}
      </HelperText>
      <HelperText top={525}>
        {pageIndex == 4 && showPageIndex4Text2 && (
          <>{'Since, this rectangle is composed of 2 identical trapezoids,'}</>
        )}

        {pageIndex == 5 && (
          <>
            {'Area of the '}
            <ColouredSpan bgColor="#FFD2A6" color="#444444">
              trapezoid
            </ColouredSpan>
            {' = '}
            <Fraction>
              <FractionText>1</FractionText>
              <FractionLine />
              <FractionText>2</FractionText>
            </Fraction>
            {' x Area of the '}
            <ColouredSpan bgColor="#F3F7FE" color="#6595DE">
              rectangle
            </ColouredSpan>
          </>
        )}
        {pageIndex == 6 && showPageIndex6Text && (
          <>
            {'Area of the '}
            <ColouredSpan bgColor="#FFD2A6" color="#444444">
              trapezoid
            </ColouredSpan>
            {' = '}
            <Fraction>
              <FractionText>1</FractionText>
              <FractionLine />
              <FractionText>2</FractionText>
            </Fraction>
            {' x ( '}
            <ColouredSpan bgColor="#7F5CF4" color="#FFFFFF">
              a
            </ColouredSpan>
            {' + '}
            <ColouredSpan bgColor="#7F5CF4" color="#FFFFFF">
              b
            </ColouredSpan>
            {' ) x ( '}
            <ColouredSpan bgColor="#F4E5FF" color="#AA5EE0">
              h
            </ColouredSpan>
            {' ) '}
          </>
        )}
      </HelperText>
      <HelperText top={585}>
        {pageIndex == 4 && showPageIndex4Text2 && (
          <>
            {'2 x Area of the '}
            <ColouredSpan bgColor="#FFD2A6" color="#444444">
              trapezoid
            </ColouredSpan>
            {' = Area of the '}
            <ColouredSpan bgColor="#F3F7FE" color="#6595DE">
              rectangle
            </ColouredSpan>
          </>
        )}
      </HelperText>
      <HelperText2 top={585}>
        {pageIndex == 5 && (
          <>
            {' = '}
            <Fraction>
              <FractionText>1</FractionText>
              <FractionLine />
              <FractionText>2</FractionText>
            </Fraction>
            {' x ( '}
            <ColouredSpan bgColor="#7F5CF4" color="#FFFFFF">
              a + b
            </ColouredSpan>
            {' ) x ( '}
            <ColouredSpan bgColor="#F4E5FF" color="#AA5EE0">
              h
            </ColouredSpan>
            {' ) '}
          </>
        )}
      </HelperText2>
      {showHandPointer1 && <HandPlayer src={moveAllDirections} loop autoplay />}
      {showHandPointer2 && (
        <OnboardingController>
          <OnboardingStep index={0}>
            <DnDOnboardingAnimation
              complete={hasStateOneChanged}
              initialPosition={initialPos}
              finalPosition={finalPos}
            />
          </OnboardingStep>
        </OnboardingController>
      )}
      {ggbLoaded && <PatchContainer src={patchimage}></PatchContainer>}
    </AppletContainer>
  )
}
