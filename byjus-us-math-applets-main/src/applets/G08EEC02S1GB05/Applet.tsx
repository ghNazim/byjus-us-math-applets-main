import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'

const ANIM_STEP_DURATION = 100

const GGBContainer = styled(Geogebra)`
  position: absolute;
  left: 10px;
  top: 90px;
  width: 690px;
  height: 780px;
`
const MathsStyle = styled.div`
  position: absolute;
  top: 735px;
  left: 330px;
  color: #2d6066;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  border-radius: 5px;
  background: #dff1f1;
`

export const AppletG08EEC02S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>()

  const [area, setArea] = useState(1)
  const [pointisDragging, setPointIsDragging] = useState(false)
  const [areaCounter, setAreaCounter] = useState(0)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return
    setArea(api.getValue('Length(InnerGridPoints)'))

    api.registerObjectUpdateListener('C', () => {
      setArea(api.getValue('Length(InnerGridPoints)'))
    })

    api.registerClientListener((e) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'pic1') {
        setPointIsDragging(true)
        playMouseIn()

        const onMouseUp = () => {
          setPointIsDragging(false)
          setArea(api.getValue('Length(InnerGridPoints)'))
          document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mouseup', onMouseUp)
      } else if (e.type === 'dragEnd' && e.target === 'pic1') {
        playMouseOut()
      }
      if (e.type === 'dragEnd' && e.target === 'C') {
        setPointIsDragging(false)
        playMouseOut()
      }
    })
  }, [])

  useEffect(() => {
    setAreaCounter(0)
  }, [area])

  useEffect(() => {
    if (ggbApi.current == null) return
    ggbApi.current.setValue('n', areaCounter)
  }, [areaCounter])

  useInterval(
    () => {
      setAreaCounter(areaCounter + 1)
    },
    areaCounter !== area && !pointisDragging ? ANIM_STEP_DURATION : null,
  )

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec02-s1-gb05',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Adjust the size of the square and observe how many unit squares fit inside to learn about its area."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <>
        <GGBContainer materialId={'d6bfktwq'} onApiReady={onGGBLoaded} />
        <MathsStyle>{areaCounter}</MathsStyle>
      </>
    </AppletContainer>
  )
}
