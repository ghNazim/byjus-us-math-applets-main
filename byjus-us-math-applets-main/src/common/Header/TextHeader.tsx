import React from 'react'
import styled from 'styled-components'

import { preventOrphan } from '../../utils/string'
import { Header } from './Header'
import { TextHeaderProps } from './Header.types'
const Text = styled.p`
  color: #444;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  max-width: 600px;
  min-height: 40px;
  text-align: center !important;
`

export const TextHeader: React.FC<TextHeaderProps> = ({ text, ...args }) => (
  <Header {...args}>
    <Text>{preventOrphan(text)}</Text>
  </Header>
)
