import { Player } from '@lottiefiles/react-lottie-player'
import { isNumber, string } from 'mathjs'
import { FC, useCallback, useRef, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import styled from 'styled-components'

import { click, slider } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ResetButton from './assets/reset.svg'

const CenteredGGBLeft = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 720px;
  height: 710px;
  left: 5px;
  top: 100px;
  z-index: 0;
  margin-right: -1px;
  border: none;
  scale: 0.95;
  z-index: 0;
`

const TexWrappper = styled.div`
  position: absolute;
  align-items: center;
  width: 400px;
  height: 40px;
`

const AppletText = styled.h2`
  position: absolute;
  color: var(--monotone-100, #444);
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  left: 90%;
  top: 450px;
  transform: translateX(-50%);
  white-space: nowrap;
  display: flex;
  justify-content: center;
  text-align: center;
`
const AppletText1 = styled.h2`
  position: absolute;
  color: var(--monotone-100, #444);
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  left: 90%;
  top: 630px;
  transform: translateX(-50%);
  white-space: nowrap;
  display: flex;
  justify-content: center;
  text-align: center;
`

const CustomTextContainer1 = styled.div`
  background: var(--monotone-300, #ececec);
  border-radius: 5px;
  padding: 2px 4px;
  display: inline-block;
`
const CustomTextContainer2 = styled.div`
  border-radius: 5px;
  background: var(--secondary-skyblue-400, #e7fbff);
  padding: 2px 4px;

  color: var(--secondary-skyblue-090, #1cb9d9);
  text-align: center;

  /* Sub heading/Bold */
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 140% */
  display: inline-block;
`

const CustomTextContainer3 = styled.div`
  border-radius: 5px;
  background: var(--secondary-beer-400, #fff2e5);
  padding: 2px 4px;

  color: var(--secondary-beer-090, #d97a1a);
  text-align: center;

  /* Sub heading/Bold */
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 140% */
  display: inline-block;
`
const ResetButton1 = styled.img`
  position: absolute;
  left: 300px;
  top: 715px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 3;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 2;
`

export const AppletG08FNC01S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showOnboarding3, setShowOnboarding3] = useState(false)
  const [appletTextTopPosition, setAppletTextTopPosition] = useState(450)
  const texts = [
    '', //0
    '           Choose an operator, then set a number to define the rule.', //1
    'Well done! Now, proceed to observe the output of this function rule.', //2
    '                              Select a number to observe the output.', //3
    '                                                        multiply by', //4
  ]

  const [currentFrame, setCurrentFrame] = useState(0)
  const [customText, setCustomText] = useState('')
  const [customText1, setCustomText1] = useState('')
  const [customText2, setCustomText2] = useState('')
  const [customText3, setCustomText3] = useState('')

  const [operationSelected, setOperationSelected] = useState(0)
  const [valueSelected, setValueSelected] = useState(-1)

  const onGGBLoadedLeft = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGGBLoaded(true)
      setCurrentFrame(1)
      ggbApi.current?.registerObjectUpdateListener('frame', () => {
        if (ggbApi.current?.getValue('frame') === 1) {
          setCurrentFrame(3)
          setShowOnboarding3(true)
          const newTopPosition = 630
          setAppletTextTopPosition(newTopPosition)
        } else {
          setAppletTextTopPosition(450)
        }

        // if (ggbApi.current?.getValue('frame') === 0) {
        //   setCurrentFrame(1)
        // }
      })

      ggbApi.current?.registerObjectUpdateListener('operation', () => {
        if (ggbApi.current?.getValue('operation') === 1) {
          setOperationSelected(1)
        } else if (ggbApi.current?.getValue('operation') === 2) {
          setOperationSelected(2)
        } else if (ggbApi.current?.getValue('operation') === 3) {
          setOperationSelected(3)
        } else if (ggbApi.current?.getValue('operation') === 4) {
          setOperationSelected(4)
        }
      })

      ggbApi.current?.registerObjectUpdateListener('val', () => {
        if (ggbApi.current?.getValue('val') === 0) {
          setValueSelected(0)
        } else if (ggbApi.current?.getValue('val') === 1) {
          setValueSelected(1)
        } else if (ggbApi.current?.getValue('val') === 2) {
          setValueSelected(2)
        } else if (ggbApi.current?.getValue('val') === 3) {
          setValueSelected(3)
        } else if (ggbApi.current?.getValue('val') === 4) {
          setValueSelected(4)
        }
      })

      ggbApi.current?.registerObjectUpdateListener('move2', () => {
        const move2Value = ggbApi.current?.getValue('move2')
        if (move2Value === 1.8) {
          const operationValue = Number(ggbApi.current?.getValue('operation'))

          const valValue = ggbApi.current?.getValue('val')

          const dropdownvalue = ggbApi.current?.getValue('call')

          // Define mapping for 'operation' values from GeoGebra
          const operationMap: { [key: number]: string } = {
            1: 'add',
            2: 'subtract',
            3: 'multiply by',
            4: 'divide by',
          }

          // Define mapping for 'val' values from GeoGebra
          const valMap: { [key: number]: string } = {
            1: '1',
            2: '2',
            3: '3',
            4: '4',
          }

          const dropMap: { [key: number]: number } = {
            '-3': -3,
            '-2': -2,
            '-1': -1,
            '0': 0,
            '1': 1,
            '2': 2,
            '3': 3,
          }

          const operationSignMap: { [key: number]: string } = {
            1: '+',
            2: '-',
            3: '×',
            4: '÷',
          }

          const finalTexts = [
            'more than',
            'less than',
            'times',
            ['same as', 'half', 'one-third', 'one-fourth'],
          ]
          const operationText =
            operationValue !== undefined ? operationMap[operationValue] ?? 'unknown' : 'unknown'
          const valText = valValue !== undefined ? valMap[valValue] ?? 'unknown' : 'unknown'

          const operationValueSign =
            valValue !== undefined ? operationSignMap[operationValue] ?? 'unknown' : 'unknown'

          const dropdownString = String(dropdownvalue ?? '0')
          const dropdownNumber = parseInt(dropdownString, 10)

          const updatedDropdownNumber = dropMap[dropdownNumber] ?? dropdownNumber

          const updatedDropdownvalue = String(updatedDropdownNumber)

          ggbApi.current?.registerObjectUpdateListener('out1', () => {
            const const1value = ggbApi.current?.getValue('out1')

            const newText = (
              <>
                With the rule set to{' '}
                <CustomTextContainer1>{`${operationText} ${valText}`}</CustomTextContainer1>, the
                output for <CustomTextContainer2>{updatedDropdownvalue}</CustomTextContainer2> is{' '}
                <CustomTextContainer3>{const1value?.toFixed(2)}</CustomTextContainer3> (
                {updatedDropdownvalue}
                {operationValueSign}
                {valValue})
              </>
            )

            setCustomText(ReactDOMServer.renderToString(newText))
          })

          ggbApi.current?.registerObjectUpdateListener('out2', () => {
            const const2value = ggbApi.current?.getValue('out2')
            const newText1 = (
              <>
                With the rule set to{' '}
                <CustomTextContainer1>{`${operationText} ${valText}`}</CustomTextContainer1>, the
                output for <CustomTextContainer2>{updatedDropdownvalue}</CustomTextContainer2> is{' '}
                <CustomTextContainer3>{const2value}</CustomTextContainer3> ({updatedDropdownvalue}
                {operationValueSign}
                {valValue})
              </>
            )
            setCustomText1(ReactDOMServer.renderToString(newText1))
          })

          ggbApi.current?.registerObjectUpdateListener('out3', () => {
            const const3value = ggbApi.current?.getValue('out3')
            const newText2 = (
              <>
                With the rule set to{' '}
                <CustomTextContainer1>{`${operationText} ${valText}`}</CustomTextContainer1>, the
                output for <CustomTextContainer2>{updatedDropdownvalue}</CustomTextContainer2> is{' '}
                <CustomTextContainer3>{const3value}</CustomTextContainer3> ({updatedDropdownvalue}
                {operationValueSign}
                {valValue})
              </>
            )
            setCustomText2(ReactDOMServer.renderToString(newText2))
          })

          ggbApi.current?.registerObjectUpdateListener('out4', () => {
            const newText3 = (
              <>
                Awesome! With the rule set to{' '}
                <CustomTextContainer1>{`${operationText} ${valText}`}</CustomTextContainer1>, the
                output is {operationSelected != 4 && valValue}
                {'\n'}
                <div>
                  {operationSelected !== 4
                    ? finalTexts[operationSelected - 1]
                    : finalTexts[3][valueSelected - 1]}{' '}
                  the input.
                </div>
              </>
            )
            setCustomText3(ReactDOMServer.renderToString(newText3))
          })
        }
      })

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'pic2') {
            playMouseClick()
            setShowOnboarding1(false)
            setShowOnboarding2(true)
            setCurrentFrame(0)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'c') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic3') {
            playMouseClick()
            setShowOnboarding1(false)
            setShowOnboarding2(true)
            setCurrentFrame(0)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic4') {
            playMouseClick()
            setShowOnboarding1(false)
            setShowOnboarding2(true)
            setCurrentFrame(0)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic5') {
            playMouseClick()
            setShowOnboarding1(false)
            setShowOnboarding2(true)
            setCurrentFrame(0)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'nextbut') {
            playMouseClick()
            setCurrentFrame(3)
            setCustomText('')
            setCustomText1('')
            setCustomText2('')
            setCustomText3('')
          } else if (e.type === 'mouseDown' && e.hits[0] === 'dropdown') {
            playMouseClick()
            setShowOnboarding3(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'rightarrow') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'leftarrow') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'blackbox') {
            playMouseClick()
            setCurrentFrame(0)
          } else if (e.type === 'dragEnd' && e.target[0] === 'c') {
            playMouseOut()
            setCurrentFrame(2)
            setShowOnboarding2(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'ResetButton') {
            playMouseClick()
          }
          return () => {
            ggbApi.current?.unregisterClientListener(onGGBClient)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [operationSelected, valueSelected, playMouseClick, playMouseIn, playMouseOut],
  )

  const handleTryNewButtonClick = () => {
    ggbApi.current?.evalCommand('RunClickScript(ResetButton)')
    setCustomText3('')
    setShowOnboarding1(true)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-fnc01-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Build function rules and observe their outputs."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <CenteredGGBLeft
        materialId={'dtwzrucj'}
        onApiReady={onGGBLoadedLeft}
        width={720}
        height={710}
      />

      {ggbApi && ggbLoaded && (
        <TexWrappper>
          {/* Use the appletTextTopPosition state to set the top position */}
          <AppletText style={{ top: `${appletTextTopPosition}px` }}>
            {texts[currentFrame]}
          </AppletText>
          <AppletText1>
            {customText && (
              <div
                style={{ whiteSpace: 'nowrap' }}
                dangerouslySetInnerHTML={{ __html: customText }}
              />
            )}
            {customText1 && (
              <div
                style={{ whiteSpace: 'nowrap' }}
                dangerouslySetInnerHTML={{ __html: customText1 }}
              />
            )}
            {customText2 && (
              <div
                style={{ whiteSpace: 'nowrap' }}
                dangerouslySetInnerHTML={{ __html: customText2 }}
              />
            )}
            {customText3 && (
              <div
                style={{ whiteSpace: 'nowrap' }}
                dangerouslySetInnerHTML={{ __html: customText3 }}
              />
            )}
          </AppletText1>
        </TexWrappper>
      )}
      {ggbApi.current?.getValue('count') === 4 && (
        <ResetButton1 src={ResetButton} onClick={handleTryNewButtonClick}></ResetButton1>
      )}
      {showOnboarding1 && (
        <>
          <OnboardingAnimationContainer left={50} top={630} src={click} loop autoplay />
        </>
      )}
      {showOnboarding2 && (
        <>
          <OnboardingAnimationContainer left={10} top={520} src={slider} loop autoplay />
        </>
      )}
      {showOnboarding3 && (
        <>
          <OnboardingAnimationContainer left={120} top={180} src={click} loop autoplay />
        </>
      )}
    </AppletContainer>
  )
}
