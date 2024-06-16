import { FC, useContext } from 'react'
import { ThemeContext } from 'styled-components'

export const IconMinus: FC = () => {
  const { color } = useContext(ThemeContext)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 18 4"
    >
      <path fill={color} d="M7.93 3.05H.667V.774H7.81h-.06 9.584l.06 2.278H7.93Z" />
    </svg>
  )
}

export const IconPlus: FC = () => {
  const { color } = useContext(ThemeContext)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 18 17"
    >
      <path
        fill={color}
        d="M7.81 16.883V10.05H.667V7.773H7.81V.94h2.381v6.833h7.143v2.277h-7.143v6.832h-2.38Z"
      />
    </svg>
  )
}
