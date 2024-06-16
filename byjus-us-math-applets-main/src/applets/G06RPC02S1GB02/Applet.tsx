import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const StyledGgb = styled(Geogebra)`
  width: 100%;
  height: 100%;
`

const OnboardAnimation = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`

export const AppletG06RPC02S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [hideFirstOnboarding, setHideFirstOnboarding] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  //sound
  const playMouseClick = useSFX('mouseClick')
  const playCorrectAnswer = useSFX('correct')
  const playWrongAnswer = useSFX('incorrect')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const onGgbLoad = useCallback((api: GeogebraAppApi | null) => {
    if (api) {
      ggbApi.current = api
      setGgbLoaded(true)
    }
  }, [])

  const clientListener: ClientListener = (e) => {
    if (e.type === 'mouseDown' && e.hits[0] === 'Dagger') {
      playMouseIn()
    } else if (e.type === 'dragEnd' && e.target === 'Dagger') {
      playMouseOut()
    }

    if (!hideFirstOnboarding) {
      if (e.type === 'mouseDown' && (e.hits.includes('Button2') || e.hits.includes('Button1')))
        setHideFirstOnboarding(true)
    }
  }

  //registering objectClickListener for this array
  const GgbElementsForSoundClick = [
    'Button1',
    'Button2',
    'Next1',
    'Next2',
    'Check1_{2}',
    'Button5',
    'Button6',
    'Check2_{2}',
    'TryNew',
    'Button10',
    'Button9',
    'Button13',
    'Button14',
  ]

  useEffect(() => {
    if (ggbLoaded && ggbApi.current) {
      GgbElementsForSoundClick.map((ele) => {
        ggbApi.current?.registerObjectClickListener(ele, () => {
          playMouseClick()
        })
      })

      ggbApi.current.registerClientListener(clientListener)

      return () => {
        GgbElementsForSoundClick.map((ele) => {
          ggbApi.current?.unregisterObjectClickListener(ele)
        })

        ggbApi.current?.unregisterClientListener(clientListener)
      }
    }
  }, [ggbLoaded])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-rpc02-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore whether two ratios are equivalent."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <OnboardingController>
        <StyledGgb materialId="mambuat2" onApiReady={onGgbLoad} />
        {ggbLoaded ? (
          <OnboardingStep index={0}>
            <OnboardAnimation type="click" complete={hideFirstOnboarding} top={607} left={219} />
          </OnboardingStep>
        ) : null}
      </OnboardingController>
    </AppletContainer>
  )
}
