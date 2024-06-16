import React from 'react'
import styled from 'styled-components'

import { PointProps } from './Point.types'

const PointContainer = styled.div<{
  leftOffset: number
  topOffset: number
  pointDisabled: any
}>`
  position: absolute;
  left: ${(props) => props.leftOffset}px;
  top: ${(props) => props.topOffset}px;
  translate: -53% -45%;
  pointer-events: none;
  filter: grayscale(
    ${(props) => {
      if (props.pointDisabled) return 1
      else return 0.5
    }}
  );
`

export const Point: React.FC<PointProps> = ({
  color,
  leftOffset,
  topOffset,
  pointlocatorsDisabled,
}) => {
  return (
    <PointContainer
      leftOffset={leftOffset}
      topOffset={topOffset}
      pointDisabled={pointlocatorsDisabled}
      data-testid="Point"
      className="foo-bar"
    >
      <svg
        width="67"
        height="33"
        viewBox="0 0 67 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M57.1784 7.86383C57.544 7.42222 58.179 7.37747 58.5968 7.76388L66.5521 15.1214C67.0556 15.587 67.0556 16.4149 66.5521 16.8805L58.5968 24.2381C58.179 24.6245 57.544 24.5797 57.1784 24.1381C56.8128 23.6965 56.8552 23.0253 57.273 22.6389L64.4501 16.001L57.273 9.3631C56.8552 8.97669 56.8128 8.30544 57.1784 7.86383Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.68 7.86383C10.3144 7.42222 9.67935 7.37747 9.26155 7.76388L1.30631 15.1214C0.80284 15.587 0.802847 16.4149 1.30631 16.8805L9.26155 24.2381C9.67935 24.6245 10.3144 24.5797 10.68 24.1381C11.0456 23.6965 11.0032 23.0253 10.5854 22.6389L3.4083 16.001L10.5854 9.3631C11.0032 8.97669 11.0456 8.30544 10.68 7.86383Z"
          fill={color}
        />
        <circle cx="33.9287" cy="16.501" r="16" fill="white" />
        <circle cx="34.4287" cy="16.001" r="11.5" fill={color} />
      </svg>
    </PointContainer>
  )
}
