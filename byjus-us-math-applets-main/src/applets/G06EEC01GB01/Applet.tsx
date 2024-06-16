import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { TextHeader } from '../../common/Header'
import bottomLabel from './Assets/bottomLabel.svg'
import { RangeInputVertical } from './Vertical Slider/RangeInputVertical'

const VisualContainer = styled.div`
  position: absolute;
  display: flex;
  top: 45px;
  margin: 0 32px;
  flex-direction: row;
  align-items: center;
`
const Text = styled.p<{ state: 'visible' | 'active' | 'hidden' }>`
  font-size: 16px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  color: ${(props) => (props.state === 'active' ? '#AA5EE0' : '#c7c7c7')};
  opacity: ${(props) => (props.state === 'hidden' ? 0 : 1)};
  transition: opacity 300ms;
  margin: 0;
  line-height: 24px;
  .colored {
    color: ${(props) => (props.state === 'active' ? '#32A66C' : '#c7c7c7')};
  }
`
const TextContainer = styled.div`
  position: relative;
  top: -6px;
  left: -3px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 30px;
  z-index: 1;
`
const StyledGeogebra = styled(Geogebra)`
  width: 500px;
  height: 500px;
  position: relative;
  margin-left: -70px;
  margin-right: -70px;
`
const SliderContainer = styled.div`
  position: absolute;
  top: 106px;
  left: 560px;
  height: 300px;
  z-index: 1;
`
const HeaderOne = styled.div`
  position: absolute;
  width: 115px;
  height: 106px;
  left: 50px;
  top: 541px;
  background: #aa5ee0;
  border-radius: 5px 0px 0px 5px;
  .p {
    position: relative;
    top: 12px;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #faf2ff;
    align-items: center;
  }
`
const SectionOneT = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 171px;
  height: 54px;
  left: 163px;
  top: 541px;
  background: #faf2ff;
  border: 2px solid #aa5ee0;
  border-radius: 0px 5px 0px 0px;
  .p {
    position: relative;
    top: -3px;
    left: -10px;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    text-align: right;
    color: #aa5ee0;
  }
`
const SectionOneB = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 171px;
  height: 54px;
  left: 163px;
  top: 593px;
  background: #faf2ff;
  border: 2px solid #aa5ee0;
  border-radius: 0px 0px 5px 0px;
  .p {
    position: relative;
    top: -3px;
    left: -10px;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    text-align: right;
    color: #aa5ee0;
  }
`
const HeaderTwo = styled.div`
  position: absolute;
  width: 113px;
  height: 106px;
  left: 557px;
  top: 541px;
  background: #32a66c;
  border-radius: 0px 5px 5px 0px;
  .p {
    position: relative;
    top: 25px;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #e5ffec;
  }
`
const SectionTwoT = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 171px;
  height: 54px;
  left: 388px;
  top: 541px;
  background: #e5ffec;
  border: 2px solid #32a66c;
  border-radius: 5px 0px 0px 0px;
  .p {
    position: relative;
    top: -3px;
    left: 9px;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #32a66c;
  }
`
const SectionTwoB = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 171px;
  height: 54px;
  left: 388px;
  top: 593px;
  background: #e5ffec;
  border: 2px solid #32a66c;
  border-radius: 0px 0px 0px 5px;
  .p {
    position: relative;
    top: -3px;
    left: 9px;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #32a66c;
  }
`
const EqualLabel = styled.div`
  position: absolute;
  width: 20px;
  height: 28px;
  left: 351px;
  top: 554px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 33px;
  line-height: 28px;
  text-align: center;
  color: #646464;
`
const PageText = styled.p<{ textFade: boolean }>`
  position: absolute;
  width: 554px;
  height: 56px;
  left: 83px;
  top: 660px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #646464;
  opacity: ${(props) => (props.textFade ? 1 : 0)};
  transition: opacity 300ms;
`
const BottomLine = styled.img`
  position: absolute;
  width: 328px;
  left: 195px;
  top: 470px;
`
const BottomLabel = styled.div`
  position: absolute;
  width: 26px;
  height: 26px;
  left: 343px;
  top: 463px;
  background: #ffffff;
  .p {
    position: relative;
    top: -14px;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #aa5ee0;
  }
`
const AnimOnBoarding = styled(OnboardingAnimation).attrs({ type: 'moveUp' })`
  position: absolute;
  top: 245px;
  left: 483px;
  height: 300px;
  width: 300px;
  pointer-events: none;
  z-index: 2;
`
const rightText = ['6', '5', '4', '3', '2', '1']
const tableText = ['36', '30', '24', '18', '12', '6']
const leftText = [
  '6 + 6 + 6 + 6 + 6 + 6',
  '6 + 6 + 6 + 6 + 6',
  '6 + 6 + 6 + 6',
  '6 + 6 + 6',
  '6 + 6',
  '6',
]

