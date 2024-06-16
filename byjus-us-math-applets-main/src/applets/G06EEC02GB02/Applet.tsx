import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import clickAni from '@/common/handAnimations/click.json'
import { TextHeader } from '@/common/Header'
import { PageControl } from '@/common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import oops from './Assets/oops.svg'
import yay from './Assets/ysy.svg'

const Box1 = styled.div<{ bgColor: string }>`
  box-sizing: border-box;

  width: 221px;
  height: 64px;

  background: ${(props) => props.bgColor};
  border: 2px solid ${(props) => (props.bgColor === '#ffffff' ? '#444444' : props.bgColor)};
  border-radius: 5px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  /* or 140% */

  text-align: center;
  color: #646464;

  display: flex;
  justify-content: center;
  align-items: baseline;
`
const Box2 = styled.div<{ bgColor: string }>`
  box-sizing: border-box;
  width: 221px;
  height: 64px;

  background: ${(props) => props.bgColor};
  border: 2px solid ${(props) => (props.bgColor === '#ffffff' ? '#444444' : props.bgColor)};
  border-radius: 5px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  /* or 140% */

  text-align: center;
  color: #646464;

  display: flex;
  justify-content: center;
  align-items: baseline;
`
const Text = styled.div`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #646464;
`
const Feedback = styled.img``
const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`
const OnBoarding = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  pointer-events: none;
`
export const AppletG06EEC02GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [index, setIndex] = useState(1)
  const ggb1 = useRef<GeogebraAppApi | null>(null)
  const ggb2 = useRef<GeogebraAppApi | null>(null)
  const ggb3 = useRef<GeogebraAppApi | null>(null)
  const click = useSFX('mouseClick')
  const [ggb1Loaded, setGgb1Loaded] = useState(false)
  const [ggb2Loaded, setGgb2Loaded] = useState(false)
  const [ggb3Loaded, setGgb3Loaded] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const [exp1, setExp1] = useState({ posX: 0, c1: 0, negX: 0, c2: 0 })
  const [exp2, setExp2] = useState({ posX: 0, c1: 0, negX: 0, c2: 0 })
  const [exp3, setExp3] = useState({ posX: 0, c1: 0, negX: 0, c2: 0 })
  const [show, setShow] = useState(0)
  const onResetHandle = () => {
    setExp1({ posX: 0, c1: 0, negX: 0, c2: 0 })
    setExp2({ posX: 0, c1: 0, negX: 0, c2: 0 })
    setExp3({ posX: 0, c1: 0, negX: 0, c2: 0 })
    setIndex(0)
    ggb3.current?.setValue('slidery', 0)
    ggb3.current?.setValue('sliderone', 0)
    ggb3.current?.setValue('sliderminusy', 0)
    ggb2.current?.setValue('slidery', 0)
    ggb2.current?.setValue('sliderone', 0)
    ggb2.current?.setValue('sliderminusy', 0)
    ggb2.current?.setValue('sliderminusone', 0)
    ggb1.current?.setValue('slider', 0)
    ggb1.current?.setValue('s2', 0)
    ggb1.current?.setValue('s3', 0)
    ggb1.current?.setValue('s4', 0)
  }
  const ggb1ready = useCallback((api: GeogebraAppApi | null) => {
    ggb1.current = api
    setGgb1Loaded(!!ggb1.current)
    if (!ggb1.current) return
    ggb1.current.registerObjectUpdateListener('slider', () => {
      click()
      onInteraction('tap')
      setShow(1)
      setExp1((p) => {
        const _e = {
          ...p,
          posX: ggb1.current?.getValue('slider') ?? 0,
        }
        return _e
      })
    })
    ggb1.current.registerObjectUpdateListener('s2', () => {
      click()
      onInteraction('tap')
      setShow(1)

      setExp1((p) => {
        const _e = {
          ...p,
          c1: ggb1.current?.getValue('s2') ?? 0,
        }
        return _e
      })
    })
    ggb1.current.registerObjectUpdateListener('s3', () => {
      click()
      onInteraction('tap')
      setShow(1)

      setExp1((p) => {
        const _e = {
          ...p,
          negX: ggb1.current?.getValue('s3') ?? 0,
        }
        return _e
      })
    })
    ggb1.current.registerObjectUpdateListener('s4', () => {
      click()
      onInteraction('tap')
      setShow(1)

      setExp1((p) => {
        const _e = {
          ...p,
          c2: ggb1.current?.getValue('s4') ?? 0,
        }
        return _e
      })
    })
  }, [])

  const ggb2ready = useCallback((api: GeogebraAppApi | null) => {
    ggb2.current = api
    setGgb2Loaded(!!ggb2.current)
    if (!ggb2.current) return

    ggb2.current?.setValue('slidery', 0)
    ggb2.current?.setValue('sliderone', 0)
    ggb2.current?.setValue('sliderminusy', 0)
    ggb2.current?.setValue('sliderminusone', 0)

    ggb2.current.registerObjectUpdateListener('slidery', () => {
      click()
      onInteraction('tap')
      setExp2((p) => {
        const _e = {
          ...p,
          posX: ggb2.current?.getValue('slidery') ?? 0,
        }
        return _e
      })
    })
    ggb2.current.registerObjectUpdateListener('sliderone', () => {
      click()
      onInteraction('tap')
      setExp2((p) => {
        const _e = {
          ...p,
          c1: ggb2.current?.getValue('sliderone') ?? 0,
        }
        return _e
      })
    })
    ggb2.current.registerObjectUpdateListener('sliderminusy', () => {
      click()
      onInteraction('tap')
      setExp2((p) => {
        const _e = {
          ...p,
          negX: ggb2.current?.getValue('sliderminusy') ?? 0,
        }
        return _e
      })
    })
    ggb2.current.registerObjectUpdateListener('sliderminusone', () => {
      click()
      onInteraction('tap')
      setExp2((p) => {
        const _e = {
          ...p,
          c2: ggb2.current?.getValue('sliderminusone') ?? 0,
        }
        return _e
      })
    })
  }, [])
  useEffect(() => {
    // console.log(exp2)
  }, [exp2])

  const ggb3ready = useCallback((api: GeogebraAppApi | null) => {
    ggb3.current = api
    setGgb3Loaded(!!ggb3.current)
    if (!ggb3.current) return
    ggb3.current?.setValue('slidery', 0)
    ggb3.current?.setValue('sliderone', 0)
    ggb3.current?.setValue('sliderminusy', 0)

    ggb3.current.registerObjectUpdateListener('slidery', () => {
      click()
      onInteraction('tap')
      setExp3((p) => {
        const _e = {
          ...p,
          posX: ggb3.current?.getValue('slidery') ?? 0,
        }
        return _e
      })
    })
    ggb3.current.registerObjectUpdateListener('sliderone', () => {
      click()
      onInteraction('tap')
      setExp3((p) => {
        const _e = {
          ...p,
          c1: ggb3.current?.getValue('sliderone') ?? 0,
        }
        return _e
      })
    })
    ggb3.current.registerObjectUpdateListener('sliderminusy', () => {
      click()
      onInteraction('tap')
      setExp3((p) => {
        const _e = {
          ...p,
          negX: ggb3.current?.getValue('sliderminusy') ?? 0,
        }
        return _e
      })
    })
  }, [])
  useEffect(() => {
    if (exp1.posX === 4) setShow(2)
  }, [exp1.posX])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-eec02-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Use the algebra tiles to model the algebraic expressions."
        backgroundColor="#F6F6F6"
        buttonColor=" #1A1A1A"
      />
      <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="s94pqtgh" top={200} left={130} onApiReady={ggb1ready} />
      </div>
      <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="kurfnjph" top={200} left={130} onApiReady={ggb2ready} />
      </div>
      <div style={{ visibility: index === 2 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="wr9ethgm" top={200} left={130} onApiReady={ggb3ready} />
      </div>
      {(show === 0 || show == 2) && ggb1Loaded && (
        <OnBoarding
          top={exp1.posX === 4 ? 250 : 480}
          left={exp1.posX === 4 ? 205 : 165}
          src={clickAni}
          loop
          autoplay
        />
      )}

      {ggb1Loaded && index === 0 && (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: '130px',
            top: '123px',
            gap: 10,
          }}
        >
          <Box1
            bgColor={
              exp1.posX === 3 && exp1.c1 === 4 && exp1.negX === 1 && exp1.c2 === 1
                ? '#9effb6'
                : '#ffffff'
            }
          >
            <>
              <span>Current expression</span>
              <div
                style={{
                  position: 'absolute',
                  left: '50px',
                  top: '30px',
                  display: 'flex',
                  gap: '4px',
                }}
              >
                {exp1.posX !== 0 && exp1.posX === 1 && <Text> x </Text>}
                {exp1.posX !== 0 && exp1.posX > 1 && <Text>{exp1.posX}x </Text>}
                {exp1.c1 !== 0 && (
                  <>
                    <Text> + </Text>
                    <Text> {exp1.c1} </Text>
                  </>
                )}
                {exp1.negX !== 0 && exp1.negX === 1 && <Text>-x </Text>}
                {exp1.negX !== 0 && exp1.negX > 1 && <Text>-{exp1.negX}x </Text>}
                {exp1.c2 !== 0 && (
                  <>
                    <Text> - </Text>
                    <Text> {exp1.c2} </Text>
                  </>
                )}
              </div>
            </>
          </Box1>
          <Box2
            bgColor={
              exp1.posX === 3 && exp1.c1 === 4 && exp1.negX === 1 && exp1.c2 === 1
                ? '#9effb6'
                : '#ffffff'
            }
          >
            <>
              <span>Target expression</span>
              <div style={{ position: 'absolute', left: '275px', top: '30px', display: 'flex' }}>
                3x + 4 - x - 1
              </div>
            </>
          </Box2>
        </div>
      )}
      {ggb2Loaded && index === 1 && (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: '130px',
            top: '123px',
            gap: 10,
          }}
        >
          <Box1
            bgColor={
              exp2.posX === 2 && exp2.c1 === 2 && exp2.negX === 2 && exp2.c2 === 2
                ? '#9effb6'
                : '#ffffff'
            }
          >
            <>
              <span>Current expression</span>
              <div
                style={{
                  position: 'absolute',
                  left: '25px',
                  top: '30px',
                  display: 'flex',
                  gap: '4px',
                }}
              >
                {exp2.c1 !== 0 && (
                  <>
                    <Text> {exp2.c1} +</Text>
                  </>
                )}
                {exp2.posX >= 1 && exp2.posX !== 0 && <Text> y </Text>}
                {exp2.posX >= 2 && exp2.posX !== 0 && <Text>+ y </Text>}
                {exp2.c2 !== 0 && (
                  <>
                    <Text> - </Text>
                    <Text> {exp2.c2} </Text>
                  </>
                )}
                {exp2.negX !== 0 && (
                  <>
                    {exp2.negX === 1 && <Text> - y </Text>}
                    {exp2.negX > 1 && <Text> - {exp2.negX}y </Text>}
                  </>
                )}
              </div>
            </>
          </Box1>
          <Box2
            bgColor={
              exp2.posX === 2 && exp2.c1 === 2 && exp2.negX === 2 && exp2.c2 === 2
                ? '#9effb6'
                : '#ffffff'
            }
          >
            <>
              <span>Target expression</span>
              <div style={{ position: 'absolute', left: '255px', top: '30px', display: 'flex' }}>
                2 + y + y - 2 - 2y
              </div>
            </>
          </Box2>
        </div>
      )}
      {ggb3Loaded && index === 2 && (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: '130px',
            top: '123px',
            gap: 10,
          }}
        >
          <Box1
            bgColor={exp3.posX === 2 && exp3.c1 === 3 && exp3.negX === 1 ? '#9effb6' : '#ffffff'}
          >
            <>
              <span>Current expression</span>
              <div
                style={{
                  position: 'absolute',
                  left: '25px',
                  top: '30px',
                  display: 'flex',
                  gap: '4px',
                }}
              >
                {exp3.negX !== 0 && (
                  <>
                    {exp3.negX === 1 && <Text> - y +</Text>}
                    {exp3.negX > 1 && <Text> - {exp3.negX}y +</Text>}
                  </>
                )}
                {exp3.c1 !== 0 && (
                  <>
                    <Text> {exp3.c1} +</Text>
                  </>
                )}
                {exp3.posX !== 0 && exp3.posX === 1 && <Text> y </Text>}
                {exp3.posX !== 0 && exp3.posX > 1 && <Text> {exp3.posX}y </Text>}
              </div>
            </>
          </Box1>
          <Box2
            bgColor={exp3.posX === 2 && exp3.c1 === 3 && exp3.negX === 1 ? '#9effb6' : '#ffffff'}
          >
            <>
              <span>Target expression</span>
              <div style={{ position: 'absolute', left: '265px', top: '30px', display: 'flex' }}>
                - y + 3 + 2y
              </div>
            </>
          </Box2>
        </div>
      )}
      {index === 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            position: 'absolute',
            left: '20px',
            top: '390px',
          }}
        >
          {((exp1.posX === 4 && exp1.c1 === 5 && exp1.negX === 2 && exp1.c2 === 2) ||
            (exp1.posX === 3 && exp1.c1 === 4 && exp1.negX === 1 && exp1.c2 === 1)) && (
            <Feedback
              src={
                exp1.posX === 3 && exp1.c1 === 4 && exp1.negX === 1 && exp1.c2 === 1 ? yay : oops
              }
            />
          )}
        </div>
      )}
      {index === 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            position: 'absolute',
            left: '20px',
            top: '390px',
          }}
        >
          {((exp2.posX === 2 && exp2.c1 === 3 && exp2.negX === 3 && exp2.c2 === 3) ||
            (exp2.posX === 2 && exp2.c1 === 2 && exp2.negX === 2 && exp2.c2 === 2)) && (
            <Feedback
              src={
                exp2.posX === 2 && exp2.c1 === 2 && exp2.negX === 2 && exp2.c2 === 2 ? yay : oops
              }
            />
          )}
        </div>
      )}
      {index === 2 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            position: 'absolute',
            left: '20px',
            top: '390px',
          }}
        >
          {((exp3.posX === 3 && exp3.c1 === 4 && exp3.negX === 2) ||
            (exp3.posX === 2 && exp3.c1 === 3 && exp3.negX === 1)) && (
            <Feedback src={exp3.posX === 2 && exp3.c1 === 3 && exp3.negX === 1 ? yay : oops} />
          )}
        </div>
      )}
      <PageControl
        total={3}
        onChange={setIndex}
        nextDisabled={
          (!(exp1.posX === 3 && exp1.c1 === 4 && exp1.negX === 1 && exp1.c2 === 1) &&
            index === 0) ||
          (!(exp2.posX === 2 && exp2.c1 === 2 && exp2.negX === 2 && exp2.c2 === 2) && index === 1)
        }
        // current={2}
        onReset={onResetHandle}
      />
    </AppletContainer>
  )
}
//9effb6
