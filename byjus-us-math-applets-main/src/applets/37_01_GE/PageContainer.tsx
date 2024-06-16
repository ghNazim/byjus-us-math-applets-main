import { Children, ReactNode } from 'react'
import styled from 'styled-components'

const PageConatiner = styled.div`
  position: absolute;
  width: 665px;
  height: 200px;
  left: 27px;
  top: 498px;
  background: #e7fbff;
  border-radius: 5px;
`
export const PagePalette: React.FC<{
  children: ReactNode
  childrenPerPage: number
}> = ({ children, childrenPerPage }) => {
  return <>{/* <PageConatiner>{Children.map(children, (child, index) => {})}</PageConatiner> */}</>
}
