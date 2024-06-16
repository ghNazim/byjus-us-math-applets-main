import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { DnDOnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import reset from './Assets/reset.svg'
import text from './Assets/text.svg'

const GeoGebraContainer = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 700px;
  height: 650px;
  bottom: 400px;
  left: 15px;
  top: 90px;
`

const TextContainer = styled.img<{ top?: number; left?: number }>`
  position: absolute;
  left: ${(props) => props.left ?? 180}px;
  top: ${(props) => props.top ?? 650}px;
  cursor: pointer;
  z-index: 1;
`

const TextIncorrect = styled.label`
  position: absolute;
  width: 500px;
  height: 24px;
  left: 120px;
  top: 620px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #444444;
  z-index: 1;
`

const TextCorrect = styled.label`
  position: absolute;
  width: 500px;
  height: 24px;
  left: 140px;
  top: 620px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #444444;
  z-index: 1;
`
const FinalText = styled.label`
  position: absolute;
  width: 500px;
  height: 24px;
  left: 140px;
  top: 620px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #444444;
  z-index: 1;
`

const dragOpts = [
  { name: 'J', initialPos: { top: 630, left: 30 }, finalPos: { top: 300, left: 150 } },
  { name: 'K', initialPos: { top: 630, left: 150 }, finalPos: { top: 300, left: 150 } },
  { name: 'N', initialPos: { top: 630, left: 260 }, finalPos: { top: 300, left: 150 } },
  { name: 'L', initialPos: { top: 630, left: 375 }, finalPos: { top: 300, left: 150 } },
  { name: 'M', initialPos: { top: 630, left: 500 }, finalPos: { top: 300, left: 150 } },
  { name: 'S', initialPos: { top: 490, left: 40 }, finalPos: { top: 110, left: 230 } },
]

const getDragging = (target: string) => dragOpts.findIndex(({ name }) => name === target)

export const AppletG06EEC08S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [GGBReload, setGGBReload] = useState(0)
  const [GGBLoaded, setGGBLoaded] = useState(false)
  const DragSound = useSFX('mouseIn')
  const DropSound = useSFX('mouseOut')
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [showText, setShowText] = useState(false)

  const [showIncorrectText, setShowIncorrectText] = useState(false)
  const [showCorrectText, setShowCorrectText] = useState(false)
  const [finalText, setfinalText] = useState(false)
  const onInteraction = useContext(AnalyticsContext)

  const [dragIndex, setDragIndex] = useState(-1)
  const [dragCompletedIndex, setDragCompletedIndex] = useState(-1)
  const isDragging = dragIndex > -1

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api != null)
  }, [])

  useEffect(() => {
    const api = ggbApi.current
    if (!GGBLoaded || api == null) return

    api.registerClientListener((e: any) => {
      if (e.type === 'mouseDown') {
        const index = getDragging(e.hits[0])
        if (index > -1) {
          setDragIndex(index)
        }
      }

      if (e.type === 'dragEnd') {
        setDragIndex(-1)

        const IsSnapped = ggbApi.current?.getValue('a')
        const IsSnapped1 = ggbApi.current?.getValue('b')
        const IsSnapped2 = ggbApi.current?.getValue('i')
        const IsSnapped3 = ggbApi.current?.getValue('j')
        const IsSnapped4 = ggbApi.current?.getValue('l')

        if (e[1] === 'J') {
          if (IsSnapped) {
            setShowCorrectText(true)
            setShowIncorrectText(false)
          } else {
            // ggbApi.current?.setCoords('J', 0, -3)
            setShowIncorrectText(true)
            setShowCorrectText(false)
          }
        }
        if (e[1] === 'K') {
          if (!IsSnapped1) {
            // ggbApi.current?.setCoords('K', 3, -3)
            setShowIncorrectText(true)
            setShowCorrectText(false)
          } else {
            setShowCorrectText(true)
            setShowIncorrectText(false)
          }
        }
        if (e[1] === 'N') {
          if (!IsSnapped2) {
            ggbApi.current?.setCoords('N', 6, -3)
            setShowIncorrectText(true)
            setShowCorrectText(false)
          } else {
            setShowCorrectText(true)
            setShowIncorrectText(false)
          }
        }
        if (e[1] === 'L') {
          if (!IsSnapped3) {
            ggbApi.current?.setCoords('L', 9, -3)
            setShowIncorrectText(true)
            setShowCorrectText(false)
          } else {
            setShowCorrectText(true)
            setShowIncorrectText(false)
          }
        }
        if (e[1] === 'M') {
          if (!IsSnapped4) {
            ggbApi.current?.setCoords('M', 12, -3)
            setShowIncorrectText(true)
            setfinalText(false)
            setShowCorrectText(false)
          } else {
            setfinalText(true)
            setShowIncorrectText(false)
            setShowCorrectText(false)
          }
        }
      }

      if (e.type == 'dragEnd' && ggbApi.current && ggbApi.current?.getValue('boolcomplete')) {
        setShowText(true)
        setfinalText(false)
      }
    })
  }, [GGBLoaded])

  useEffect(() => {
    if (isDragging) {
      DragSound()
      onInteraction('drag')
    } else {
      DropSound()
      onInteraction('drop')
    }
  }, [isDragging])

  useEffect(() => {
    if (dragIndex > -1) setDragCompletedIndex(dragIndex)
  }, [dragIndex])

  // ggbApi.current.registerClientListener((e) => {
  //   if (
  //     (e.type == 'mouseDown' &&
  //       (e['hits'][0] == 'C' ||
  //         e['hits'][0] == 'D' ||
  //         e['hits'][0] == 'E' ||
  //         e['hits'][0] == 'F' ||
  //         e['hits'][0] == 'G' ||
  //         e['hits'][0] == 'T')) ||
  //     (e.type == 'dragEnd' &&
  //       (e.target == 'C' ||
  //         e.target == 'D' ||
  //         e.target == 'E' ||
  //         e.target == 'F' ||
  //         e.target == 'G' ||
  //         e.target == 'T'))
  //   ) {
  //     if (e[0] == 'mouseDown') {
  //       onInteraction('drag')
  //       DragSound()
  //     }
  //     if (e[0] == 'dragEnd') {
  //       onInteraction('drop')
  //       DropSound()
  //     }
  //   }

  //   if (e[1] == 'C' && e[0] == 'dragEnd' && ggbApi.current?.getValue('p1')) {
  //     setShowDndAnim(false)
  //     setShowDndAnim1(true)
  //   }
  //   if (e[1] == 'D' && e[0] == 'dragEnd' && ggbApi.current?.getValue('p2')) {
  //     ggbApi.current.setValue('visibility', 3)
  //   }
  //   if (e[1] == 'E' && e[0] == 'dragEnd' && ggbApi.current?.getValue('p3')) {
  //     ggbApi.current.setValue('visibility', 4)
  //   }
  //   if (e[1] == 'F' && e[0] == 'dragEnd' && ggbApi.current?.getValue('p4')) {
  //     ggbApi.current.setValue('visibility', 5)
  //   }
  //   if (e[1] == 'G' && e[0] == 'dragEnd' && ggbApi.current?.getValue('p5')) {
  //     ggbApi.current.setValue('visibility', 5)
  //     // setShowOnBoarding(true)
  //   }

  //   if (
  //     e[1] == 'T' &&
  //     e[0] == 'dragEnd' &&
  //     ggbApi.current &&
  //     ggbApi.current?.getValue('segcompletion')
  //   ) {
  //     setShowText(true)
  //   }
  // })

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: 'G06-EEC08-S1-GB02',
        onEvent,
        className,
      }}
    >
      <OnboardingController>
        <TextHeader
          text="Plot ordered pairs and connect them to visualize the relationship between apple quantity and total cost."
          backgroundColor="#FAF2FF"
          buttonColor="#EACCFF"
        />
        {showText && <TextContainer src={text} />}
        {showIncorrectText && (
          <TextIncorrect>The plotted point was inaccurate, please attempt again.</TextIncorrect>
        )}

        {showCorrectText && (
          <TextCorrect>The plotted point was accurate, try the next one.</TextCorrect>
        )}

        {finalText && <FinalText>Join the points to form a line</FinalText>}
        {showText && (
          <TextContainer
            src={reset}
            left={280}
            top={700}
            onClick={() => {
              setGGBReload((g) => g + 1)
              setShowText(false)
              setGGBLoaded(false)
              setDragCompletedIndex(dragIndex)
            }}
          />
        )}

        <GeoGebraContainer
          materialId={'hvrmrsg6'}
          key={GGBReload}
          onApiReady={onGGBLoaded}
          width={700}
          height={650}
        />

        {dragOpts.map(({ initialPos, finalPos }, i) => (
          <OnboardingStep index={i} key={i}>
            <DnDOnboardingAnimation
              initialPosition={initialPos}
              finalPosition={finalPos}
              complete={dragCompletedIndex >= i}
            />
          </OnboardingStep>
        ))}
      </OnboardingController>
    </AppletContainer>
  )
}
