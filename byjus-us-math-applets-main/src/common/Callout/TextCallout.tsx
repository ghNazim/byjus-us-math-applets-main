import React from 'react'
import styled from 'styled-components'

import { preventOrphan } from '../../utils/string'
import { Callout } from './Callout'
import { TextCalloutProps } from './Callout.types'

const Text = styled.p`
  color: #444;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  max-width: 600px;
  text-align: left !important;
`

export const TextCallout: React.FC<TextCalloutProps> = ({ text, ...args }) => (
  <Callout
    elements={
      Array.isArray(text) ? (
        text.map((t, i) => <Text key={i}>{preventOrphan(t)}</Text>)
      ) : (
        <Text>{preventOrphan(text)}</Text>
      )
    }
    {...args}
  />
)
