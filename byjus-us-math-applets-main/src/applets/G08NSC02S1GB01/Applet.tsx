import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { moveHorizontally } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'

import { Math as Latex } from '../../common/Math'
import reset from './assets/reset.svg'
const ButtonElement = styled.button<{ pageNo: number }>`
  position: absolute;
  bottom: 20px;
  left: 50%;
  translate: -50%;
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  background: ${(p) => (p.pageNo == 0 ? '#1a1a1a' : '#fff')};
  border: 2px solid #1a1a1a;
  color: ${(p) => (p.pageNo == 1 ? '#1a1a1a' : '#fff')};
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  height: 60px;
  cursor: pointer;
  :disabled {
    cursor: default;
    opacity: 0.3;
  }
`
const GGB = styled(Geogebra)`
  position: absolute;
  top: 90px;
  left: 50%;
  translate: -50%;
`
const HelperText = styled.div<{ top: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: 50%;
  translate: -50%;
  display: flex;
  width: 650px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 36px;
`
const Text = styled.div`
  margin-top: 10px;
  max-width: 570px;
`
const ColoredSpan = styled.span`
  background-color: #dff1f1;
  color: #2d6066;
  padding: 0 5px;
  margin: 0 5px;
`
const HandPointer = styled(Player)`
  pointer-events: none;
  position: absolute;
  top: 415px;
  left: 30px;
  transform: rotate(-45deg);
`
export const AppletG08NSC02S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [nextDisabled, setNextDisabled] = useState(true)
  const [intermediateText, setIntermediateText] = useState(0)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const [squareValue, setSquareValue] = useState(0)
  const [squareRoot, setSquareRoot] = useState(0)
  const [pageNum, setPageNum] = useState(0)
  const [isWholeNum, setIsWholeNum] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (!api) return
      api.registerClientListener((e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'A') {
          onInteraction('drag')
          playMouseIn()
          setShowHandPointer(false)
        } else if (e.type === 'dragEnd' && e.target === 'A') {
          onInteraction('drop')
          playMouseOut()
          setSquareValue(api.getValue('p1'))
          setSquareRoot(api.getValue('x(A)'))
          setNextDisabled(false)
        }
      })
    },
    [ggbApi],
  )
  useInterval(
    () => {
      if (!ggbApi.current) return
      if (intermediateText == 0) {
        setIntermediateText(1)
        ggbApi.current.setValue('textshow', 1)
      } else if (intermediateText == 1) {
        setIntermediateText(2)
        setIsAnimating(false)
        setNextDisabled(false)
      }
    },
    isAnimating ? 3000 : null,
  )
  const onNextHandle = () => {
    playClick()
    if (pageNum == 0) {
      if (!ggbApi.current) return
      ggbApi.current.evalCommand('RunClickScript(next)')
      setPageNum(1)
      setNextDisabled(true)
      setIsAnimating(true)
      onInteraction('next')
    } else {
      if (!ggbApi.current) return
      ggbApi.current.evalCommand('RunClickScript(rebut)')
      setPageNum(0)
      setNextDisabled(true)
      setIntermediateText(0)
      setShowHandPointer(true)
      onInteraction('reset')
    }
  }
  useEffect(() => {
    if (squareRoot % 1 == 0) setIsWholeNum(true)
    else setIsWholeNum(false)
  }, [squareRoot])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-nsc02-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore the relation between square numbers and their square roots."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGB materialId="wcqgtgew" width={600} height={520} onApiReady={onGGBHandle} />
      <HelperText top={590}>
        {pageNum == 1 && intermediateText > 0 && (
          <Text>
            <ColoredSpan>
              <Latex>{String.raw`\sqrt{${squareValue.toFixed(0)}}`}</Latex>
            </ColoredSpan>
            {' = ' +
              (isWholeNum
                ? squareRoot
                : squareRoot.toFixed(3) + "... (Doesn't end, doesn't repeat)")}
          </Text>
        )}
      </HelperText>
      <HelperText top={intermediateText == 2 ? 625 : 610}>
        <Text>
          {pageNum == 0 && 'Move the vertex to resize the square to your preferred size.'}
          {pageNum == 1 && intermediateText == 0 && (
            <>
              {'Area of square​ = ' + squareValue.toFixed(0) + ' sq. units'}
              <br />
              {'Side of square = '}
              <ColoredSpan>
                <Latex>{String.raw`\sqrt{${squareValue.toFixed(0)}}`}</Latex>
              </ColoredSpan>
              {' units'}
            </>
          )}
          {pageNum == 1 &&
            intermediateText == 2 &&
            (isWholeNum ? (
              <>
                Square root of a perfect square is an<ColoredSpan>integral number</ColoredSpan>.
                <br />
                &rArr; Square root of a perfect square is a
                <ColoredSpan>rational number</ColoredSpan>.
              </>
            ) : (
              <>
                Square root of a non-perfect square is an
                <ColoredSpan>irrational number</ColoredSpan>.
              </>
            ))}
        </Text>
      </HelperText>
      {showHandPointer && <HandPointer src={moveHorizontally} autoplay loop />}
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle} pageNo={pageNum}>
        {pageNum == 0 && 'Next'}
        {pageNum == 1 && <img src={reset} />}
      </ButtonElement>
    </AppletContainer>
  )
}
