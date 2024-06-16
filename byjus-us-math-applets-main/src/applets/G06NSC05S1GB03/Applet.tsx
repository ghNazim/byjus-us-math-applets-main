import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { RangeInput } from '@/molecules/RangeInput'

import retryIcon from './assets/retryIcon.svg'
import tryNewIcon from './assets/tryNew.svg'
import validate4 from './assets/valiadte4.svg'
import validate2 from './assets/validate2.svg'
import validate6 from './assets/validate6.svg'
import validateIcon from './assets/validateIcon.svg'

const GeogebraContainer = styled(Geogebra)<{ isActive: boolean }>`
  width: 100%;
  height: 70%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: 50px;
  display: ${(a) => (a.isActive ? 'flex' : 'none')};
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const varButtonColor = '#1a1a1a'

const Btn = styled.div<{ bottom: number }>`
  position: absolute;
  bottom: ${(a) => a.bottom}px;
  display: flex;
  background: ${varButtonColor};
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  margin: auto;
  gap: 1rem;
  cursor: pointer;
  margin-top: 10px;
`

const TextDiv = styled.div`
  width: 90%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff6db;
  border-radius: 8px;
  padding: 30px;
  position: absolute;
  top: 100px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
`

const BottomText = styled.div<{ top: number }>`
  text-align: center;
  position: absolute;
  top: ${(a) => a.top}px;
  width: 100%;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  pointer-events: none;
`

const ColredSpan = styled.span<{ color: string; bg: string }>`
  color: ${(a) => a.color};
  background: ${(a) => a.bg};
  padding: 5px;
  border-radius: 5px;
