import { lcm } from 'mathjs'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

const StyledGgb = styled(Geogebra)`
  height: 700px;
  width: 600px;
  position: absolute;
  left: 110px;
  top: 80px;
`
const PatchForHidingPauseBtn = styled.div`
  width: 30px;
  height: 30px;
  background-color: white;
  position: absolute;
  bottom: 21px;
  left: 117px;
`

const BottomText = styled.div`
  color: var(--monotone-100, #444);
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  position: absolute;
  display: inline-flex;
  bottom: 130px;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
`

const ColoredSpan = styled.span`
  background: #a363df;
  padding: 3px 8px;
  margin-left: 5px;
  color: white;
  border-radius: 5px;
`

export const AppletG06NSC05S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [value1, setValue1] = useState(0)
  const [value2, setValue2] = useState(0)
  const [boolLcm, setBoolLcm] = useState(false)
  //this is a variable from ggb, im just using the same name here
  //when this is true we have to show the final text
  const [ggbLoaded, setGgbLoaded] = useState(false)

  const handleGGBready = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setGgbLoaded(true)
    },
    [ggbApi],
  )

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.registerObjectUpdateListener('n', () => {
        setValue1(ggbApi.current ? ggbApi.current.getValue('n') : 0)
      })

      ggbApi.current.registerObjectUpdateListener('m', () => {
        setValue2(ggbApi.current ? ggbApi.current.getValue('m') : 0)
      })

      ggbApi.current.registerObjectUpdateListener('boollcm', () => {
        setBoolLcm(ggbApi.current ? Boolean(ggbApi.current.getValue('boollcm')) : false)
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('m')
        ggbApi.current?.unregisterObjectUpdateListener('n')
        ggbApi.current?.unregisterObjectUpdateListener('boollcm')
      }
    }
  }, [ggbLoaded])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc05-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="LCM of two numbers between 1 to 10."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <StyledGgb materialId="wuubszuh" onApiReady={handleGGBready} />
      {boolLcm ? (
        <BottomText>
          The LCM of {value1} and {value2} is <ColoredSpan>{lcm(value1, value2)}</ColoredSpan>
        </BottomText>
      ) : undefined}
      <PatchForHidingPauseBtn />
    </AppletContainer>
  )
}
