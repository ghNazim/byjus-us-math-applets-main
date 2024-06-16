import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'
import { StepInput } from '@/molecules/StepInput'

import divide from './assets/divide.svg'
import reset from './assets/reset.svg'
import tooltip from './assets/tooltip.svg'
import visualise from './assets/visualise.png'
const ButtonElement = styled.button<{ pageno: number }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  height: 60px;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  background: ${(p) => (p.pageno == 4 ? '#FFFFFF' : '#1a1a1a')};
  border: 2px solid #1a1a1a;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
  color: #ffffff;
  :disabled {
    cursor: not-allowed;
    opacity: 0.2;
  }
`
const Hint = styled.img`
  position: absolute;
  right: 57px;
  top: 362px;
`
const StepperContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100px;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 100px;
  gap: 20px;
`
const ColoredSpan = styled.span<{ color: string }>`
  color: ${(props) => props.color};
`
const Text = styled.label`
  font-size: 24px;
  font-family: 'Nunito';
  font-weight: 700;
  color: #444444;
  text-align: center;
`
const MXFraction = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 270px;
  width: 130px;
  height: 150px;
  border: none;
  background: none;
`
const MNFractionLine = styled.div`
  position: absolute;
  width: 50px;
  height: 0px;
  left: calc(50% - 50px / 2 + 36px);
  top: 74px;
  border: 2px solid #646464;
`
const FractionComponent = styled.div<{ top: number; left: number; bg: number }>`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: ${(props) => (props.bg == 0 ? '#6595DE' : '#AA5EE0')};
  background: ${(props) => (props.bg == 0 ? '#F3F7FE' : '#FAF2FF')};
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  padding: 4px 12px;
  width: 50px;
  height: 50px;
`
const Fraction = styled.div`
  width: fit-content;
  min-width: 24px;
  height: 60px;
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
`
const FractionText = styled.div`
  width: 100%;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #aa5ee0;
  text-align: center;
  padding: 0 3px;
`
const FractionLine = styled.div`
  width: 100%;
  height: 0px;
  border: 2px solid #aa5ee0;
  border-radius: 25px;
