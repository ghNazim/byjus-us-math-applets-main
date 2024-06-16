import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const GGBcontainer = styled(Geogebra)`
  position: absolute;
  left: 53%;
  translate: -52.5%;
  top: 23px;
  border: none;
  scale: 0.82;
`
const InputBox1 = styled.input<{ correctness?: string; top: string; left: string }>`
  position: relative;
  font-size: 20px;
  top: ${(p) => p.top};
  left: ${(p) => p.left};
  color: ${(p) =>
    p.correctness == 'red' ? '#CC6666' : p.correctness == 'green' ? '#6CA621' : '#212121'};
  border: 1px solid
    ${(p) =>
      p.correctness == 'red' ? '#CC6666' : p.correctness == 'green' ? '#6CA621' : '#212121'};
  background: ${(p) =>
    p.correctness == 'red' ? '#FFF2F2' : p.correctness == 'green' ? '#ECFFD9' : '#F6F6F6'};
  width: 60px;
  height: 46px;
  border-radius: 12px;
  z-index: 1;
  text-align: center;
  &:focus {
    outline: none;
  }
`

const FeedbackTop = styled.div`
  position: absolute;
  top: 530px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
`
const FeedbackCenter = styled(FeedbackTop)`
  top: 650px;
  translate: 0 -50%;
`
export const AppletG07GMC01S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [pageNum, setPageNum] = useState(0)
  const [stateOfCorrectness1, setStateOfCorrectness1] = useState('')
  const [stateOfCorrectness2, setStateOfCorrectness2] = useState('')
  const [answer1, setAnswer1] = useState('')
  const [answer2, setAnswer2] = useState('')
  const [nextDisabled, setNextDisabled] = useState(false)
  const [isNextButtonActive, setNextButtonActive] = useState(false)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGGBLoaded(api !== null)
      setNextButtonActive(true)
      setPageNum(0)

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'Next1') {
            setPageNum((prevPageNum) => (prevPageNum === 0 ? 1 : 2))
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'minus') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'Slider') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'CTACheck') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'CTATryAgain') {
            playMouseClick()
          } else if (e.type === 'dragEnd' && e.target === 'Slider') {
            playMouseOut()
          }
          return () => {
            ggbApi.current?.unregisterClientListener(onGGBClient)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },

    [ggbApi],
  )

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g07-gmc01-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader text="Exploring scale factor." backgroundColor="#F6F6F6" buttonColor="#1A1A1A" />

      {pageNum == 2 && (
        <InputBox1
          value={answer1}
          top="550px"
          left="128px"
          onChange={(e) => {
            setAnswer1(() => e.target.value.replace(/[^0-9. ]/g, ''))
            setStateOfCorrectness1('')
            if (+e.target.value >= 0.01) {
              setNextDisabled(false)
            }
          }}
          correctness={stateOfCorrectness1}
        />
      )}
      {pageNum == 2 && (
        <InputBox1
          value={answer2}
          top="605px"
          left="71px"
          onChange={(e) => {
            setAnswer2(() => e.target.value.replace(/[^0-9. ]/g, ''))
            setStateOfCorrectness2('')
            if (+e.target.value >= 0.01) {
              setNextDisabled(false)
            }
          }}
          correctness={stateOfCorrectness2}
        />
      )}

      <GGBcontainer materialId="ujtva6ty" onApiReady={onGGBLoaded} />
    </AppletContainer>
  )
}
