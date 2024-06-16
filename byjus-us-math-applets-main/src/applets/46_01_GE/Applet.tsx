import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import dragAndDropEnd from './../../common/handAnimations/dragAndDropEnd.json'
import dragAndDropHold from './../../common/handAnimations/dragAndDropHold.json'
import dragAndDropStart from './../../common/handAnimations/dragAndDropStart.json'
import MoveallDirection from './../../common/handAnimations/moveAllDirections.json'
import MoveHorizontally from './../../common/handAnimations/moveHorizontally.json'
import MoveVertically from './../../common/handAnimations/moveVertically.json'
import reset from './Assets/reset.svg'
import text from './Assets/text.svg'
import { CustomDNDanimation } from './CustomDNDanimation'

const GGBcontainer = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 650px;
  height: 780px;
  bottom: 255px;
  left: 0px;
  top: 80px;
`
const TextContainer = styled.img<{ top?: number; left?: number }>`
  position: absolute;
  left: ${(props) => props.left ?? 90}px;
  top: ${(props) => props.top ?? 690}px;
`

const LottieContainer = styled(Player)<{ top?: number; left?: number }>`
  position: absolute;
  left: ${(props) => props.left ?? 90}px;
  top: ${(props) => props.top ?? 690}px;
  pointer-events: none;
