import { FC } from 'react'
import styled from 'styled-components'

export interface TableData {
  [key: string]: number | string
}
export interface TableProps {
  slope: number
  yIntercept: number
}

const TableContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  font-size: 15px;
`

const StyledTable = styled.table`
  width: 80%;
  border-collapse: collapse;
  /* position: absolute; */
`

const TableHeader = styled.thead`
  padding: 10px 10px;
  padding-bottom: 0px;
`

const StyledRow = styled.tr`
  padding: 13px;
`

const StyledHeader = styled.th`
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  text-align: center;
  max-width: 30px;
`
const StyledCell = styled.td`
  padding: 5px;
  border: 1px solid #ddd;
  text-align: left;
  max-width: 30px;
  text-align: center;
`

const Table: FC<TableProps> = ({ slope, yIntercept }) => {
  const heading = [
    'x',
    `y = ${slope === 1 ? '' : slope}${slope !== 0 ? 'x' : ''}`,
    `y = ${slope === 1 ? '' : slope === 0 ? yIntercept : slope + 'x + ' + yIntercept}`,
    'Change in y',
  ]
  const body = () => {
    const rows = []
    for (let i = 1; i < 4; i++) {
      rows.push([
        `${i}`,
        `${parseFloat((slope * i).toFixed(2))}`,
        `${parseFloat((slope * i + yIntercept).toFixed(2))}`,
        `${parseFloat(yIntercept.toFixed(2))}`,
      ])
    }
    return rows
  }

  return (
    <TableContainer>
      <StyledTable>
        <TableHeader>
          <StyledRow>
            {heading &&
              heading.map((heading, index) => <StyledHeader key={index}>{heading}</StyledHeader>)}
          </StyledRow>
        </TableHeader>
        <tbody>
          {body().map((rows, index) => (
            <StyledRow key={index}>
              {rows.map((row, i) => (
                <StyledCell key={i}>{row}</StyledCell>
              ))}
            </StyledRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  )
}

export default Table
