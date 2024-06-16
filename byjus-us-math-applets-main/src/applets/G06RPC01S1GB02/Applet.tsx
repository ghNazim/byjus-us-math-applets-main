import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useContext, useState } from 'react'
import styled from 'styled-components'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import circle from './assets/circle.svg'
import empty from './assets/empty.svg'
import emptyHil from './assets/emptyHil.svg'
import hexagon from './assets/hexagon.svg'
import retry from './assets/retry.svg'
import square from './assets/square.svg'
import triangle from './assets/triangle.svg'
import tryNew from './assets/tryNew.svg'
const BGContainer = styled.div<{ bgColor: string }>`
  position: absolute;
  top: 90px;
  left: 50%;
  translate: -50%;
  width: 680px;
  height: 480px;
  background-color: ${(p) =>
    p.bgColor == 'green' ? '#ECFFD9' : p.bgColor == 'red' ? '#FFECF1' : '#F3F7FE'};
`
const ShapesFiller = styled.div<{ bgColor: string }>`
  position: absolute;
  top: 280px;
  left: 50%;
  translate: -50%;
  width: 624px;
  height: 102px;
  background-color: ${(p) =>
    p.bgColor == 'green' ? '#ECFFD9' : p.bgColor == 'red' ? '#FFECF1' : '#fff'};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  img {
    width: 73px;
    height: 72px;
  }
`
const FilledShape = styled.img<{active:boolean}>`
  width: 73px;
  height: 72px;
  cursor: ${p=>p.active?'pointer':'default'};
  :hover {
    scale: ${p=>p.active?1.05:1};
  }
`
const ButtonTray = styled.div`
  position: absolute;
  top: 590px;
  left: 50%;
  translate: -50%;
  width: 680px;
  height: 102px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 40px;
`
const ShapeButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 101px;
  height: 100px;
  border-radius: 12px;
  border: 1px solid #c7c7c7;
  background: #fff;
  box-shadow: 0px -4px 0px 0px #c7c7c7 inset;
  cursor: pointer;
  &:hover:not([disabled]) {
    scale: 1.05;
    border: 1px solid #a7a7a7;
    box-shadow: 0px -4px 0px 0px #a7a7a7 inset;
  }
  :disabled {
    opacity: 0.3;
    cursor: default;
  }
`
const ShapeNames = styled.div`
  position: absolute;
  top: 55px;
  left: 50%;
  translate: -50%;
  width: 600px;
  height: 40px;
  text-align: center;
  font-family: 'Nunito';
  font-size: 28px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;
  color: #444;
`
const Ratios = styled.div`
  position: absolute;
  top: 124px;
  left: 50%;
  translate: -50%;
  width: 600px;
  height: 40px;
  text-align: center;
  font-family: 'Nunito';
  font-size: 28px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;
  color: #444;
`
const BrdrSpan = styled.span<{ color: string; bgcolor: string }>`
  color: ${(p) => p.color};
  display: inline-flex;
  padding: 10px 20px;
  align-items: flex-start;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid ${(p) => p.color};
  background: ${(p) => p.bgcolor};
`
const ColorSpan = styled.span<{ color: string }>`
  color: ${(p) => p.color};
`
const ButtonElement = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  translate: -50%;
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  background: #1a1a1a;
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  cursor: pointer;
  :disabled {
    cursor: default;
    opacity: 0.3;
  }
`
const HelperText = styled.div`
  position: absolute;
  top: 620px;
  left: 50%;
  translate: -50%;
  width: 680px;
  height: 60px;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`
