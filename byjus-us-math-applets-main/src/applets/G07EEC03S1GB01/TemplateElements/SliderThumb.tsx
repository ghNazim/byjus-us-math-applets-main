import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
const Icon = styled.svg`
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`

export const SliderThumb: React.FC<{ onGrab: MouseEventHandler }> = ({ onGrab }) => (
  <>
    <Icon
      onMouseDown={onGrab}
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16.6104" cy="16" r="16" fill="#7F5CF4" />
      <circle cx="16.6101" cy="16" r="10.1609" fill="white" />
    </Icon>
  </>
)
