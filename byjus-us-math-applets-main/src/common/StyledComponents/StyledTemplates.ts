import { css } from 'styled-components'

export const AbsolutePosition = css<{ left?: number; top?: number }>`
  position: absolute;
  top: ${(a) => (a.top ? a.top : 0)}px;
  left: ${(a) => (a.left ? a.left : 0)}px;
`

export const WidthFull = css`
  width: 100%;
`
export const DisplayFlexJutifyAlignCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`
export const SpecifyWidthHeight = css<{ width: number; height: number }>`
  width: ${(a) => a.width}px;
  height: ${(a) => a.height}px;
`
export const SpecifyBackground = css<{ background: string }>`
  background: ${(a) => a.background};
`
