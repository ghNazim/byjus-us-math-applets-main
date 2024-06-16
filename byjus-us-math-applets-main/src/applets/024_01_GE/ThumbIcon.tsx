import React from 'react'
import styled from 'styled-components'
const Icon = styled.svg`
  margin-bottom: -22px;
  margin-left: -15px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`

const DottedLine = styled.svg`
  position: absolute;
  top: 22px;
  right: 45px;
`

export const ThumbIcon: React.FC = () => (
  <>
    <Icon width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.1748 25.407C3.1748 24.2523 3.1748 21.3655 5.1748 20.2108L28.9411 6.48937C30.9411 5.33467 33.4411 6.77805 33.4411 9.08745L33.4411 36.5304C33.4411 38.8398 30.9411 40.2831 28.9411 39.1284L5.1748 25.407Z"
        fill="#2AD3F5"
      />
      <path
        d="M14.0909 25.407C12.0909 24.2523 12.0909 21.3655 14.0909 20.2108L23.1458 14.983C25.1458 13.8283 27.6458 15.2716 27.6458 17.581L27.6458 28.0367C27.6458 30.3461 25.1458 31.7895 23.1458 30.6348L14.0909 25.407Z"
        fill="white"
      />
    </Icon>
    <DottedLine
      width="311"
      height="45"
      viewBox="0 0 311 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="310.916"
        y1="0.863037"
        x2="0.639587"
        y2="0.86301"
        stroke="#646464"
        stroke-dasharray="2 2"
      />
    </DottedLine>
  </>
)
