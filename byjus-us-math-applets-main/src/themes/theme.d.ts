import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    default: string
    hover: string
    disabled: string
    clicked: string
    color: string
    stroke: string
    sliderColor: string
    trackColor: string
    thumbColor: string
    sliderBtnColor: string
  }
}
