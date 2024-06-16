import { DefaultTheme } from 'styled-components'

export const palette = {
  dark: {
    default: '#1a1a1a',
    hover: '#1a1a1a99',
    disabled: '#c7c7c7',
    clicked: '#1a1a1a',
    color: '#1a1a1a',
    stroke: '#1a1a1a',
    sliderColor: '#C7C7C7',
    trackColor: '#1a1a1a',
    thumbColor: '#2C2C2C',
    sliderBtnColor: '#1a1a1a',
  },
  purple: {
    default: '#8C69FF',
    hover: '#7F5CF4',
    disabled: '#8C69FF20',
    clicked: '#7F5CF4',
    color: '#8C69FF',
    stroke: '#8C69FF',
    sliderColor: '#D9CDFF',
    trackColor: '#7F5CF4',
    thumbColor: '#7F5CF4',
    sliderBtnColor: '#7F5CF4',
  },
} satisfies Record<string, DefaultTheme>