`
type size = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export const Applet4601Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [showText, setShowText] = useState(false)
  const [ggbReload, setGgbReload] = useState(0)
  const [pointToTrack, setPointToTrack] = useState('E')
  const [showHand, setShowHand] = useState(true)
  const [lawn, setLawn] = useState(0)
  const onInteraction = useContext(AnalyticsContext)
  const [animation, setAnimation] = useState<size>(7)
  const DragSound = useSFX('mouseIn')
  const DropSound = useSFX('mouseOut')
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  // useInterval(
  //   () => {
  //     if (!ggbApi.current) return
  //     ggbApi.current.setPointSize("A'", animation)
  //     setAnimation((a) => {
  //       if (a < 9 && a >= 5) return (a + 1) as size
  //       if (a == 9) return 5 as size
  //       return a
  //     })
  //   },
  //   animation !== 1 ? 150 : null,
  // )
  useInterval(
    () => {
      setLawn((l) => l + 0.1)
      ggbApi.current?.setFilling('pic1', lawn)
    },
    lawn >= 0.1 && lawn < 1 ? 150 : null,
  )

  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (!ggbApi.current) return
      setGgbLoaded(true)
      ggbApi.current.setValue('fil', 1)
      ggbApi.current.setFixed('E', false, true)
      ggbApi.current.registerClientListener((e: any) => {
        setShowHand(false)
        if (
          (e[0] == 'mouseDown' &&
            (e['hits'][0] == 'E' ||
              e['hits'][0] == 'F' ||
              e['hits'][0] == 'G' ||
              e['hits'][0] == 'H' ||
              e['hits'][0] == 'ab' ||
              e['hits'][0] == 'bc' ||
              e['hits'][0] == 'cd' ||
              e['hits'][0] == 'da')) ||
          (e[0] == 'dragEnd' &&
            (e[1] == 'E' ||
              e[1] == 'F' ||
              e[1] == 'G' ||
              e[1] == 'H' ||
              e[1] == 'ab' ||
              e[1] == 'bc' ||
              e[1] == 'cd' ||
              e[1] == 'da'))
        ) {
          if (e[0] == 'mouseDown') {
            onInteraction('drag')
            DragSound()
          }
          if (e[0] == 'dragEnd') {
            onInteraction('drop')
            DropSound()
          }
        }
        if (e[1] == 'E' && e[0] == 'dragEnd' && ggbApi.current?.getValue('a')) {
          ggbApi.current.setFixed('E', true, false)
          ggbApi.current.setValue('fil', 2)
          ggbApi.current.setFixed('F', false, true)
          setAnimation(1)
          setShowHand(true)
          setPointToTrack('F')
        }
        if (e[1] == 'F' && e[0] == 'dragEnd' && ggbApi.current?.getValue('b')) {
          ggbApi.current.setFixed('F', true, false)
          ggbApi.current.setValue('fil', 3)
          ggbApi.current.setFixed('G', false, true)
          setShowHand(true)
          setPointToTrack('G')
        }
        if (e[1] == 'G' && e[0] == 'dragEnd' && ggbApi.current?.getValue('i')) {
          ggbApi.current.setFixed('G', true, false)
          ggbApi.current.setValue('fil', 4)
          ggbApi.current.setFixed('H', false, true)
          setShowHand(true)
          setPointToTrack('H')
        }
        if (e[1] == 'H' && e[0] == 'dragEnd' && ggbApi.current?.getValue('j')) {
          ggbApi.current.setFixed('H', true, false)
          setTimeout(() => {
            ggbApi.current?.setValue('o', 1)
            ggbApi.current?.setFixed('ab', false, true)
            setShowHand(true)
            setPointToTrack('ab')
          }, 1000)
        }
        if (
          e[1] == 'da' &&
          e[0] == 'dragEnd' &&
          ggbApi.current &&
          ggbApi.current?.getValue('da ≟ A')
        ) {
          ggbApi.current.setFixed('ab', true, false)
          ggbApi.current.setFixed('bc', true, false)
          ggbApi.current.setFixed('cd', true, false)
          ggbApi.current.setFixed('da', true, false)
          ggbApi.current.setValue('dash', 2)
          ggbApi.current.setFilling('pic1', 0)
          setLawn(0.1)
          setShowText(true)
        }
        if (e[1] == 'ab' && e[0] == 'dragEnd' && ggbApi.current?.getValue(' ab ≟ B')) {
          setTimeout(() => {
            setShowHand(true)
            setPointToTrack('bc')
          }, 500)
          ggbApi.current?.setFixed('bc', false, true)
          ggbApi.current?.setFixed('ab', true, false)
        }
        if (e[1] == 'bc' && e[0] == 'dragEnd' && ggbApi.current?.getValue('bc ≟ C')) {
          setTimeout(() => {
            setShowHand(true)
            setPointToTrack('cd')
          }, 500)
          ggbApi.current?.setFixed('cd', false, true)
          ggbApi.current?.setFixed('bc', true, false)
        }
        if (e[1] == 'cd' && e[0] == 'dragEnd' && ggbApi.current?.getValue('cd ≟ D')) {
          setTimeout(() => {
            setShowHand(true)
            setPointToTrack('da')
          }, 500)
          ggbApi.current?.setFixed('da', false, true)
          ggbApi.current?.setFixed('cd', true, false)
        }
      })
    },
    [DragSound, DropSound, onInteraction],
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: '46_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Connect the given adjacent points to draw a polygon shaped lawn."
        backgroundColor="#F1EDFF"
        buttonColor="#D9CDFF"
      />
      <GGBcontainer
        materialId={'qv6zqvap'}
        key={ggbReload}
        onApiReady={onGGBLoaded}
        width={650}
        height={710}
        pointToTrack={pointToTrack}
        showOnBoarding={
          ggbLoaded &&
          showHand &&
          (pointToTrack === 'E' ||
            pointToTrack === 'F' ||
            pointToTrack === 'G' ||
            pointToTrack === 'H')
        }
        onboardingAnimationSrc={MoveallDirection}
      />
      {/* {pointToTrack === 'E' && showHand && ggbLoaded && (
        <CustomDNDanimation
          startPostion={{ left: 55, top: 685 }}
          endPostion={{ left: 100, top: 200 }}
          animationSource={[dragAndDropStart, dragAndDropHold, dragAndDropEnd]}
        />
      )}
      {pointToTrack === 'F' && showHand && (
        <CustomDNDanimation
          startPostion={{ left: 200, top: 685 }}
          endPostion={{ left: 100, top: 500 }}
          animationSource={[dragAndDropStart, dragAndDropHold, dragAndDropEnd]}
        />
      )}
      {pointToTrack === 'G' && showHand && (
        <CustomDNDanimation
          startPostion={{ left: 200, top: 685 }}
          endPostion={{ left: 100, top: 500 }}
          animationSource={[dragAndDropStart, dragAndDropHold, dragAndDropEnd]}
        />
      )} */}
      {showText && <TextContainer src={text} />}
      {pointToTrack === 'ab' && showHand && (
        <LottieContainer src={MoveVertically} left={120} top={80} loop autoplay />
      )}
      {pointToTrack === 'bc' && showHand && (
        <LottieContainer src={MoveHorizontally} left={-30} top={530} loop autoplay />
      )}
      {pointToTrack === 'cd' && showHand && (
        <LottieContainer src={MoveVertically} left={470} top={380} loop autoplay />
      )}
      {pointToTrack === 'da' && showHand && (
        <LottieContainer src={MoveHorizontally} left={320} top={220} loop autoplay />
      )}
      {showText && (
        <TextContainer
          src={reset}
          left={300}
          top={740}
          onClick={() => {
            setGgbReload((g) => g + 1)
            setShowText(false)
            setGgbLoaded(false)
            setShowHand(true)
            setPointToTrack('E')
          }}
        />
      )}
    </AppletContainer>
  )
}
