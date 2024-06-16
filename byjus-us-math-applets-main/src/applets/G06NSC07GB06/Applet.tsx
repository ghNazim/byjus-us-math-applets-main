import { FC, useCallback, useRef, useState } from 'react'
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

export const AppletG06NSC07GB06: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [hideFirstOnBoarding, setHideFirstOnboarding] = useState(false)
  const [ggbLoaded, setGgbLoaded] = useState(false)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onggbReady = useCallback((api: GeogebraAppApi | null) => {
    if (api !== null) {
      ggbApi.current = api
      ggbApi.current.registerClientListener(clientEvent)
      setGgbLoaded(true)

      return () => {
        ggbApi.current?.unregisterClientListener(clientEvent)
      }
    }
  }, [])

  const ArrayForMouseClick = ['TryNew', 'AansNext', 'Check', 'BansNext', 'CansNext', 'DansNext']
  const ArrayForMouseDragSound = ['ctrl', 'Draggable1', 'Draggable2', 'Draggable3', 'Draggable4']

  const clientEvent: ClientListener = (e) => {
    if (e.type === 'mouseDown') {
      if (ArrayForMouseDragSound.includes(e.hits[0])) {
        if (!hideFirstOnBoarding) setHideFirstOnboarding(true)
        playMouseIn()
      } else if (ArrayForMouseClick.includes(e.hits[0])) {
        playMouseClick()
      }
    } else if (e.type === 'dragEnd') {
      playMouseOut()
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#fafafa',
        id: 'g06-nsc07-gb06',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Visualize the given integers on the number line and
place them in order."
        backgroundColor="#fafafa"
        buttonColor="#1a1a1a"
      />
      <StyledGgb materialId="evewknhd" onApiReady={onggbReady} />
      <OnboardingController>
        {ggbLoaded && (
          <OnboardingStep index={0}>
            <OnboardAnimation
              left={162}
              top={430}
              type="moveHorizontally"
              complete={hideFirstOnBoarding}
            />
          </OnboardingStep>
        )}
      </OnboardingController>
    </AppletContainer>
  )
}
