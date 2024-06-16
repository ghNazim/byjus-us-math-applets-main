import React from 'react'

interface PlayIconProps {
  className?: string
}

export const PlayIcon: React.FC<PlayIconProps> = ({ className }) => (
  <svg
    width={44}
    height={44}
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle id="primary" cx={22} cy={22} r={20.167} />
    <path
      d="M28.02 21.159a1 1 0 0 1 0 1.683l-9.522 6.109a1 1 0 0 1-1.54-.842V15.891a1 1 0 0 1 1.54-.841l9.523 6.108Z"
      fill="#fff"
    />
  </svg>
)

interface PauseIconProps {
  className?: string
}

export const PauseIcon: React.FC<PauseIconProps> = ({ className }) => (
  <svg
    width={44}
    height={44}
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle id="secondary" cx={22} cy={22.5} r={20.167} />
    <path
      id="primary"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.334 15a1.833 1.833 0 0 0-3.667 0v15a1.833 1.833 0 1 0 3.667 0V15Zm11 0a1.833 1.833 0 0 0-3.667 0v15a1.833 1.833 0 1 0 3.667 0V15Z"
    />
  </svg>
)

interface ReplayIconProps {
  className?: string
}
export const ReplayIcon: React.FC<ReplayIconProps> = ({ className }) => (
  <svg
    width={44}
    height={44}
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle id="secondary" cx={22} cy={22} r={20.167} />
    <path
      id="primary"
      fillRule="evenodd"
      clipRule="evenodd"
      d="m29.26 14.746-3.833 3.834h9.61V8.97l-3.946 3.945a12.985 12.985 0 1 0 3.777 10.537l-2.576-.262a10.397 10.397 0 1 1-3.031-8.444Z"
    />
  </svg>
)
