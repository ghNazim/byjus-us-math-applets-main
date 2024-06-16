import { Player } from '@lottiefiles/react-lottie-player'
import { useSpring } from '@react-spring/core'
import { animated } from '@react-spring/web'
import Fraction from 'fraction.js'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { locatePoint2d } from '@/common/Geogebra/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useSFX } from '@/hooks/useSFX'

import mouseClick from '../../common/handAnimations/moveAllDirections.json'
import buttonIcon from './assets/buttonIcon.svg'
import viewSlope from './assets/viewSlope.svg'

const StyledGgb = styled(Geogebra)`
  height: 400px;
  width: 100%;
  overflow: hidden;
  position: absolute;
  left: 75px;
  top: 120px;
`

const PlacedPlayer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  pointer-events: none;
`

const TextBox = styled.div<{ padding: boolean; size: number; color: string }>`
  text-align: center;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  width: 100%;
  padding: ${(props) => (props.padding ? 10 : 0)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ContainerDiv = styled.div`
  position: absolute;
  top: 480px;
  margin: 50px;
  margin-right: 50px;
  width: 86%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: center;
`

const FractionHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  margin-left: 15px;
  margin-right: 15px;
`

const HorizontalLine = styled.div`
  background: #666;
  width: 150%;
  height: 2px;
  align-self: center;
  border-radius: 1px;
`

const FractionFormer: FC<{
  colorNum?: string
  colorDen?: string
  numerator: string
  denominator: string
  size: number
}> = ({ colorNum = '#1A1A1A', colorDen = '#1A1A1A', numerator, denominator, size }) => {
  return (
    <FractionHolder>
      <TextBox color={colorNum} padding={false} size={size}>
        {numerator}
      </TextBox>
      <HorizontalLine />
      <TextBox color={colorDen} padding={false} size={size}>
        {denominator}
      </TextBox>
    </FractionHolder>
  )
}

const Empty = styled.div`
  height: 60px;
`

const ButtonElement = styled.button<{ buttonType: string }>`
  height: 60px;
  border: none;
  background: #${(props) => (props.buttonType === 'reset' ? 'ffffff' : '1A1A1A')};
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 42px;
  text-align: center;
  color: #${(props) => (props.buttonType === 'reset' ? '1A1A1A' : 'ffffff')};
  align-items: center;
  display: flex;
  justify-content: center;
  border: 2px solid #1a1a1a;
  gap: 20px;
  align-self: center;
  padding-right: 20px;
  padding-left: 20px;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
  &:hover {
    background: #${(props) => (props.buttonType === 'reset' ? 'eee' : '222')};
  }
  &:active {
    background: #${(props) => (props.buttonType === 'reset' ? 'eee' : '444')};
  }
`

const Button: FC<{ buttonType: string; disable: boolean; onClick: () => void }> = ({
  onClick,
  buttonType,
  disable,
}) => {
  const playMouseClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)

  return !disable ? (
    <ButtonElement
      buttonType={buttonType}
      onClick={() => {
        onClick()
        playMouseClick()
        onInteraction('tap')
      }}
    >
      {buttonType === 'reset' && (
        <>
          <img src={buttonIcon} /> Reset
        </>
      )}
      {buttonType === 'viewSlope' && (
        <>
          <img src={viewSlope} /> View Slope{' '}
        </>
      )}
    </ButtonElement>
  ) : (
    <Empty />
  )
}

const topValues = [245, 550, 670, 550, 550]
const leftValues = [-105, 440, 270, 440, 320]

const Label = styled(animated.div)`
  position: absolute;
  z-index: 5;
`

const DynamicLabel = styled.div<{ left: number; top: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  z-index: 5;
`

export const AppletG08EEC09S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  // const [bPos, setBPos] = useState({ leftPixel: 459.34850804018345, topPixel: 134.87800757352636 })
  // const [cPos, setCPos] = useState({ leftPixel: 148.71987435233657, topPixel: 367.58154785867 })
  const [midPos, setMidPos] = useState({ left: 0, top: 0 })
  const [resetBtn, setResetBtn] = useState(false)
  const [buttonDisable, setButtonDisable] = useState(true)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const [handPosition, setHandPosition] = useState(0)

  const [runPos, setRunPos] = useState({
    leftPixel: 459.34850804018345,
    topPixel: 134.87800757352636,
  })
  const [risePos, setRisePos] = useState({
    leftPixel: 148.71987435233657,
    topPixel: 367.58154785867,
  })

  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)

  const hasBChanged = useHasChanged(runPos)
  const hasCChanged = useHasChanged(risePos)

  const [lengths, setLengths] = useState({ run: 0, rise: 0 })

  const runPosition = useSpring({
    immediate: true,
    left: runPos.leftPixel - 22,
    top: runPos.topPixel + 50,
  })
  const risePosition = useSpring({
    immediate: true,
    left: risePos.leftPixel,
    top: risePos.topPixel,
  })

  const handleGGBready = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      if (!ggbApi.current) return

      ggbApi.current?.registerObjectUpdateListener('N', () => {
        if (ggbApi.current) {
          // const { leftPixel, topPixel } = locatePoint2d('N', ggbApi.current)
          setRunPos(locatePoint2d('N', ggbApi.current))
          // setLeft(leftPixel)
          // setTop(topPixel)
          // console.log({ leftPixel, topPixel })
        }
      })

      ggbApi.current?.registerObjectUpdateListener('O', () => {
        if (ggbApi.current) {
          setRisePos(locatePoint2d('O', ggbApi.current))
        }
      })

      setGGBLoaded(true)
    },
    [ggbApi],
  )

  useIsomorphicLayoutEffect(() => {
    setShowHandPointer(true)
  }, [ggbLoaded])

  useEffect(() => {
    if (ggbLoaded && (hasBChanged || hasCChanged)) {
      setShowHandPointer(false)
      setButtonDisable(false)
    }
  }, [ggbLoaded, hasBChanged, hasCChanged])

  const handleClick = () => {
    if (resetBtn) {
      ggbApi.current?.evalCommand('SetValue(B,(3,3))')
      ggbApi.current?.evalCommand('SetValue(C,(-5,-3))')
      ggbApi.current?.evalCommand('SetValue(I,F)')
      ggbApi.current?.evalCommand('If(ViewSlope>0,SetValue(ViewSlope,0))')
      ggbApi.current?.evalCommand('SetValue(pointtracker,0)')
      setResetBtn(false)
    } else {
      ggbApi.current?.evalCommand('SetValue(ViewSlope, 1)')
      setResetBtn(true)
      setLengths({
        run: ggbApi.current ? ggbApi.current?.getValue('k') : 0,
        rise: ggbApi.current ? ggbApi.current?.getValue('l') : 0,
      })
    }
  }

  const simplifyFrac = new Fraction(lengths.rise, lengths.run === 0 ? 1 : lengths.run)

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec09-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore the relation between the line and the slope."
        backgroundColor="#F6F6F6"
        buttonColor="#c0c0c0"
      />
      <StyledGgb materialId="dnfhfhvy" onApiReady={handleGGBready} />
      <ContainerDiv>
        <TextBox color="#1A1A1A" size={20} padding>
          {resetBtn
            ? 'Shift the line and observe the new slope.'
            : 'Adjust the line and observe the new slope.'}
        </TextBox>
        {resetBtn ? (
          <>
            <TextBox color="#1A1A1A" size={20} padding>
              Slope ={' '}
              <FractionFormer
                colorNum="#C882FA"
                colorDen="#FF8F1F"
                numerator="Rise"
                denominator="Run"
                size={20}
              />
              &nbsp;=&nbsp;
              <FractionFormer
                colorNum="#C882FA"
                colorDen="#FF8F1F"
                numerator={lengths.rise.toString()}
                denominator={lengths.run.toString()}
                size={20}
              />
              {lengths.run === 0 ? (
                <span style={{ padding: '10px' }}>∞</span>
              ) : (
                <>
                  &nbsp;=&nbsp;
                  <FractionFormer
                    numerator={simplifyFrac.n.toString()}
                    denominator={simplifyFrac.d.toString()}
                    size={20}
                  />
                </>
              )}
            </TextBox>
          </>
        ) : null}
        <Button
          disable={buttonDisable}
          onClick={handleClick}
          buttonType={resetBtn ? 'reset' : 'viewSlope'}
        />
      </ContainerDiv>
      {ggbLoaded && showHandPointer && (
        <PlacedPlayer
          src={mouseClick}
          top={topValues[handPosition]}
          left={leftValues[handPosition]}
          autoplay
          loop
        />
      )}
      {/* {resetBtn ? (
        <>
          <Label style={runPosition}>
            <TextBox color="#FF8F1F" size={16} padding={false}>
              Run = {lengths.run}
            </TextBox>
          </Label>
          <DynamicLabel left={left} top={top}>
            <TextBox color="#FF8F1F" size={16} padding={false}>
              Run = {lengths.run}
            </TextBox>
          </DynamicLabel>

          <Label style={risePosition}>
            <TextBox color="#C882FA" size={16} padding={false}>
              Rise = {lengths.rise}
            </TextBox>
          </Label>
          <Label style={risePos}>
            <TextBox size={16} padding={false}>
              Rise = 4
            </TextBox>
          </Label>
        </>
      ) : null} */}
    </AppletContainer>
  )
}
