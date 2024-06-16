import { ReactNode } from 'react'

export interface PanProps {
  static: boolean
  panObject: string | ReactNode
  panText: number
  // colorBlock: ColorBlock // remove if not needed
  bgColor: string
  borderColor: string
  textColor: string
}
type CreateArrayWithLengthX<
  LENGTH extends number,
  ACC extends unknown[] = [],
> = ACC['length'] extends LENGTH ? ACC : CreateArrayWithLengthX<LENGTH, [...ACC, 1]>

type NumericRange<
  START_ARR extends number[],
  END extends number,
  ACC extends number = never,
> = START_ARR['length'] extends END
  ? ACC | END
  : NumericRange<[...START_ARR, 1], END, ACC | START_ARR['length']>

export interface WeighingScaleProps {
  leftPanProp: PanProps
  leftPanText: number
  rightPanProp: PanProps
  rightPanText: number
  correctFeedback: boolean
  comparisonType?: 'lt-gt' | 'inequal'
  scalePrecision: NumericRange<CreateArrayWithLengthX<1>, 20>
  sliderValues: {
    a: NumericRange<CreateArrayWithLengthX<10>, 30>
    b: NumericRange<CreateArrayWithLengthX<10>, 30>
  }
  scaleAnimation: boolean
}
