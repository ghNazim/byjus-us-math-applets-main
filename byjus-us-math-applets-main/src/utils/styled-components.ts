import { css } from 'styled-components'

export const nthChildVariable = (n: number) =>
  css`
    --nth-child: ${n};
  `
export const rangeNthChildVariables = (n: number) =>
  Array.from({ length: n }, (_, i) => nthChildVariable(i + 1)).join('\n')
