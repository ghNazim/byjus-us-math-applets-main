import 'katex/dist/katex.min.css'

import { Player } from '@lottiefiles/react-lottie-player'
import { all, create } from 'mathjs'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { BlockMath } from 'react-katex'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { isString } from '@/utils/types'

import checkbutton from '../../applets/G08EEC08S1GB05/assets/check.svg'
import nextbuttonimage from '../../applets/G08EEC08S1GB05/assets/next.svg'
import quesone from '../../applets/G08EEC08S1GB05/assets/q1.svg'
import questwo from '../../applets/G08EEC08S1GB05/assets/q2.svg'
import questhree from '../../applets/G08EEC08S1GB05/assets/q3.svg'
import quesfour from '../../applets/G08EEC08S1GB05/assets/q4.svg'
import resetbuttonimg from '../../applets/G08EEC08S1GB05/assets/Retry.svg'
import rightquesone from '../../applets/G08EEC08S1GB05/assets/rightq1.svg'
import rightquetwo from '../../applets/G08EEC08S1GB05/assets/rightq2.svg'
import rightquesthree from '../../applets/G08EEC08S1GB05/assets/rightq3.svg'
import rightquefour from '../../applets/G08EEC08S1GB05/assets/rightq4.svg'
import wrongquesone from '../../applets/G08EEC08S1GB05/assets/wrongq1.svg'
import wrongquestwo from '../../applets/G08EEC08S1GB05/assets/wrongq2.svg'
import wrongquesthree from '../../applets/G08EEC08S1GB05/assets/wrongq3.svg'
import wrongquesfour from '../../applets/G08EEC08S1GB05/assets/wrongq4.svg'
import dragalldirection from '../../common/handAnimations/moveAllDirections.json'
const math = create(all)

const GeogebraContainer = styled(Geogebra)`
  width: 100%;
  height: 750px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
`

