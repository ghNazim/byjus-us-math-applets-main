import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { moveVertically } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import { Math } from '../../common/Math'
import retry from './assets/retry.svg'
const GGBContainer = styled.div`
  position: absolute;
  width: 818px;
  height: 610px;
  scale: 0.8;
  top: 40px;
  left: 50%;
  translate: -50%;
`
const GGB = styled(Geogebra)`
  width: 818px;
  height: 610px;
  position: absolute;
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
const HelperText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 615px;
  width: 700px;
  height: 60px;
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
  max-width: 623px;
`
const ColoredSpan = styled.span`
  color: #1cb9d9;
  background-color: #d1f7ff;
  border-radius: 5px;
  padding: 0 3px;
  margin: 0 3px;
`
const BorderedSpan = styled.span`
  padding: 0px 5px;
  border-radius: 5px;
  border: 1px solid #444;
`
const Fract = styled.span`
  font-size: 28px;
  font-weight: 700;
`
const HandPointer = styled(Player)`
  position: absolute;
  top: 224px;
  left: 145px;
  pointer-events: none;
`
const Patch = styled.div`
  position: absolute;
  top: 532px;
  left: 36px;
  width: 50px;
  height: 50px;
  border: 12px;
  background: #f3f7fe;
`
export const AppletG08GMC08S2GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [pageNum, setPageNum] = useState(0)
  const [pourCount, setPourCount] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(true)
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [showHandPointer, setShowHandPointer] = useState(false)

  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setShowHandPointer(true)
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && (event.hits[0] == 'A' || event.hits[0] == 'H')) {
          playDragStart()
          onInteraction('drag')
          setShowHandPointer(false)
        }
        if (event[0] == 'dragEnd' && (event[1] == 'A' || event[1] == 'H')) {
          playDragEnd()
          onInteraction('drop')
          setNextDisabled(false)
        }
      })

      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == 'DragRight') {
          playDragStart()
          onInteraction('drag')
          setShowHandPointer(false)
        }
        if (event[0] == 'dragEnd' && event[1] == 'DragRight') {
          playDragEnd()
          onInteraction('drop')
        }
      })
      ggbApi.current.registerObjectUpdateListener('tilt', () => {
        if (ggbApi.current === null) return
        if (ggbApi.current.getValue('tilt') == 1) {
          setNextDisabled(false)
        }
      })
    },
    [ggbApi],
  )
  const onNextHandle = () => {
    if (ggbApi.current === null) return
    playClick()
    onInteraction(pageNum == 3 ? 'reset' : 'next')
    switch (pageNum) {
      case 0:
        ggbApi.current.evalCommand('RunClickScript(start)')
        setPageNum(1)
        break
      case 1:
        if (pourCount < 3) {
          ggbApi.current.evalCommand('RunClickScript(pour)')
          setNextDisabled(true)
          setPourCount((p) => p + 1)
        } else {
          ggbApi.current.evalCommand('RunClickScript(next)')
          setPageNum(2)
        }
        break
      case 2:
        ggbApi.current.evalCommand('RunClickScript(next)')
        setPageNum(3)
        break
      case 3:
        ggbApi.current.evalCommand('RunClickScript(retry)')
        setPageNum(0)
        setNextDisabled(true)
        setShowHandPointer(true)
        setPourCount(0)
        break
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g08-gmc08-s2-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Relation between volume of cone and cylinder of same base and height."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GGBContainer>
        <GGB materialId="cbrvcxet" onApiReady={onGGBHandle} />
      </GGBContainer>
      <HelperText>
        <Text>
          {pageNum == 0 && 'Set the base and the height of the cone.'}
          {pageNum == 1 &&
            (pourCount == 3 && !nextDisabled
              ? 'You poured the liquid from the cone 3 times to fill the cylinder.'
              : 'Pour the liquid from the cone to fill the cylinder.')}
          {pageNum == 2 && (
            <>
              3 <Math>{String.raw`\times `}</Math> Volume of the <BorderedSpan>cone</BorderedSpan> =
              Volume of the <ColoredSpan>cylinder</ColoredSpan>
            </>
          )}
          {pageNum == 3 && (
            <>
              Volume of the <BorderedSpan>cone</BorderedSpan>
              {' = '}
              <Fract>
                <Math>{String.raw`\frac{${1}}{${3}}`}</Math>
              </Fract>
              {' Volume of the '}
              <ColoredSpan>cylinder</ColoredSpan>
            </>
          )}
        </Text>
      </HelperText>
      {showHandPointer && pageNum == 0 && <HandPointer autoplay loop src={moveVertically} />}
      {ggbApi.current !== null && <Patch />}
      <ButtonElement onClick={onNextHandle} disabled={nextDisabled}>
        {pageNum == 0 && 'Start'}
        {pageNum == 1 && (pourCount == 3 && !nextDisabled ? 'Next' : 'Pour')}
        {pageNum == 2 && 'Next'}
        {pageNum == 3 && <img src={retry} />}
      </ButtonElement>
    </AppletContainer>
  )
}
