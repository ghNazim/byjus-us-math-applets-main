import React from 'react'
import styled from 'styled-components'

import { ProgressProps } from './Progress.types'

const PlaceProgress = styled.div`
  background-color: rgba(127, 92, 244, 1);
  height: 8px;
  width: 8px;
  border-radius: 50%;
  transition: 0.3s;
  &.inactive {
    background-color: #ececec;
  }
  &.active_black {
    background-color: #444444;
  }
  &.active {
    height: 12px;
    width: 12px;
    background-color: #7f5cf4;
    transition: 0.5s;
  }
`
const GroupProgress = styled.div`
  /* position: absolute;
  bottom: 113px;
  left: 310px; */
  height: 20px;
  width: 720px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 692px;
`
export const Progress: React.FC<ProgressProps> = ({ noOfPages, activePageNo }) => {
  const child = []
  for (let i = 0; i < noOfPages; i++) {
    child.push(
      <PlaceProgress
        className={`${i <= activePageNo ? 'active_black' : 'inactive'} ${
          i == activePageNo ? 'active' : ''
        }`}
      />,
    )
  }

  return <GroupProgress>{child}</GroupProgress>
}