const CheckButton = styled.div`
  position: absolute;
  cursor: pointer;
  top: 720px;
`
const NextButton = styled.div`
  position: absolute;
  cursor: pointer;
  top: 720px;
`
const ConstantText = styled.img`
  position: absolute;
  left: 130px;
  top: 600px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 1;
  user-select: none;
  pointer-events: none;
`
const GeogebraText = styled.div`
  position: absolute;
  left: 340px;
  top: 680px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 2;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
export const AppletG08EEC08S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [showCheckButton, setShowCheckButton] = useState(false)
  const [xCoordA, setXCoordA] = useState<number | null>(null)
  const [yCoordA, setYCoordA] = useState<number | null>(null)
  const [xCoordB, setXCoordB] = useState<number | null>(null)
  const [yCoordB, setYCoordB] = useState<number | null>(null)

  const [hHit, setHHit] = useState(false)
  const [posA, setPosA] = useState({ leftPixel: 0, topPixel: 0 })
  const [posB, setPosB] = useState({ leftPixel: 0, topPixel: 0 })
  const [coordinatesActive, setCoordinatesActive] = useState(false)
  const [nextbutton, setShowNextButton] = useState(false)
  const [resetbutton, setShowResetButton] = useState(false)
  const [question1text, setShowQuestion1Text] = useState(true)
  const [wrongques1text, setShowWrongQues1text] = useState(false)
  const [rightques1text, setShowRightQues1text] = useState(false)
  const [question2text, setShowQuestion2Text] = useState(false)
  const [wrongques2text, setShowWrongQues2text] = useState(false)
  const [rightques2text, setShowRightQues2text] = useState(false)
  const [question3text, setShowQuestion3Text] = useState(false)
  const [wrongques3text, setShowWrongQues3text] = useState(false)
  const [rightques3text, setShowRightQues3text] = useState(false)
  const [question4text, setShowQuestion4Text] = useState(false)
  const [wrongques4text, setShowWrongQues4text] = useState(false)
  const [rightques4text, setShowRightQues4text] = useState(false)
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const playMouseCLick = useSFX('mouseClick')
  // const [finalTextNumerator, setFinalTextNumerator] = useState<number | null>(null)
  // const [finalTextDenominator, setFinalTextDenominator] = useState<number | null>(null)

  const [simplifiedSlopeNumerator, setSimplifiedSlopeNumerator] = useState<string | null>(null)
  const [simplifiedSlopeDenominator, setSimplifiedSlopeDenominator] = useState<string | null>(null)

  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGgbLoaded(true)

      let questionValue = 1

      ggbApi.current?.registerObjectUpdateListener('Question', () => {
        questionValue = ggbApi.current?.getValue('Question') ?? 1
      })

      if (api != null) {
        if (!ggbApi.current) return
        setPosA(locatePoint2d('A', ggbApi.current))
        setPosB(locatePoint2d('B', ggbApi.current))
        api.registerObjectUpdateListener('A', () => {
          if (!ggbApi.current) return
          setPosA(locatePoint2d('A', ggbApi.current))
        })
        api.registerObjectUpdateListener('B', () => {
          if (!ggbApi.current) return
          setPosB(locatePoint2d('B', ggbApi.current))
        })

        // api.registerObjectUpdateListener('a1', () => {
        //   if (!ggbApi.current) return
        //   setFinalTextNumerator(ggbApi.current?.evalCommand('Numerator(w'))
        // })

        // api.registerObjectUpdateListener('b1', () => {
        //   if (!ggbApi.current) return
        //   setFinalTextDenominator(ggbApi.current?.getValue('b1'))
        // })

        api.registerClientListener((e: any) => {
          if (
            e.type === 'mouseDown' &&
            (e.hits[0] === 'h' ||
              e.hits[0] === 'k' ||
              e.hits[0] === 'A' ||
              e.hits[0] === 'B' ||
              e.hits[0] === 'pointer2' ||
              e.hits[0] === 'pointer1')
          ) {
            playMouseIn()
            setShowCheckButton(true)
            setCoordinatesActive(false)
            if (
              questionValue === 1 &&
              (e.hits[0] === 'h' ||
                e.hits[0] === 'k' ||
                e.hits[0] === 'A' ||
                e.hits[0] === 'B' ||
                e.hits[0] === 'pointer2' ||
                e.hits[0] === 'pointer1')
            ) {
              setShowQuestion1Text(true)
              setShowOnboarding1(false)

              setShowWrongQues1text(false)
            }
            if (
              questionValue === 2 &&
              (e.hits[0] === 'h' ||
                e.hits[0] === 'k' ||
                e.hits[0] === 'A' ||
                e.hits[0] === 'B' ||
                e.hits[0] === 'pointer2' ||
                e.hits[0] === 'pointer1')
            ) {
              setShowQuestion2Text(true)
              setShowWrongQues2text(false)
            }
            if (
              questionValue === 3 &&
              (e.hits[0] === 'h' ||
                e.hits[0] === 'k' ||
                e.hits[0] === 'A' ||
                e.hits[0] === 'B' ||
                e.hits[0] === 'pointer2' ||
                e.hits[0] === 'pointer1')
            ) {
              setShowQuestion3Text(true)
              setShowWrongQues3text(false)
            }
            if (
              questionValue === 4 &&
              (e.hits[0] === 'h' ||
                e.hits[0] === 'k' ||
                e.hits[0] === 'A' ||
                e.hits[0] === 'B' ||
                e.hits[0] === 'pointer2' ||
                e.hits[0] === 'pointer1')
            ) {
              setShowQuestion4Text(true)
              setShowWrongQues4text(false)
            }
          } else if (
            e.type === 'dragEnd' &&
            (e.target === 'h' || e.target === 'k' || e.target === 'A' || e.target === 'B')
          ) {
            playMouseOut()
            setShowCheckButton(true)
            setHHit(false)
          }
        })
      }
    },
    [ggbApi, playMouseCLick, playMouseIn, playMouseOut],
  )
  const onNextClick = () => {
    playMouseCLick()
    if (ggbApi.current?.getValue('Question') === 1) {
      setShowNextButton(false)
      ggbApi.current?.setValue('Question', 2)
      ggbApi.current?.evalCommand('SetValue(A,(-5,-4))')
      ggbApi.current?.evalCommand('SetValue(B,(6,4))')
      ggbApi.current?.setValue('visible', 0)
      setCoordinatesActive(false)
      setShowQuestion1Text(false)
      setShowRightQues1text(false)
      setShowWrongQues1text(false)
      setShowQuestion2Text(true)
    } else if (ggbApi.current?.getValue('Question') === 2) {
      setShowNextButton(false)
      ggbApi.current?.setValue('Question', 3)
      ggbApi.current?.evalCommand('SetValue(A,(-5,-4))')
      ggbApi.current?.evalCommand('SetValue(B,(6,4))')
      ggbApi.current?.setValue('visible', 0)
      setCoordinatesActive(false)
      setShowQuestion2Text(false)
      setShowRightQues2text(false)
      setShowWrongQues2text(false)
      setShowQuestion3Text(true)
    } else if (ggbApi.current?.getValue('Question') === 3) {
      setShowNextButton(false)
      ggbApi.current?.setValue('Question', 4)
      ggbApi.current?.evalCommand('SetValue(A,(-5,-4))')
      ggbApi.current?.evalCommand('SetValue(B,(6,4))')
      ggbApi.current?.setValue('visible', 0)
      setCoordinatesActive(false)
      setShowQuestion3Text(false)
      setShowRightQues3text(false)
      setShowWrongQues3text(false)
      setShowQuestion4Text(true)
    }
  }
  const onRetryClick = () => {
    playMouseCLick()
    ggbApi.current?.evalCommand('RunClickScript(Reset)')
    setShowResetButton(false)
    setCoordinatesActive(false)
    setShowRightQues4text(false)
  }
  const onCheckClick = () => {
    ggbApi.current?.evalCommand('RunClickScript(Check1)')
    const xCoordValueA = ggbApi.current?.getXcoord('A') ?? null
    const yCoordValueA = ggbApi.current?.getYcoord('A') ?? null
    const xCoordValueB = ggbApi.current?.getXcoord('B') ?? null
    const yCoordValueB = ggbApi.current?.getYcoord('B') ?? null
    const slopeValue = ggbApi.current?.getValue('SLOPE')
    const VisibleValue = ggbApi.current?.getValue('visible')
    const questionValue = ggbApi.current?.getValue('Question')

    setXCoordA(xCoordValueA)
    setYCoordA(yCoordValueA)
    setXCoordB(xCoordValueB)
    setYCoordB(yCoordValueB)

    if (
      yCoordValueA !== null &&
      yCoordValueB !== null &&
      xCoordValueA !== null &&
      xCoordValueB !== null
    ) {
      // Calculate slope
      const numerator = yCoordValueB - yCoordValueA
      const denominator = xCoordValueB - xCoordValueA

      // Simplify the slope fraction
      const simplifiedSlopeNumerator = math.simplify(`${numerator}`)
      const simplifiedSlopeDenominator = math.simplify(` ${denominator}`)

      // Update the state with the simplified slope
      setSimplifiedSlopeNumerator(simplifiedSlopeNumerator.toString())
      setSimplifiedSlopeDenominator(simplifiedSlopeDenominator.toString())
    }

    if (questionValue === 1) {
      setShowQuestion1Text(false)
      if (slopeValue !== undefined && slopeValue === 0) {
        setShowNextButton(true)
        setShowRightQues1text(true)
        setShowQuestion1Text(false)
      } else {
        setShowQuestion1Text(false)
        setShowWrongQues1text(true)
      }
    } else if (questionValue === 2) {
      setShowQuestion2Text(false)
      if (slopeValue !== undefined && slopeValue < 0) {
        setShowNextButton(true)
        setShowRightQues2text(true)
        setShowQuestion2Text(false)
      } else {
        setShowQuestion2Text(false)
        setShowWrongQues2text(true)
      }
    } else if (questionValue === 3) {
      setShowQuestion3Text(false)
      if (slopeValue !== undefined && slopeValue > 0) {
        setShowNextButton(true)
        setShowRightQues3text(true)
        setShowQuestion3Text(false)
      } else {
        setShowQuestion3Text(false)
        setShowWrongQues3text(true)
      }
    } else if (questionValue === 4 && VisibleValue === 1) {
      setShowQuestion4Text(false)
      setShowRightQues4text(true)
      setShowResetButton(true)
    } else {
      setShowWrongQues4text(true)
      setShowQuestion4Text(false)
    }
    setCoordinatesActive(true)
    setShowCheckButton(false)
  }

  // setFinalTextNumerator(number)
  // setFinalTextDenominator(number)

  useEffect(() => {}, [ggbLoaded, playMouseCLick, playMouseIn, playMouseOut, ggbApi])

  return (
    <AppletContainer
      aspectRatio={0.9}
      borderColor="#F6F6F6"
      id="g08-eec08-s1-gb05"
      onEvent={onEvent}
      className={className}
    >
      <TextHeader
        text="Test your understanding of various slopes of a line."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
        hideButton={true}
      />
      <GeogebraContainer materialId="sxayh9zw" width={650} height={580} onApiReady={onGGBLoaded} />
      {showCheckButton && !hHit && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CheckButton onClick={onCheckClick}>
            <img src={checkbutton} alt="Check" />
          </CheckButton>
        </div>
      )}
      {!hHit && xCoordA !== null && yCoordA !== null && coordinatesActive && (
        <div
          style={{
            position: 'absolute',
            top: `${posA.topPixel + 30}px`,
            left: `${posA.leftPixel + 10}px`,
            zIndex: '1',
            fontSize: '20px',
            fontFamily: 'Nunito',
            fontWeight: '700',
          }}
        >
          <span style={{ color: '#1A1A1A', fontFamily: 'Nunito', fontSize: '25' }}>(</span>
          <span style={{ color: '#AA5EE0', fontFamily: 'Nunito', fontSize: '25' }}>{xCoordA}</span>
          <span style={{ color: '#FF8F1F', fontFamily: 'Nunito', fontSize: '25' }}>,</span>
          <span style={{ color: '#FF8F1F', fontFamily: 'Nunito', fontSize: '25' }}>{yCoordA}</span>
          <span style={{ color: '#1A1A1A', fontFamily: 'Nunito', fontSize: '25' }}>)</span>
        </div>
      )}
      {!hHit && xCoordB !== null && yCoordB !== null && coordinatesActive && (
        <div
          style={{
            position: 'absolute',
            top: `${posB.topPixel + 30}px`,
            left: `${posB.leftPixel + 10}px`,
            zIndex: '1',
            fontSize: '20px',
            fontFamily: 'Nunito',
            fontWeight: '700',
          }}
        >
          <span style={{ color: '#1A1A1A', fontFamily: 'Nunito', fontSize: '25' }}>(</span>
          <span style={{ color: '#AA5EE0', fontFamily: 'Nunito', fontSize: '25' }}>{xCoordB}</span>
          <span style={{ color: '#FF8F1F', fontFamily: 'Nunito', fontSize: '25' }}>,</span>
          <span style={{ color: '#FF8F1F', fontFamily: 'Nunito', fontSize: '25' }}>{yCoordB}</span>
          <span style={{ color: '#1A1A1A', fontFamily: 'Nunito', fontSize: '25' }}>)</span>
        </div>
      )}
      {simplifiedSlopeNumerator !== null &&
        simplifiedSlopeDenominator !== null &&
        coordinatesActive && (
          <div
            style={{
              position: 'absolute',
              top: '670px',
              left: '220px',
              zIndex: '2',
              fontSize: '20px',
              fontFamily: 'Nunito',
              fontWeight: '700',
              alignContent: 'center',
            }}
          >
            Slope =
          </div>
        )}
      {simplifiedSlopeNumerator !== null &&
        simplifiedSlopeDenominator !== null &&
        coordinatesActive && (
          <div
            style={{
              position: 'absolute',
              top: '640px',
              left: '310px',
              zIndex: '2',
              fontSize: '20px',
              fontFamily: 'Nunito',
              fontWeight: '700',

              alignContent: 'center',
            }}
          >
            <BlockMath
              math={`\\frac{\\color{#AA5EE0}(${yCoordB}) - (${yCoordA})}{\\color{#FF8F1F}(${xCoordB}) - (${xCoordA})} = \\frac{\\color{#AA5EE0}{${simplifiedSlopeNumerator}}}{\\color{#FF8F1F}{${simplifiedSlopeDenominator}}}`}
            />
          </div>
        )}
      {/* {simplifiedSlopeNumerator !== null &&
        simplifiedSlopeDenominator !== null &&
        coordinatesActive && (
          <div
            style={{
              position: 'absolute',
              top: '668px',
              left: '455px',
              zIndex: '2',
              fontSize: '20px',
              fontFamily: 'Nunito',
              fontWeight: '700',

              alignContent: 'center',
            }}
          >
            {' '}
            =
          </div>
        )} */}
      {/* {coordinatesActive && <GeogebraText>{finalTextNumerator}</GeogebraText>} */}
      {showOnboarding1 && (
        <OnboardingAnimationContainer left={360} top={80} src={dragalldirection} loop autoplay />
      )}
      {showOnboarding2 && (
        <OnboardingAnimationContainer left={-120} top={650} src={dragalldirection} loop autoplay />
      )}
      {nextbutton && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <NextButton onClick={onNextClick}>
            <img src={nextbuttonimage} />
          </NextButton>
        </div>
      )}
      {resetbutton && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <NextButton onClick={onRetryClick}>
            <img src={resetbuttonimg} />
          </NextButton>
        </div>
      )}
      {question1text && <ConstantText src={quesone} />}
      {wrongques1text && <ConstantText src={wrongquesone} />}
      {rightques1text && <ConstantText src={rightquesone} />}
      {question2text && <ConstantText src={questwo} />}
      {wrongques2text && <ConstantText src={wrongquestwo} />}
      {rightques2text && <ConstantText src={rightquetwo} />}
      {question3text && <ConstantText src={questhree} />}
      {wrongques3text && <ConstantText src={wrongquesthree} />}
      {rightques3text && <ConstantText src={rightquesthree} />}
      {question4text && <ConstantText src={quesfour} />}
      {wrongques4text && <ConstantText src={wrongquesfour} />}
      {rightques4text && <ConstantText src={rightquefour} />}
    </AppletContainer>
  )
}
function locatePoint2d(point: string | { x: number; y: number }, ggbApi: GeogebraAppApi) {
  const pointX = isString(point) ? ggbApi.getValue(`x(${point})`) : point.x
  const pointY = isString(point) ? ggbApi.getValue(`y(${point})`) : point.y
  const cornor1X = ggbApi.getValue('x(Corner(1))')
  const cornor1Y = ggbApi.getValue('y(Corner(1))')
  const cornor2X = ggbApi.getValue('x(Corner(2))')
  const cornor4Y = ggbApi.getValue('y(Corner(4))')
  const heightInPixel = ggbApi.getValue('y(Corner(5))')
  const widthInPixel = ggbApi.getValue('x(Corner(5))')

  return {
    leftPixel: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
    topPixel: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
  }
}
