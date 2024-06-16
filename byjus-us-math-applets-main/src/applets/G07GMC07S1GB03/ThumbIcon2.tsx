import React from 'react'
import styled from 'styled-components'

const Icon = styled.svg`
  translate: 50%;
  margin-left: -60px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`

export const ThumbIconTwo: React.FC = () => (
  <>
    <Icon width="61" height="70" viewBox="0 0 61 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30.0879" cy="47.9121" r="22" fill="#1A1A1A" />
      <circle cx="30.0879" cy="47.9121" r="20" fill="white" />
      <circle cx="30.0879" cy="47.9121" r="14" fill="#1A1A1A" />
      <path
        d="M29.2437 12.2413C29.6365 11.6228 30.5391 11.6228 30.932 12.2413L37.7625 22.9966C38.2997 23.8425 37.3973 24.8649 36.4912 24.437L30.5149 21.6139C30.2445 21.4861 29.9311 21.4861 29.6607 21.6139L23.6844 24.437C22.7783 24.8649 21.8759 23.8425 22.4131 22.9967L29.2437 12.2413Z"
        fill="#1A1A1A"
      />
      <circle
        cx="30.2397"
        cy="5.52271"
        r="5"
        transform="rotate(-90 30.2397 5.52271)"
        fill="#1A1A1A"
      />
    </Icon>
  </>
)
