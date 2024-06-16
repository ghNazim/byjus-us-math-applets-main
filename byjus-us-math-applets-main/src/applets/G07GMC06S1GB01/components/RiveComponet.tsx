import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { FC } from 'react'

import { useSFX } from '@/hooks/useSFX'

import RiveAnimation from '../assets/G07GMC06S1GB01CreatingCompositeShapesRive.riv'
interface RiveComponetProps {
  stateMachineName: string
  textIndicatorForFinished: string
  finished: () => void
  firstComponenMoved?: () => void
}

const RiveComponet: FC<RiveComponetProps> = ({
  textIndicatorForFinished,
  stateMachineName,
  finished,
  firstComponenMoved,
}) => {
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playCorrectAnswer = useSFX('correct')

  const { RiveComponent, rive } = useRive({
    src: RiveAnimation,
    stateMachines: stateMachineName,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
    onStateChange: (state) => {
      if (state.data?.toString().slice(-7) === 'Pressed') {
        //state ends with Pressed
        playMouseIn()
        //yo hide onboarding
        firstComponenMoved ? firstComponenMoved() : null
      } else if (state.data?.toString().slice(-5) === 'Start') {
        //state ends with Start
        playMouseOut()
      }

      if (state.data?.toString() === textIndicatorForFinished) {
        rive?.cleanup()
        finished()
        playCorrectAnswer()
      }
    },
  })
  return <RiveComponent />
}

export default RiveComponet
