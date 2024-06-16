import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveHorizontally, moveRight } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import next from './assets/next.svg'
import one from './assets/one.svg'
import oneActive from './assets/oneActive.svg'
import reset from './assets/reset.svg'
import three from './assets/three.svg'
import threeActive from './assets/threeActive.svg'
import two from './assets/two.svg'
import twoActive from './assets/twoActive.svg'

const GGBcontainer = styled(Geogebra)`
  top: 50px;
  position: absolute;
  left: 50%;
  translate: -50%;
  scale: 0.8;
`
const CTAButton = styled.img<{ active?: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  cursor: ${(p) => (p.active ? 'pointer' : 'default')};
`
const NudgePlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
`
const Feedback = styled.div`
  position: absolute;
  top: 480px;
  translate: 0 -50%;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
  translate: 0 -50%;
`
const Brown = styled.span`
  height: 25px;
  display: inline-block;
  padding-left: 6px;
  padding-right: 7px;
  background-color: #fff6db;
  color: #cf8b04;
  border-radius: 5px;
`
const ButtonHolder = styled.div`
  position: absolute;
  width: 100%;
  bottom: 100px;
  display: flex;
  justify-content: center;
  gap: 20px;
`
const IMG = styled.img<{ active?: boolean; disabled?: boolean }>`
  cursor: ${(p) => (p.active ? 'pointer' : 'default')};
  opacity: ${(p) => (p.disabled ? 0.4 : 1)};
  &:hover {
    scale: ${(p) => (p.active ? 1.01 : 1)};
  }
`
export const AppletG07GMC05S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
    ggbApi.current?.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'pic63') {
        playMouseIn()
        setNudgeOn(false)
      } else if (e.type === 'dragEnd' && e.target === 'pic63') {
        playMouseOut()
      }
    })
  }, [])
  const ggb = ggbApi.current
  const [frame, setFrame] = useState(1)
  const [dragEnd, setDragEnd] = useState(0)
  const [nudgeOn, setNudgeOn] = useState(true)
  const [activeButton, setActiveButton] = useState(1)
  const [isActive, setIsActive] = useState(false)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const arr = [2, 3, 5, 6, 8, 9]
  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('screencount', () => {
        setFrame(ggb?.getValue('screencount') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('isEnd', () => {
        setDragEnd(ggb?.getValue('isEnd') || 0)
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('screencount')
        ggbApi.current?.unregisterObjectUpdateListener('isEnd')
      }
    }
  }, [ggbLoaded])

  function nextHandle() {
    playMouseClick()
    switch (frame) {
      case 3:
        setActiveButton(2)
        setIsActive(false)
        setNudgeOn(true)
        break
      case 6:
        setActiveButton(3)
        setIsActive(false)
        setNudgeOn(true)
        break
      case 9:
        setActiveButton(0)
        setIsActive(false)
        setNudgeOn(true)
        break
    }
    ggb?.evalCommand('RunClickScript(NextS' + frame + ')')
  }
  function resetHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(Reset)')
    setActiveButton(1)
    setIsActive(false)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g07-gmc05-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Unravel the circle to determine the circumference-to-diameter ratio."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="dyyfqdgv" onApiReady={onGGBLoaded} width={868} height={422} />
      {ggbLoaded && (
        <ButtonHolder>
          <IMG
            active={activeButton == 1 && !isActive}
            disabled={activeButton != 1}
            draggable={false}
            src={activeButton == 1 && isActive ? oneActive : one}
            onClick={() => {
              if (activeButton != 1) return
              setIsActive(true)
              playMouseClick()
              ggb?.evalCommand('RunClickScript(B1ActiveNS)')
            }}
          />
          <IMG
            active={activeButton == 2 && !isActive}
            disabled={activeButton != 2}
            draggable={false}
            src={activeButton == 2 && isActive ? twoActive : two}
            onClick={() => {
              if (activeButton != 2) return
              setIsActive(true)
              playMouseClick()
              ggb?.evalCommand('RunClickScript(B2ActiveNS)')
            }}
          />
          <IMG
            active={activeButton == 3 && !isActive}
            disabled={activeButton != 3}
            draggable={false}
            src={activeButton == 3 && isActive ? threeActive : three}
            onClick={() => {
              if (activeButton != 3) return
              setIsActive(true)
              playMouseClick()
              ggb?.evalCommand('RunClickScript(B3ActiveNS)')
            }}
          />
        </ButtonHolder>
      )}
      {frame % 3 == 2 && dragEnd == 0 && (
        <Feedback>Move the slider to unravel the circle.</Feedback>
      )}
      {frame % 3 == 2 && dragEnd == 1 && (
        <Feedback>
          Observe that with a diameter of {Math.floor(frame / 3) + 1} unit, <br />
          the circumference comes out to be {3.14 * (Math.floor(frame / 3) + 1)} units.
        </Feedback>
      )}
      {frame % 3 == 0 && (
        <Feedback>
          The circumference-to-diameter ratio comes out to be <Brown> 3.14 </Brown> .
        </Feedback>
      )}
      {frame == 10 && (
        <Feedback>
          Observe that for any circle, the ratio of the circumference to
          <br />
          the diameter remains constant, which is approximately <Brown> 3.14 </Brown> .
        </Feedback>
      )}
      {arr.includes(frame) && dragEnd == 1 && (
        <CTAButton active draggable={false} src={next} onClick={nextHandle} />
      )}
      {frame == 10 && <CTAButton active draggable={false} src={reset} onClick={resetHandle} />}
      {ggbLoaded && (frame == 1 || frame == 4 || frame == 7) && (
        <NudgePlayer
          src={click}
          left={frame == 1 ? 112 : frame == 4 ? 285 : 458}
          top={610}
          autoplay
          loop
        />
      )}
      {nudgeOn && (frame == 2 || frame == 5 || frame == 8) && (
        <NudgePlayer
          src={moveRight}
          left={-100}
          top={frame == 2 ? 215 : frame == 5 ? 185 : 150}
          autoplay
          loop
        />
      )}
    </AppletContainer>
  )
}
