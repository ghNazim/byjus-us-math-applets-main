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
    step: 1,
    totalCubes: 10,
    options: ['0.5 cg', '1 g', '1 cg'],
    correctIndex: 3,
  },
  {
    index: 1,
    src: Cube455,
    duration: 5,
    step: 10,
    totalCubes: 100,
    options: ['1 g', '1 dg', '5 cg'],
    correctIndex: 2,
  },
  {
    index: 2,
    src: Cube544,
    duration: 3,
    step: 5,
    totalCubes: 80,
    options: ['8 cg', '8 g', '80 cg'],
    correctIndex: 1,
  },
  {
    index: 3,
    src: Cube111,
    duration: 45,
    step: 50,
    totalCubes: 1000,
    options: ['1 g', '100 mg', '10 g'],
    correctIndex: 1,
  },
]