`

const OnBoardAnimation = styled(OnboardingAnimation)<{ left: number; top: number }>`
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  position: absolute;
`

interface MaterialIds {
  materialId: string
  pointToTrack: string
  answer: number
  maxValue: number
  width: number
  height: number
  validationImgSrc: string
}

const materialIdsWithPointToTrack: MaterialIds[] = [
  {
    materialId: 'vctaaaqy',
    pointToTrack: 'Value',
    answer: 4,
    maxValue: 12,
    width: 16,
    height: 12,
    validationImgSrc: validate4,
  },
  {
    materialId: 'heyqvquq',
    pointToTrack: 'a',
    answer: 6,
    maxValue: 6,
    width: 6,
    height: 12,
    validationImgSrc: validate6,
  },
  {
    materialId: 'wqhjrr9n',
    pointToTrack: 'a',
    answer: 2,
    maxValue: 6,
    width: 8,
    height: 6,
    validationImgSrc: validate2,
  },
]

export const AppletG06NSC05S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbReady, setGgbReady] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentValue, setCurrentvalue] = useState(0)
  const [isStartPressed, setIsStartPressed] = useState(false)
  const [answeringState, setAnsweringState] = useState<
    'default' | 'wrong' | 'wrongButCovered' | 'correct'
  >('default')
  const [isShowingValidateScreen, setIsShowingValidateScreen] = useState(false)

  //sound
  const playMouseClick = useSFX('mouseClick')
  const playCorrectAnswer = useSFX('correct')
  const playWrongAnswer = useSFX('incorrect')

  const onGgbReady1 = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api !== null) {
        ggbApi.current = api
        setGgbReady(true)
      }
    },
    [currentIndex],
  )

  useEffect(() => {
    const api = ggbApi.current

    if (api) {
      switch (answeringState) {
        case 'correct':
          playCorrectAnswer()
          api.setVisible('GreenFrame', true)
          api.setVisible('YellowFrame', false)
          break
        case 'wrong':
          playWrongAnswer()
          api.setVisible('RedFrame', true)
          api.setVisible('YellowFrame', false)
          break
        case 'wrongButCovered':
          playWrongAnswer()
          api.setVisible('RedFrame', true)
          api.setVisible('YellowFrame', false)
          break
        default:
          api.setVisible('YellowFrame', true)
          api.setVisible('GreenFrame', false)
          api.setVisible('RedFrame', false)
          break
      }
    }
  }, [answeringState])

  const sliderOnnChange = (val: number) => {
    setCurrentvalue(val)
  }

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.setValue(
        `${materialIdsWithPointToTrack[currentIndex].pointToTrack}`,
        currentValue,
      )
    }
  }, [currentIndex, currentValue])

  const handleCheckBtn = () => {
    if (currentValue === materialIdsWithPointToTrack[currentIndex].answer) {
      setAnsweringState('correct')
    } else {
      if (
        materialIdsWithPointToTrack[currentIndex].height % currentValue === 0 &&
        materialIdsWithPointToTrack[currentIndex].width % currentValue === 0
      ) {
        setAnsweringState('wrongButCovered')
      } else {
        setAnsweringState('wrong')
      }
    }
    playMouseClick()
  }

  const handleRetry = () => {
    playMouseClick()
    setAnsweringState('default')
  }

  const handleValidate = () => {
    playMouseClick()
    setIsShowingValidateScreen(true)
  }

  const handleTryNew = () => {
    setIsStartPressed(false)
    playMouseClick()
    setCurrentIndex((prev) => (prev + 1 === materialIdsWithPointToTrack.length ? 0 : prev + 1))
    setIsShowingValidateScreen(false)
    setAnsweringState('default')
    setGgbReady(false)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-nsc05-s1-gb03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader text="Application of GCF." backgroundColor="#f6f6f6" buttonColor="#1a1a1a" />
      <OnboardingController>
        <OnboardingStep index={0}>
          <OnBoardAnimation top={619} left={286} type="click" complete={isStartPressed} />
        </OnboardingStep>
        <OnboardingStep index={2}>
          <OnBoardAnimation
            top={669}
            left={286}
            type="click"
            complete={answeringState !== 'default'}
          />
        </OnboardingStep>
        {currentIndex === 0 && (
          <GeogebraContainer
            materialId={`${materialIdsWithPointToTrack[0].materialId}`}
            onApiReady={onGgbReady1}
            isActive={currentIndex === 0 && isStartPressed}
          />
        )}
        {currentIndex === 1 && (
          <GeogebraContainer
            materialId={`${materialIdsWithPointToTrack[1].materialId}`}
            onApiReady={onGgbReady1}
            isActive={currentIndex === 1 && isStartPressed}
          />
        )}
        {currentIndex === 2 && (
          <GeogebraContainer
            materialId={`${materialIdsWithPointToTrack[2].materialId}`}
            onApiReady={onGgbReady1}
            isActive={currentIndex === 2 && isStartPressed}
          />
        )}
        {isStartPressed ? (
          <>
            {isShowingValidateScreen ? (
              <>
                <div
                  style={{
                    width: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <TextDiv>
                    <img
                      src={`${materialIdsWithPointToTrack[currentIndex].validationImgSrc}`}
                      alt={`${materialIdsWithPointToTrack[currentIndex].validationImgSrc}`}
                    />
                  </TextDiv>
                </div>
                <BottomText top={530}>
                  The GCF of {materialIdsWithPointToTrack[currentIndex].width} and{' '}
                  {materialIdsWithPointToTrack[currentIndex].height} is{' '}
                  <ColredSpan bg="#CF8B04" color="white">
                    {materialIdsWithPointToTrack[currentIndex].answer}
                  </ColredSpan>
                </BottomText>
                <ButtonContainer>
                  <Btn bottom={60} onClick={handleTryNew}>
                    <img src={tryNewIcon} alt="try new" />
                    Try new
                  </Btn>
                </ButtonContainer>
              </>
            ) : (
              <>
                {ggbReady && (
                  <>
                    {answeringState === 'default' && (
                      <>
                        <BottomText top={530}>
                          Find the size of the largest square tile that can cover the courtyard.
                        </BottomText>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <RangeInput
                            min={0}
                            max={materialIdsWithPointToTrack[currentIndex].maxValue}
                            onChange={sliderOnnChange}
                          />
                        </div>
                        <OnboardingStep index={1}>
                          <OnBoardAnimation
                            top={580}
                            left={-95}
                            type="moveRight"
                            complete={currentValue !== 0}
                          />
                        </OnboardingStep>
                      </>
                    )}
                    {answeringState === 'wrongButCovered' && (
                      <BottomText top={530}>
                        The courtyard is covered, but it’s not the largest square size.
                      </BottomText>
                    )}
                    {answeringState === 'wrong' && (
                      <BottomText top={530}>
                        This tile size doesn’t cover the courtyard completely.
                        <br />
                        Keep trying for perfect fit!
                      </BottomText>
                    )}{' '}
                    {answeringState === 'correct' && (
                      <BottomText top={530}>
                        Well done!{' '}
                        <ColredSpan bg="#CF8B04" color="white">
                          {currentValue}
                        </ColredSpan>{' '}
                        is the side of the largest square tile that will cover the courtyard.
                        <br />
                        Let us validate this.
                      </BottomText>
                    )}
                    <ButtonContainer>
                      {answeringState === 'default' && (
                        <Btn bottom={60} onClick={handleCheckBtn}>
                          Check
                        </Btn>
                      )}
                      {(answeringState === 'wrong' || answeringState === 'wrongButCovered') && (
                        <Btn bottom={60} onClick={handleRetry}>
                          <img src={retryIcon} alt="retry" />
                          Retry
                        </Btn>
                      )}
                      {answeringState === 'correct' && (
                        <Btn bottom={60} onClick={handleValidate}>
                          <img src={validateIcon} alt="validate" />
                          Validate
                        </Btn>
                      )}
                    </ButtonContainer>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <div
              style={{
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TextDiv>
                A courtyard measuring {materialIdsWithPointToTrack[currentIndex].width}m by{' '}
                {materialIdsWithPointToTrack[currentIndex].height}m is being designed by an
                architect. He wants it to be completely covered with square tiles, with no gaps or
                overlaps along the edges. What is the largest square size he can use?
              </TextDiv>
            </div>
            <ButtonContainer>
              <Btn bottom={100} onClick={() => setIsStartPressed(true)}>
                Start
              </Btn>
            </ButtonContainer>
            <OnboardingStep index={1}>
              <OnBoardAnimation top={617} left={286} type="click" complete={isStartPressed} />
            </OnboardingStep>
          </>
        )}
      </OnboardingController>
    </AppletContainer>
  )
}
