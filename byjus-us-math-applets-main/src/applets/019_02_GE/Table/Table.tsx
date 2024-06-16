import * as React from 'react'
import styled, { keyframes } from 'styled-components'

import { Math } from '../../../common/Math'
import { TableProps } from './Table.types'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const PlaceTable = styled.table<{ rowLength: number; visible: boolean }>`
  box-sizing: border-box;
  background-color: rgba(199, 199, 199, 1);
  color: white;
  font-size: 20px;
  display: flex;
  text-align: center;
  border-radius: 4px;
  height: ${(props) => 62.3 * props.rowLength + 62.3}px;
  transition: 0.3s;
  opacity: ${(props) => (props.visible ? 1 : 0)};

  .commonBox {
    height: 60px !important;
    width: 120px !important;
    transition: 0.3s;
  }
  .tableHead {
    background-color: #c882fa;
    border-radius: 4px;
  }
  .tableRow {
    height: 60px !important;
    width: 120px !important;
    background-color: white;
    color: #1a1919;
  }
  .active {
    height: 60px !important;
    width: 120px !important;
    background-color: #faf2ff;
    color: black;

    .katex {
      .mathdefault,
      .mathnormal,
      .mord {
        font-family: 'Nunito', sans-serif !important;
      }
    }

    animation-duration: 500ms;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: both;
    animation-play-state: running;

    animation-name: ${fadeIn};
  }
`

export const Table: React.FC<TableProps> = ({ rows, activeRow, visible = true }) => {
  return (
    <PlaceTable visible={visible} rowLength={rows.length}>
      <tbody>
        <tr>
          {Object.keys(rows[0]).map((key, i) => (
            <th key={i} className="commonBox tableHead">
              {key}
            </th>
          ))}
        </tr>
        {rows.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((ele, j) => (
              <td key={j} className={`tableRow ${i === activeRow ? 'active' : ''}`}>
                <Math>{ele}</Math>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </PlaceTable>
  )
}
