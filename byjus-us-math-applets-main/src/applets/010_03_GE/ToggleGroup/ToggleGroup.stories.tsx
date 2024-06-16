import React from 'react'

import Toggle from '../Toggle/Toggle'
import ToggleGroup from './ToggleGroup'

export default {
  title: 'ToggleGroup',
  component: ToggleGroup,
}

export const WithBar = () => <ToggleGroup noOfChildren={6} />
