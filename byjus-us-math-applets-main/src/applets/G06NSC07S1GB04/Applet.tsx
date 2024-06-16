import { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import { IColorBlock } from '../G08EEC07S1GB01/assets/Elements'
import { defaultBlock, greenBlock, redBlock } from '../G08EEC09S2GB01/Elements/Elements'

const StyledGgb = styled(Geogebra)`
  width: 700px;
  overflow: hidden;
  position: absolute;
  left: 8.5px;
  top: 80px;
  z-index: -1;
`

const EntryField = styled.input<{
  state: number
  wrongBlock: IColorBlock
  rightBlock: IColorBlock
  defaultBlock: IColorBlock
}>`
  width: 90px;
  height: 60px;
  border-radius: 12px;
  border-color: '#646464';
  border-width: 1px;

  border-color: ${(props) =>
    props.state === 2
      ? props.defaultBlock.primary
      : props.state === 0
      ? props.wrongBlock.primary
      : props.rightBlock.primary};

  background-color: ${(props) =>
    props.state === 2
      ? props.defaultBlock.secondary
      : props.state === 0
      ? props.wrongBlock.secondary
      : props.rightBlock.secondary};

  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 40px;

  color: #444;

  position: absolute;
  top: 465px;
  left: 405px;

  :focus {
    outline: none;
    border: 2px solid
      ${(props) =>
        props.state === 2
          ? props.defaultBlock.primary
          : props.state === 0
          ? props.wrongBlock.primary
          : props.rightBlock.primary} !important;
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* -moz-appearance: textfield; */
`

export const AppletG06NSC07S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [layer, setLayer] = useState(0)
  const [currentState, setCurrentState] = useState(2)
  const [inputVal, setInputVal] = useState(NaN)

  const handleGGBready = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setGgbLoaded(true)

      ggbApi.current?.registerObjectUpdateListener('layer', () => {
        if (ggbApi.current) {
          const ans = ggbApi.current?.getValue('layer')
          setLayer(ans)
        }
      })
    },
    [ggbApi],
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(+event.target.value)
    ggbApi.current?.setValue('answer', +event.target.value)
  }

  useEffect(() => {
    if (Number.isNaN(inputVal)) setCurrentState(2)
    else if (inputVal === 70) setCurrentState(1)
    else if (inputVal != 70) setCurrentState(0)
  }, [inputVal])

  useEffect(() => {
    switch (layer) {
      case 0:
        setInputVal(NaN)
        setCurrentState(2)
        break
    }
  }, [layer])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc07-s1-gb04',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore integers with money"
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <StyledGgb materialId="jxz7wshj" onApiReady={handleGGBready} />
      {/* {layer === 7 || layer === 9 || layer === 8 ? (
        <EntryField
          value={inputVal === 0 ? '' : inputVal}
          disabled={layer != 7}
          type="number"
          state={2}
          wrongBlock={redBlock}
          rightBlock={greenBlock}
          defaultBlock={defaultBlock}
          onChange={handleChange}
        />
      ) : null} */}
    </AppletContainer>
  )
}
