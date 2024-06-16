import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'

import dragLeftRightAnimation from '../../common/handAnimations/clickAndDrag.json'
import patch from './assets/p1.jpg'

const GeogebraContainer = styled(Geogebra)`
  position: absolute;
  width: 95%;
  height: 850px;
  left: -160px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 25px;
  top: 12px;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
const PatchContainer = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  left: 23px;
  top: 757px;
  z-index: 1;
`

export const AppletG06NSC08S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [colorChange, setColorChange] = useState(false)
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')

  const [ValueA, setValueA] = useState<[string, string]>(['', ''])
  const [ValueB, setValueB] = useState<[string, string]>(['', ''])
  const [ValueC, setValueC] = useState<[string, string]>(['', ''])

  const [ModValueA, setModValueA] = useState<[string, string]>(['', ''])
  const [ModValueB, setModValueB] = useState<[string, string]>(['', ''])
  const [ModValueC, setModValueC] = useState<[string, string]>(['', ''])

  const [showValue, setShowValue] = useState(false)
  const [compareClicked, setCompareClicked] = useState(false)

  const onGGBLoaded = useCallback((api: any) => {
    ggbApi.current = api
    setGgbLoaded(api != null)
  }, [])

  // useEffect(() => {
  //   const api = ggbApi.current
  //   if (api != null && ggbLoaded) {
  //     api.registerObjectUpdateListener('L1', () => {
  //       setValueA([api.getValueString('L1'), api.getColor('L1')])
  //       console.log('Color', api.getColor('L1'))
  //     })
  //     api.registerObjectUpdateListener('M1', () => {
  //       setValueB([api.getValueString('M1'), api.getColor('M1')])
  //     })
  //     api.registerObjectUpdateListener('R1', () => {
  //       setValueC([api.getValueString('R1'), api.getColor('R1')])
  //     })

  //     api.registerObjectUpdateListener('L2', () => {
  //       setModValueA([api.getValueString('L2'), api.getColor('L2')])
  //     })
  //     api.registerObjectUpdateListener('M2', () => {
  //       setModValueB([api.getValueString('M2'), api.getColor('M2')])
  //     })
  //     api.registerObjectUpdateListener('R2', () => {
  //       setModValueC([api.getValueString('R2'), api.getColor('R2')])
  //     })
  //   }
  // })
  useInterval(
    () => {
      setColorChange(false)
      const api = ggbApi.current
      if (api != null && ggbLoaded) {
        setValueA([api.getValueString('L1'), api.getColor('L1')])

        setValueB([api.getValueString('M1'), api.getColor('M1')])

        setValueC([api.getValueString('R1'), api.getColor('R1')])

        setModValueA([api.getValueString('L2'), api.getColor('L2')])

        setModValueB([api.getValueString('M2'), api.getColor('M2')])

        setModValueC([api.getValueString('R2'), api.getColor('R2')])
      }
    },
    colorChange ? 200 : null,
  )

  useEffect(() => {
    const api = ggbApi.current
    if (api != null && ggbLoaded) {
      // api.registerObjectUpdateListener('L1', () => {
      //   setValueA([api.getValueString('L1'), api.getColor('L1')])
      // })
      // api.registerObjectUpdateListener('M1', () => {
      //   setValueB([api.getValueString('M1'), api.getColor('M1')])
      // })
      // api.registerObjectUpdateListener('R1', () => {
      //   setValueC([api.getValueString('R1'), api.getColor('R1')])
      // })

      // api.registerObjectUpdateListener('L2', () => {
      //   setModValueA([api.getValueString('L2'), api.getColor('L2')])
      // })
      // api.registerObjectUpdateListener('M2', () => {
      //   setModValueB([api.getValueString('M2'), api.getColor('M2')])
      // })
      // api.registerObjectUpdateListener('R2', () => {
      //   setModValueC([api.getValueString('R2'), api.getColor('R2')])
      // })

      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown') {
          if (e.hits[0] === 'Pointer1' || e.hits[0] === 'Pointer2' || e.hits[0] === 'Pointer3') {
            setShowOnboarding1(false)
            playMouseIn()
          } else if (
            e.hits[0] === 'Next1' ||
            e.hits[0] === 'Next2' ||
            e.hits[0] === 'Next3' ||
            e.hits[0] === 'Next4' ||
            e.hits[0] === 'Next5' ||
            e.hits[0] === 'Next7'
          ) {
            playMouseCLick()
          } else if (e.hits[0] === 'Compare') {
            playMouseCLick()
            setShowValue(!showValue)
            setCompareClicked(true)
            setColorChange(true)
          } else if (e.hits[0] === 'ResetButton') {
            playMouseCLick()
            setCompareClicked(false)
            setShowValue(!showValue)
          }
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'Pointer1' || e.target === 'Pointer2' || e.target === 'Pointer3')
        ) {
          playMouseOut()
        }
      }

      api.registerClientListener(onGGBClient)

      return () => {
        ggbApi.current?.unregisterClientListener(onGGBClient)
        ggbApi.current?.unregisterObjectUpdateListener('L1')
        ggbApi.current?.unregisterObjectUpdateListener('M1')
        ggbApi.current?.unregisterObjectUpdateListener('R1')
        ggbApi.current?.unregisterObjectUpdateListener('L2')
        ggbApi.current?.unregisterObjectUpdateListener('M2')
        ggbApi.current?.unregisterObjectUpdateListener('R2')
      }
    }
  }, [ggbLoaded, playMouseCLick, playMouseIn, playMouseOut, showValue])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc08-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Absolute and actual values  on a number line"
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="jf2ackeq" width={841} height={856} onApiReady={onGGBLoaded} />
      {showOnboarding1 && (
        <OnboardingAnimationContainer
          left={160}
          top={440}
          src={dragLeftRightAnimation}
          loop
          autoplay
        />
      )}
      <PatchContainer src={patch}></PatchContainer>
      {compareClicked && (
        <div>
          {ValueA !== null && showValue && (
            <div
              style={{
                position: 'absolute',
                top: '485px',
                left: '380px',
                zIndex: '1',
                fontSize: '20px',
                fontFamily: 'Nunito',
                fontWeight: '700',
              }}
            >
              <span style={{ color: ValueA[1], fontFamily: 'Nunito', fontSize: '25' }}>
                {ValueA[0]}
              </span>
            </div>
          )}
          {ValueB !== null && showValue && (
            <div
              style={{
                position: 'absolute',
                top: '485px',
                left: '440px',
                zIndex: '1',
                fontSize: '20px',
                fontFamily: 'Nunito',
                fontWeight: '700',
              }}
            >
              <span style={{ color: ValueB[1], fontFamily: 'Nunito', fontSize: '25' }}>
                {ValueB[0]}
              </span>
            </div>
          )}
          {ValueC !== null && showValue && (
            <div
              style={{
                position: 'absolute',
                top: '485px',
                left: '500px',
                zIndex: '1',
                fontSize: '20px',
                fontFamily: 'Nunito',
                fontWeight: '700',
              }}
            >
              <span style={{ color: ValueC[1], fontFamily: 'Nunito', fontSize: '25' }}>
                {ValueC[0]}
              </span>
            </div>
          )}
          {ModValueA !== null && showValue && (
            <div
              style={{
                position: 'absolute',
                top: '535px',
                left: '380px',
                zIndex: '1',
                fontSize: '20px',
                fontFamily: 'Nunito',
                fontWeight: '700',
              }}
            >
              <span style={{ color: ModValueA[1], fontFamily: 'Nunito', fontSize: '25' }}>
                {ModValueA[0]}
              </span>
            </div>
          )}
          {ModValueB !== null && showValue && (
            <div
              style={{
                position: 'absolute',
                top: '535px',
                left: '440px',
                zIndex: '1',
                fontSize: '20px',
                fontFamily: 'Nunito',
                fontWeight: '700',
              }}
            >
              <span style={{ color: ModValueB[1], fontFamily: 'Nunito', fontSize: '25' }}>
                {ModValueB[0]}
              </span>
            </div>
          )}
          {ModValueC !== null && showValue && (
            <div
              style={{
                position: 'absolute',
                top: '535px',
                left: '500px',
                zIndex: '1',
                fontSize: '20px',
                fontFamily: 'Nunito',
                fontWeight: '700',
              }}
            >
              <span style={{ color: ModValueC[1], fontFamily: 'Nunito', fontSize: '25' }}>
                {ModValueC[0]}
              </span>
            </div>
          )}
        </div>
      )}
    </AppletContainer>
  )
}
