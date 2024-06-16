import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveHorizontally } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { locatePoint2d } from '@/common/Geogebra/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import nextActive from './assets/nextButton.svg'
import nextInactive from './assets/nextInactive.svg'
import tryagain from './assets/tryagain.svg'
import { Dropdown } from './dropdownComponent/Dropdown'

const GGBcontainer = styled(Geogebra)`
  top: 50px;
  position: absolute;
  left: 50%;
  translate: -50%;
  scale: 0.9;
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
  z-index: 3;
`
const Feedback = styled.div`
  position: absolute;
  top: 620px;
  translate: 0 -50%;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
  translate: 0 -50%;
`
const Blue = styled.span`
  height: 25px;
  display: inline-block;
  padding-left: 6px;
  padding-right: 7px;
  background-color: #e7fbff;
  color: #1cb9d9;
  border-radius: 5px;
`
const Orange = styled(Blue)`
  background-color: #fff2e5;
  color: #ff8f1f;
`
const BulletPoint = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  padding-left: ${(p) => p.left}px;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
  translate: 0 -50%;
`
const DDcontainer = styled.div<{ top: number; right: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  right: ${(p) => p.right}px;
`
const Tooltip = styled.div<{ top: number; right: number }>`
  max-width: 210px;
  position: absolute;
  top: ${(p) => p.top}px;
  right: ${(p) => p.right}px;
  padding: 8px;
  align-items: center;
  border-radius: 8px;
  border: 0.5px solid #1a1a1a;
  background: #fff;
  z-index: 2;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  ::after {
    content: ' ';
    position: absolute;
    left: 90%;
    top: 94%;
    border-bottom: 0.5px solid #1a1a1a;
    border-right: 0.5px solid #1a1a1a;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
    background: #ffffff;
    width: 8px;
    height: 8px;
  }
  ::before {
    content: '!';
    position: absolute;
    left: -12px;
    top: -12px;
    width: 24px;
    height: 24px;
    border-radius: 25px;
    background-color: white;
    border: #1a1a1a solid 1px;
    font-weight: 700;
  }
`
const Patch = styled.div`
  position: absolute;
  top: 550px;
  height: 150px;
  width: 98%;
  left: 50%;
  translate: -50%;
  background-color: #fff;
  opacity: 0.5;
`
export const AppletG06SPC03S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
    ggbApi.current?.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'Out') {
        playMouseIn()
        setNudgeOn(false)
      } else if (e.type === 'dragEnd' && e.target === 'Out') {
        playMouseOut()
        setNudgeOn(true)
      }
    })
  }, [])
  const ggb = ggbApi.current
  const [button, setButton] = useState(0)
  const [frame, setFrame] = useState(-1)
  const [index1, setIndex1] = useState(-1)
  const [index2, setIndex2] = useState(-1)
  const [showpopup1, setShowpopup1] = useState(false)
  const [showpopup2, setShowpopup2] = useState(false)
  const [notinlimit, setNotinlimit] = useState(0)
  const [correctness, setCorrectness] = useState(0)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [nudgeOn, setNudgeOn] = useState(true)
  const [nudgeLocation, setNudgeLocation] = useState({ leftPixel: 0, topPixel: 0 })
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playCorrect = useSFX('correct')
  const playincorrect = useSFX('incorrect')

  const status1 = index1 === 0 ? 'correct' : index1 === 1 ? 'incorrect' : 'default'
  const status2 =
    (frame == 1 && index2 === 0) || (frame == 3 && index2 == 1)
      ? 'correct'
      : (frame == 1 && index2 === 1) || (frame == 3 && index2 == 0)
      ? 'incorrect'
      : 'default'
  const word2 = frame == 1 ? 'data-point' : 'outlier'
  const clickDotsGGB1 = (e: any) => {
    if (
      e.type == 'mouseDown' &&
      (e.hits[0] == 'dot1' ||
        e.hits[0] == 'dot2' ||
        e.hits[0] == 'dot3' ||
        e.hits[0] == 'dot4' ||
        e.hits[0] == 'dot5')
    ) {
      playMouseClick()
      setNudgeOn(false)
    }
  }
  const clickDotsGGB2 = (e: any) => {
    if (
      e.type == 'mouseDown' &&
      (e.hits[0] == 'dot2' || e.hits[0] == 'dot3' || e.hits[0] == 'dot4' || e.hits[0] == 'dot5')
    ) {
      playincorrect()
      setCorrectness(1)
    } else if (e.type == 'mouseDown' && e.hits[0] == 'dot6') {
      playCorrect()
      setCorrectness(2)
    }
  }

  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('frame', () => {
        setFrame(ggb?.getValue('frame') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('but', () => {
        setButton(ggb?.getValue('but') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('Out', () => {
        setNotinlimit(ggb?.getValue('notinlimit||notinlimit2') || 0)
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('button')
        ggbApi.current?.unregisterObjectUpdateListener('frame')
        ggbApi.current?.unregisterObjectUpdateListener('Out')
      }
    }
  }, [ggbLoaded])
  useEffect(() => {
    if (ggbLoaded) {
      if (frame == -1) {
        ggbApi.current?.registerClientListener(clickDotsGGB1)
        return () => ggbApi.current?.unregisterClientListener(clickDotsGGB1)
      } else if (frame == 2) {
        ggbApi.current?.registerClientListener(clickDotsGGB2)
        return () => ggbApi.current?.unregisterClientListener(clickDotsGGB2)
      }
    }
  }, [frame, ggbLoaded])
  function nextHandle() {
    playMouseClick()

    if (frame == -1) {
      setNudgeOn(true)
      if (ggb) setNudgeLocation(locatePoint2d('Out', ggb))
    } else if (frame == 2) {
      setIndex1(-1)
      setIndex2(-1)
    }
    ggb?.evalCommand('RunClickScript(next)')
  }
  function tryagainHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(tryagain)')
    setIndex1(-1)
    setIndex2(-1)
    setCorrectness(0)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g06-spc03-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Effect of changing a data-point on the mean and median."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="u2uaz3fq" onApiReady={onGGBLoaded} width={795} height={527} />
      {(frame == 1 || frame == 3) && (
        <>
          <DDcontainer top={560} right={frame == 1 ? 10 : 30}>
            <Dropdown
              dropDownArray={['changes', 'stays constant']}
              position="top"
              listOrientation="vertical"
              onValueChange={(value) => {
                setIndex1(value)
                ggb?.setValue('first', value + 1)
                setShowpopup1(value == 1)
                if (value == 0) playCorrect()
                else playincorrect()
              }}
              onClickFunc={() => {
                setShowpopup1(false)
                setNudgeOn(false)
              }}
              checkStatus={status1}
            />
          </DDcontainer>
          <DDcontainer top={640} right={frame == 1 ? 10 : 30}>
            <Dropdown
              dropDownArray={['changes', 'stays constant']}
              position="top"
              listOrientation="vertical"
              onValueChange={(value) => {
                setIndex2(value)
                ggb?.setValue('second', value + 1)
                setShowpopup2((frame == 1 && value == 1) || (frame == 3 && value == 0))
                if ((frame == 1 && value === 0) || (frame == 3 && value == 1)) playCorrect()
                else playincorrect()
              }}
              onClickFunc={() => {
                setShowpopup2(false)
                setNudgeOn(false)
              }}
              checkStatus={status2}
            />
          </DDcontainer>
        </>
      )}
      {frame == 1 && (
        <>
          <BulletPoint top={593} left={10}>
            On changing the data-point, the <Orange> mean </Orange>
          </BulletPoint>
          <BulletPoint top={673} left={10}>
            On changing the middle value in data-set, <Blue> median </Blue>
          </BulletPoint>
        </>
      )}
      {frame == 3 && (
        <>
          <BulletPoint top={593} left={40}>
            On changing the outlier value, the <Orange> mean </Orange>
          </BulletPoint>
          <BulletPoint top={673} left={40}>
            On changing the outlier value, the <Blue> median </Blue>
          </BulletPoint>
        </>
      )}
      {(frame == 1 || frame == 3) && notinlimit==1 && <Patch></Patch>}
      {showpopup1 && (
        <Tooltip top={485} right={frame == 1 ? 10 : 40}>
          {' '}
          Observe the mean on changing the {word2}
        </Tooltip>
      )}
      {showpopup2 && (
        <Tooltip top={565} right={frame == 1 ? 10 : 40}>
          {' '}
          Observe the median on changing the {word2}
        </Tooltip>
      )}
      {ggbLoaded && button == 0 && <CTAButton draggable={false} src={nextInactive} />}
      {button == 1 && <CTAButton active draggable={false} src={nextActive} onClick={nextHandle} />}
      {button == 2 && (
        <CTAButton active draggable={false} src={tryagain} onClick={tryagainHandle} />
      )}
      {ggbLoaded && frame == -1 && <Feedback>Select a data point to change its value.</Feedback>}
      {frame == 0 && (
        <Feedback>
          Observe change in mean and median by changing the data-point, and answer the following
          questions.
        </Feedback>
      )}
      {frame == 2 && correctness == 0 && (
        <Feedback>Identify the outlier in the given data set.</Feedback>
      )}
      {frame == 2 && correctness == 1 && <Feedback>Oops! Try again.</Feedback>}
      {frame == 2 && correctness == 2 && (
        <Feedback>Awesome! You have correctly identified the outlier.</Feedback>
      )}
      {frame == 4 && (
        <Feedback>
          Awesome! You have learned how changing a data-point affects
          <br />
          the mean and median of a data set.
        </Feedback>
      )}
      {ggbLoaded && nudgeOn && (frame == -1 || frame == 1) && (
        <NudgePlayer
          left={frame == -1 ? 53 : 540}
          top={frame == -1 ? 295 : 540}
          src={click}
          autoplay
          loop
        />
      )}
      {nudgeOn && frame == 0 && (
        <NudgePlayer
          left={nudgeLocation.leftPixel - 215}
          top={nudgeLocation.topPixel - 10}
          src={moveHorizontally}
          autoplay
          loop
        />
      )}
    </AppletContainer>
  )
}
