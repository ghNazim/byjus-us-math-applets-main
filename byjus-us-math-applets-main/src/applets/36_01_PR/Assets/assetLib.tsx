import Cube251 from './Cube_200X500X100.mp4'
import Cube455 from './Cube_400X500X500.mp4'
import Cube544 from './Cube_500X400X400.mp4'
import Cube111 from './Cube_1000X1000.mp4'

interface QnFormat {
  index: number
  src: string
  duration: number
  step: number
  totalCubes: number
  options: string[]
  correctIndex: number
}

export const QnModels: QnFormat[] = [
  {
    index: 0,
    src: Cube251,
    duration: 1,
    step: 2,
    totalCubes: 10,
    options: ['0.625 pound', '0.6 ton', '6 pounds'],
    correctIndex: 1,
  },
  {
    index: 1,
    src: Cube455,
    duration: 5,
    step: 10,
    totalCubes: 100,
    options: ['6.25 tons', '6.25 pounds', '0.3125 ton'],
    correctIndex: 2,
  },
  {
    index: 2,
    src: Cube544,
    duration: 3,
    step: 10,
    totalCubes: 80,
    options: ['0.0025 ton', '50 pounds', '0.5 pound'],
    correctIndex: 1,
  },
  {
    index: 3,
    src: Cube111,
    duration: 45,
    step: 50,
    totalCubes: 1000,
    options: ['5 pounds', '3.125 pounds', '0.03125 tons'],
    correctIndex: 3,
  },
]