export const AppletG06EEC01GB01: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGbLoaded] = useState(false)
  const [sliderValue, setSliderValue] = useState(1)
  const [pageText, setPageText] = useState(false)
  const hasSliderValueChanged = useHasChanged(sliderValue)

  const onApiReady = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return
    setGGbLoaded(true)
  }, [])

  const onSliderChange = (value: number) => {
    setSliderValue(value)
    if (ggbApi.current) {
      ggbApi.current.setValue('yy', value)
    }
  }

  const getState = (index: number) => {
    const i = leftText.length - index
    if (i == sliderValue) {
      return 'active'
    }
    if (i < sliderValue) {
      return 'visible'
    } else {
      return 'hidden'
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: ' #F6F6F6',
        id: 'G06EEC01GB01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Change the number of squares to observe the relation between repeated addition and multiplication."
        backgroundColor=" #F6F6F6"
        buttonColor="#1A1A1A"
      />
      {ggbLoaded && (
        <SliderContainer>
          <RangeInputVertical
            min={1}
            max={6}
            showLabel={false}
            onChange={onSliderChange}
            onChangeComplete={() => setPageText(true)}
          ></RangeInputVertical>
        </SliderContainer>
      )}
      <VisualContainer>
        {ggbLoaded && (
          <TextContainer>
            {leftText.map((text, i) => (
              <Text key={i} state={getState(i)}>
                {text}
              </Text>
            ))}
          </TextContainer>
        )}
        <StyledGeogebra materialId={'cy75p3qb'} width={500} height={500} onApiReady={onApiReady} />
        {ggbLoaded && (
          <>
            <TextContainer>
              {rightText.map((text, i) => (
                <Text key={i} state={getState(i)}>
                  6 <span className="colored">× {text}</span>
                </Text>
              ))}
            </TextContainer>
          </>
        )}
      </VisualContainer>
      {ggbLoaded && (
        <>
          <HeaderOne>
            <p className="p">Repeated addition</p>
          </HeaderOne>
          <SectionOneT>
            <p className="p">{leftText[6 - sliderValue]}</p>
          </SectionOneT>
          <SectionOneB>
            <p className="p">{tableText[6 - sliderValue]}</p>
          </SectionOneB>
          <HeaderTwo>
            <p className="p">Multiplication</p>
          </HeaderTwo>
          <SectionTwoT>
            <p className="p">6 × {rightText[6 - sliderValue]}</p>
          </SectionTwoT>
          <SectionTwoB>
            <p className="p">{tableText[6 - sliderValue]}</p>
          </SectionTwoB>
          <EqualLabel>=</EqualLabel>
          <EqualLabel style={{ top: '606px' }}>=</EqualLabel>
          <PageText textFade={pageText}>
            The result of the repeated addition is same as the result of multiplication.
          </PageText>
          <BottomLine src={bottomLabel}></BottomLine>
          <BottomLabel>
            <p className="p">6</p>
          </BottomLabel>
          <OnboardingController>
            <OnboardingStep index={0}>
              <AnimOnBoarding complete={hasSliderValueChanged} />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}
