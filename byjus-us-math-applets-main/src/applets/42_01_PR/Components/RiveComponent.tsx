import { Player } from '@lottiefiles/react-lottie-player'
import { StateMachineInput, useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import HandAnimation from '../../../common/handAnimations/click.json'
import shapeAnimations from '../Assets/42_01_PR_v6.riv'

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9.78947px 13.0526px;
  color: #7f5cf4;
  position: absolute;
  height: 39.58px;
  left: 72px;
  top: 118px;
  border: 1.63158px solid #7f5cf4;
  border-radius: 8.15789px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    color: white;
    background-color: #7f5cf4;
  }
`

const RiveHolder = styled.div`
  position: absolute;
  width: 573px;
  height: 400px;
  top: 167px;
  left: 72px;
  border-radius: 15px;
  border: 1px solid #c7c7c7;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`
const AnimOnBoarding = styled(Player)`
  position: absolute;
  top: 90px;
  left: 40px;
  pointer-events: none;
`

// interface RiveComponentProps {
//   id: number
//   visibility: boolean
// }

interface RiveComponentProps {
  NAME: string
}

const STATE_MACHINE_NAME = 'shape_01'

const ARTBOARD_NAME = '42_01_PR'

const RiveComponent = (STATE_MACHINE_NAME: RiveComponentProps) => {
  const [shapeDivided, setShapeDivided] = useState(false)
  const playMouseClick = useSFX('mouseClick')

  const { rive, RiveComponent } = useRive({
    src: shapeAnimations,
    stateMachines: STATE_MACHINE_NAME.NAME,
    autoplay: true,
    artboard: ARTBOARD_NAME,
  })

  const [onBoardAnim, setOnBoardAnim] = useState(true)

  const splitShape: StateMachineInput | null = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME.NAME,
    'splitShape',
  )

  const combineShape: StateMachineInput | null = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME.NAME,
    'combineShape',
  )

  const ToggleShapeAnimation = () => {
    playMouseClick()

    if (onBoardAnim) setOnBoardAnim(false)
    if (shapeDivided) {
      combineShape && combineShape.fire()
    } else {
      splitShape && splitShape.fire()
    }
    setShapeDivided(!shapeDivided)
  }

  // useEffect(() => {
  //   switch (id) {
  //     case 1:
  //       shape1 && shape1.fire()
  //       break
  //     case 2:
  //       shape2 && shape2.fire()
  //       break
  //     case 3:
  //       shape3 && shape3.fire()
  //       break
  //     case 4:
  //       shape4 && shape4.fire()
  //       break
  //     case 5:
  //       shape5 && shape5.fire()
  //       break
  //     default:
  //       break
  //   }
  // }, [shape1, shape2, shape3, shape4, shape5, isLoaded, visibility])

  return (
    <div>
      <RiveHolder>
        <RiveComponent
          style={{
            height: '600px',
          }}
        />
      </RiveHolder>
      <Button onClick={ToggleShapeAnimation}>
        {shapeDivided ? 'Combine the solids' : 'Divide the solid'}
      </Button>
      {onBoardAnim && <AnimOnBoarding src={HandAnimation} loop autoplay />}
    </div>
  )
}

export default RiveComponent
