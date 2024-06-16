import { number } from 'mathjs'
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

const OnboardinAnim = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`

export const AppletG07GMC05S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [hideOnboarding1, setOnboarding1] = useState(false)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const onggbReady = useCallback((api: GeogebraAppApi | null) => {
    if (api) {
      ggbApi.current = api
      setGgbLoaded(true)
    }
  }, [])

  const clientListener: ClientListener = (e) => {
    if (e.type === 'mouseDown') {
      if (e.hits[0] == 'n') {
        playMouseIn()
      }
    } else if (e.type === 'dragEnd') {
      if (e.target[0] == 'n') {
        playMouseOut()
      }
    }
  }
  useEffect(() => {
    if (ggbLoaded && ggbApi.current) {
      ggbApi.current.registerObjectUpdateListener('screencount', () => {
        if (ggbApi.current?.getValue('screencount') == 2) {
          setOnboarding1(true)
        }
      })

      ggbApi.current.registerObjectClickListener('NextActive', () => {
        playMouseClick()
      })
      ggbApi.current.registerObjectClickListener('pic7', () => {
        playMouseClick()
      })
      ggbApi.current.registerObjectClickListener('pic12', () => {
        playMouseClick()
      })
      ggbApi.current.registerObjectClickListener('NextScreen6', () => {
        playMouseClick()
      })

      ggbApi.current.registerClientListener(clientListener)

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('screencount')
        ggbApi.current?.unregisterObjectClickListener('NextActive')
        ggbApi.current?.unregisterObjectClickListener('pic7')
        ggbApi.current?.unregisterObjectClickListener('pic12')
        ggbApi.current?.unregisterObjectClickListener('NextScreen6')
        ggbApi.current?.unregisterClientListener(clientListener)
      }
    }
  }, [ggbLoaded])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-gmc05-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Derive area of circle by unfolding it into a rectangle."
        backgroundColor="#f6f6f6"
        buttonColor="#1A1A1A"
      />
      <OnboardingController>
        <StyledGgb materialId="kaug8neb" onApiReady={onggbReady} />
        {ggbLoaded ? (
          <OnboardingStep index={0}>
            <OnboardinAnim left={284} top={690} complete={hideOnboarding1} type="click" />
          </OnboardingStep>
        ) : undefined}
      </OnboardingController>
    </AppletContainer>
  )
}