const BgSpan = styled.span<{ color: string; bgcolor: string }>`
  color: ${(p) => p.color};
  padding: 0 5px;
  border-radius: 5px;
  background: ${(p) => p.bgcolor};
`
const HandPointer = styled(Player)`
  position: absolute;
  bottom: 50px;
  left: 75px;
  pointer-events: none;
`
const ques = [
  {
    firstShape: 'Square',
    secondShape: 'Circles',
    firstPart: 1,
    secondPart: 6,
    fColor: '#1CB9D9',
    sColor: '#AA5EE0',
    fBg: '#E7FBFF',
    sBg: '#FAF2FF',
  },
  {
    firstShape: 'Circles',
    secondShape: 'Hexagons',
    firstPart: 3,
    secondPart: 4,
    fColor: '#AA5EE0',
    sColor: '#32A66C',
    fBg: '#FAF2FF',
    sBg: '#E5FFEC',
  },
  {
    firstShape: 'Circles',
    secondShape: 'Other Shapes',
    firstPart: 2,
    secondPart: 5,
    fColor: '#AA5EE0',
    sColor: '#646464',
    fBg: '#FAF2FF',
    sBg: '#F6F6F6',
  },
  {
    firstShape: 'Squares',
    secondShape: 'Other Shapes',
    firstPart: 3,
    secondPart: 4,
    fColor: '#1CB9D9',
    sColor: '#646464',
    fBg: '#E7FBFF',
    sBg: '#F6F6F6',
  },
]
export const AppletG06RPC01S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [shapesFilled, setShapesFilled] = useState(0)
  const [choosenShapes, setChoosenShapes] = useState([
    emptyHil,
    empty,
    empty,
    empty,
    empty,
    empty,
    empty,
  ])
  const [quesNum, setQuesNum] = useState(0)
  const [pageNum, setPageNum] = useState(0)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const onShapeClicked = (shape: string) => {
    setShowHandPointer(false)
    playClick()
    onInteraction('tap')
    setChoosenShapes((s) => {
      const sh = [...s]
      sh[shapesFilled] = shape
      if (shapesFilled + 1 < 7) sh[shapesFilled + 1] = emptyHil
      return sh
    })
    setShapesFilled((s) => s + 1)
  }
  const shapes = []
  for (let i = 0; i < 7; i++) {
    shapes.push(
      i < shapesFilled ? (
        <FilledShape
          key={i}
          src={choosenShapes[i]}
          active={pageNum==0}
          onClick={() => {
            if(pageNum>0) return
            playClick()
            onInteraction('tap')
            setChoosenShapes((s) => {
              const sh = s.slice(0, i).concat(s.slice(i + 1))
              if (shapesFilled == 7) sh.push(emptyHil)
              else sh.push(empty)
              return sh
            })
            setShapesFilled((s) => s - 1)
          }}
        />
      ) : (
        <img key={i} src={choosenShapes[i]} />
      ),
    )
  }
  const onNextHandle = () => {
    playClick()
    let sq = 0
    let cir = 0
    let hex = 0
    let os = 0
    switch (pageNum) {
      case 0:
        onInteraction('next')
        switch (quesNum) {
          case 0:
            choosenShapes.forEach((i) => {
              if (i == circle) cir++
              else if (i == square) sq++
              else os++
            })
            if (cir == 6 && sq == 1) setPageNum(2)
            else setPageNum(1)
            break
          case 1:
            choosenShapes.forEach((i) => {
              if (i == circle) cir++
              else if (i == hexagon) hex++
              else os++
            })
            if (cir == 3 && hex == 4) setPageNum(2)
            else setPageNum(1)
            break
          case 2:
            choosenShapes.forEach((i) => {
              if (i == circle) cir++
              else os++
            })
            if (cir == 2 && os == 5) setPageNum(2)
            else setPageNum(1)
            break
          case 3:
            choosenShapes.forEach((i) => {
              if (i == square) sq++
              else os++
            })
            if (sq == 3 && os == 4) setPageNum(2)
            else setPageNum(1)
            break
        }
        break
      case 1:
        onInteraction('previous')
        setChoosenShapes([emptyHil, empty, empty, empty, empty, empty, empty])
        setShapesFilled(0)
        setPageNum(0)
        break
      case 2:
        if (quesNum == 3) {
          onInteraction('reset')
          setQuesNum(0)
          setShowHandPointer(true)
        } else {
          onInteraction('next')
          setQuesNum((q) => q + 1)
        }
        setChoosenShapes([emptyHil, empty, empty, empty, empty, empty, empty])
        setShapesFilled(0)
        setPageNum(0)
        break
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-rpc01-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Model the given ratio using appropriate shapes."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <BGContainer bgColor={pageNum == 1 ? 'red' : pageNum == 2 ? 'green' : ''}>
        <ShapeNames>
          <ColorSpan color={ques[quesNum].fColor}>{ques[quesNum].firstShape}</ColorSpan>
          {' : '}
          <ColorSpan color={ques[quesNum].sColor}>{ques[quesNum].secondShape}</ColorSpan>
        </ShapeNames>
        <Ratios>
          <BrdrSpan color={ques[quesNum].fColor} bgcolor={ques[quesNum].fBg}>
            {ques[quesNum].firstPart}
          </BrdrSpan>
          {' : '}
          <BrdrSpan color={ques[quesNum].sColor} bgcolor={ques[quesNum].sBg}>
            {ques[quesNum].secondPart}
          </BrdrSpan>
        </Ratios>
        <ShapesFiller bgColor={pageNum == 1 ? 'red' : pageNum == 2 ? 'green' : ''}>
          {shapes}
        </ShapesFiller>
      </BGContainer>
      {pageNum == 0 && (
        <ButtonTray>
          <ShapeButton
            onClick={() => onShapeClicked(circle)}
            disabled={shapesFilled < 7 ? false : true}
          >
            <img src={circle} />
          </ShapeButton>
          <ShapeButton
            onClick={() => onShapeClicked(square)}
            disabled={shapesFilled < 7 ? false : true}
          >
            <img src={square} />
          </ShapeButton>
          <ShapeButton
            onClick={() => onShapeClicked(hexagon)}
            disabled={shapesFilled < 7 ? false : true}
          >
            <img src={hexagon} />
          </ShapeButton>
          <ShapeButton
            onClick={() => onShapeClicked(triangle)}
            disabled={shapesFilled < 7 ? false : true}
          >
            <img src={triangle} />
          </ShapeButton>
        </ButtonTray>
      )}
      {pageNum == 1 && (
        <HelperText>
          {quesNum == 0 ? 'Try again! The ratio of ' : 'Uh-oh! Check the ratio of '}
          <BgSpan color={ques[quesNum].fColor} bgcolor={ques[quesNum].fBg}>
            {ques[quesNum].firstShape.toLowerCase()}
          </BgSpan>
          {' to '}
          <BgSpan color={ques[quesNum].sColor} bgcolor={ques[quesNum].sBg}>
            {ques[quesNum].secondShape.toLowerCase()}
          </BgSpan>
          {quesNum == 0 ? 'is not ' : '.'}
          {quesNum == 0 && (
            <BgSpan color={ques[quesNum].fColor} bgcolor={ques[quesNum].fBg}>
              {ques[quesNum].firstPart}
            </BgSpan>
          )}
          {quesNum == 0 && ' : '}
          {quesNum == 0 && (
            <BgSpan color={ques[quesNum].sColor} bgcolor={ques[quesNum].sBg}>
              {ques[quesNum].secondPart}
            </BgSpan>
          )}
          {quesNum == 0 && '.'}
        </HelperText>
      )}
      {pageNum == 2 && (
        <HelperText>
          {quesNum == 0 ? 'Great! The ratio of ' : 'The ratio of '}
          <BgSpan color={ques[quesNum].fColor} bgcolor={ques[quesNum].fBg}>
            {ques[quesNum].firstShape.toLowerCase()}
          </BgSpan>
          {' to '}
          <BgSpan color={ques[quesNum].sColor} bgcolor={ques[quesNum].sBg}>
            {ques[quesNum].secondShape.toLowerCase()}
          </BgSpan>
          {' is '}
          <BgSpan color={ques[quesNum].fColor} bgcolor={ques[quesNum].fBg}>
            {ques[quesNum].firstPart}
          </BgSpan>
          {' : '}
          <BgSpan color={ques[quesNum].sColor} bgcolor={ques[quesNum].sBg}>
            {ques[quesNum].secondPart}
          </BgSpan>
          {quesNum == 0 ? '.' : '. Keep going!'}
        </HelperText>
      )}
      {showHandPointer && <HandPointer src={click} autoplay loop />}
      <ButtonElement disabled={shapesFilled == 7 ? false : true} onClick={onNextHandle}>
        {pageNum == 0 && 'Check'}
        {pageNum == 1 && <img src={retry} />}
        {pageNum == 2 && (quesNum == 3 ? <img src={tryNew} /> : 'Next')}
      </ButtonElement>
    </AppletContainer>
  )
}