`
const Equation = styled.div<{ top: number }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: ${(props) => props.top}px;
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
`
const EquationText = styled.div`
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #646464;
  text-align: center;
`
const GGB = styled(Geogebra)<{ visible: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 115px;
  ${(props) => (props.visible ? '' : 'visibility: hidden;')}
`
const BorderDiv = styled.div`
  position: absolute;
  width: 680px;
  height: 480px;
  left: 50%;
  translate: -50%;
  top: 100px;
  border: 1px solid #c882fa;
`
const StepperLabel: React.FC<{ color: string; children: string }> = ({ color, children }) => (
  <Text>
    {'Value of "'}
    <ColoredSpan color={color}>{children}</ColoredSpan>
    {'"'}
  </Text>
)
export const AppletG06NSC01S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [valueA, setValueA] = useState(0)
  const [valueN, setValueN] = useState(0)
  const [valueD, setValueD] = useState(0)
  const [pageNumber, setPageNumber] = useState(0)
  const [buttonDisable, setButtonDisable] = useState(true)
  const [drawLine, setDrawLine] = useState(false)
  const [boxFormation, setBoxFormation] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onChangeStepperButton1 = (value: number) => {
    setValueA(value)
  }
  const onChangeStepperButton2 = (value: number) => {
    setValueN(value)
  }
  const onChangeStepperButton3 = (value: number) => {
    setValueD(value)
  }
  const playClick = useSFX('mouseClick')
  const interaction = useContext(AnalyticsContext)
  useInterval(
    () => {
      if (!ggbApi.current) return
      if (ggbApi.current.getValue('a') < 13.5)
        ggbApi.current.setValue('a', ggbApi.current.getValue('a') + 0.1)
      else {
        setDrawLine(false)
        setButtonDisable(false)
      }
    },
    drawLine ? 30 : null,
  )
  useInterval(
    () => {
      if (!ggbApi.current) return
      if (ggbApi.current.getValue('delay2') >= 10) {
        setBoxFormation(false)
        setButtonDisable(false)
      }
    },
    boxFormation ? 30 : null,
  )
  const onHandleGGB = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return
  }, [])
  useEffect(() => {
    switch (pageNumber) {
      case 0:
        if (valueA != 0 && valueN != 0 && valueD != 0 && valueD >= valueN) {
          setButtonDisable(false)
        } else setButtonDisable(true)
        if (!ggbApi.current) return
        ggbApi.current.setValue('delay', 1)
        ggbApi.current.setValue('delay2', 0)
        break
      case 1:
        if (!ggbApi.current) return
        ggbApi.current.setValue('layer', 2)
        ggbApi.current.evalCommand('StartAnimation(delay)')
        ggbApi.current.setValue('m', valueA)
        ggbApi.current.setValue('d', valueD)
        ggbApi.current.setValue('n', valueN)
        ggbApi.current.setValue(
          'a',
          ggbApi.current.getValue('f') / (ggbApi.current.getValue('m') + 1),
        )
        setBoxFormation(true)
        setButtonDisable(true)
        break
      case 2:
        if (!ggbApi.current) return
        ggbApi.current.setValue('layer', 3)
        ggbApi.current.setValue('m', valueA)
        ggbApi.current.setValue('d', valueD)
        ggbApi.current.setValue('n', valueN)
        setDrawLine(true)
        setButtonDisable(true)
        break
      case 3:
        if (!ggbApi.current) return
        ggbApi.current.setValue('layer', 4)
        ggbApi.current.setValue('m', valueA)
        ggbApi.current.setValue('d', valueD)
        ggbApi.current.setValue('n', valueN)
        break
      case 4:
        if (!ggbApi.current) return
        ggbApi.current.setValue('layer', 5)
        ggbApi.current.setValue('m', valueA)
        ggbApi.current.setValue('d', valueD)
        ggbApi.current.setValue('n', valueN)
        break
    }
  }, [pageNumber, valueA, valueD, valueN])

  const onNextHandle = () => {
    playClick()
    interaction('next')
    if (pageNumber == 4) {
      setPageNumber(0)
      setValueA(0)
      setValueN(0)
      setValueD(0)
      setButtonDisable(true)
    } else setPageNumber((p) => p + 1)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc01-s1-gb03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Convert mixed fraction into an improper fraction."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <BorderDiv />
      {pageNumber == 0 && (
        <MXFraction>
          <FractionComponent top={50} bg={0} left={9}>
            {valueA == 0 ? 'a' : valueA}
          </FractionComponent>
          <FractionComponent top={10} bg={1} left={75}>
            {valueN == 0 ? 'n' : valueN}
          </FractionComponent>
          <MNFractionLine />
          <FractionComponent top={90} bg={1} left={75}>
            {valueD == 0 ? 'd' : valueD}
          </FractionComponent>
        </MXFraction>
      )}
      {valueD < valueN && valueD != 0 && <Hint src={tooltip} />}
      <GGB materialId="g84bphfp" onApiReady={onHandleGGB} visible={pageNumber > 0} />
      {pageNumber > 0 && (
        <Equation top={500}>
          <EquationText>
            <ColoredSpan color="#6595DE">{valueA}</ColoredSpan>
          </EquationText>
          <Fraction>
            <FractionText>{valueN}</FractionText>
            <FractionLine />
            <FractionText>{valueD}</FractionText>
          </Fraction>
          <EquationText>
            {' = '}
            <ColoredSpan color="#6595DE">{valueA + ' + '}</ColoredSpan>
          </EquationText>
          <Fraction>
            <FractionText>{valueN}</FractionText>
            <FractionLine />
            <FractionText>{valueD}</FractionText>
          </Fraction>
          {pageNumber > 1 && <EquationText>{' = '}</EquationText>}
          {pageNumber > 1 && (
            <Fraction>
              <FractionText>
                <ColoredSpan color="#6595DE">{valueA}</ColoredSpan>
                {' x '}
                {valueD}
                {' + '}
                {valueN}
              </FractionText>
              <FractionLine />
              <FractionText>{valueD}</FractionText>
            </Fraction>
          )}
          {pageNumber > 2 && <EquationText>{' = '}</EquationText>}
          {pageNumber == 3 && (
            <Fraction>
              <FractionText>{'?'}</FractionText>
              <FractionLine />
              <FractionText>{'?'}</FractionText>
            </Fraction>
          )}
          {pageNumber == 4 && (
            <Fraction>
              <FractionText>{valueA * valueD + valueN}</FractionText>
              <FractionLine />
              <FractionText>{valueD}</FractionText>
            </Fraction>
          )}
        </Equation>
      )}
      {pageNumber == 4 && (
        <Equation top={620} style={{ width: '700px' }}>
          <EquationText style={{ color: '#444444' }}>
            {'So, we have '}
            <ColoredSpan color="#6595DE">{valueA * valueD + valueN}</ColoredSpan>
            {' small blocks.'}
          </EquationText>
        </Equation>
      )}
      {pageNumber > 0 && (
        <Equation top={pageNumber == 4 ? 640 : 630} style={{ width: '700px' }}>
          {pageNumber == 1 && (
            <EquationText style={{ color: '#444444' }}>
              {'So, we have '}
              <ColoredSpan color="#6595DE">{valueA}</ColoredSpan>
              {' whole '}
              {valueA > 1 ? 'blocks' : 'block'}
              {' and '}
              <ColoredSpan color="#AA5EE0">{valueN}</ColoredSpan>
              {' small '}
              {valueN > 1 ? 'blocks' : 'block'}
              {' showing its '}
            </EquationText>
          )}
          {pageNumber == 1 && (
            <Fraction>
              <FractionText>{valueN}</FractionText>
              <FractionLine />
              <FractionText>{valueD}</FractionText>
            </Fraction>
          )}
          {pageNumber == 1 && (
            <EquationText style={{ color: '#444444' }}>{' fraction.'}</EquationText>
          )}
          {pageNumber == 2 && (
            <EquationText style={{ color: '#444444' }}>
              {'Now, we will divide the whole blocks into its fractions.'}
            </EquationText>
          )}
          {pageNumber == 3 && (
            <EquationText style={{ color: '#444444' }}>
              {"Awesome! Let's count the blocks."}
            </EquationText>
          )}

          {pageNumber == 4 && (
            <EquationText style={{ color: '#444444' }}>
              {'Therefore, the improper fraction is '}
            </EquationText>
          )}
          {pageNumber == 4 && (
            <Fraction>
              <FractionText>{valueA * valueD + valueN}</FractionText>
              <FractionLine />
              <FractionText>{valueD}</FractionText>
            </Fraction>
          )}
          {pageNumber == 4 && <EquationText style={{ color: '#444444' }}>{'.'}</EquationText>}
        </Equation>
      )}
      {pageNumber == 0 && (
        <StepperContainer>
          <StepInput
            min={1}
            max={5}
            defaultValue={0}
            showLabel={true}
            onChange={onChangeStepperButton1}
            label={() => <StepperLabel color="#6595DE">a</StepperLabel>}
          />
          <StepInput
            min={1}
            max={5}
            defaultValue={0}
            showLabel={true}
            onChange={onChangeStepperButton2}
            label={() => <StepperLabel color="#AA5EE0">n</StepperLabel>}
          />
          <StepInput
            min={1}
            max={5}
            defaultValue={0}
            showLabel={true}
            onChange={onChangeStepperButton3}
            label={() => <StepperLabel color="#AA5EE0">d</StepperLabel>}
          />
        </StepperContainer>
      )}
      <ButtonElement disabled={buttonDisable} onClick={onNextHandle} pageno={pageNumber}>
        {pageNumber == 0 && <img src={visualise} />}
        {pageNumber == 1 && 'Next'}
        {pageNumber == 2 && <img src={divide} />}
        {pageNumber == 3 && 'Count'}
        {pageNumber == 4 && <img src={reset} />}
      </ButtonElement>
    </AppletContainer>
  )
}
