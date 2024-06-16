import React from 'react'
import styled from 'styled-components'

const Icon = styled.svg`
  translate: 0% -40%;
  margin-left: -60px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`

export const ThumbIcon: React.FC = () => (
  <>
    <Icon width="69" height="61" viewBox="0 0 69 61" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="63.5486" cy="30" r="5" fill="#1A1A1A" />
      <circle cx="22" cy="30.4514" r="22" transform="rotate(90 22 30.4514)" fill="#1A1A1A" />
      <circle cx="22" cy="30.4514" r="20" transform="rotate(90 22 30.4514)" fill="white" />
      <circle cx="22" cy="30.4514" r="14" transform="rotate(90 22 30.4514)" fill="#1A1A1A" />
      <path
        d="M57.6708 29.6072C58.2893 30 58.2893 30.9027 57.6708 31.2955L46.9155 38.126C46.0696 38.6632 45.0472 37.7608 45.4752 36.8548L48.2982 30.8784C48.426 30.608 48.426 30.2946 48.2982 30.0242L45.4752 24.0479C45.0472 23.1418 46.0696 22.2394 46.9155 22.7766L57.6708 29.6072Z"
        fill="#1A1A1A"
      />
    </Icon>
  </>
)
