import { createRequires, createUseRemoteComponent } from '@paciolan/remote-component'
import react from 'react'
import ReactDOM from 'react-dom'
import * as styled from 'styled-components'

import { getAppletData } from '@/utils/aws-s3'

const resolve = {
  react,
  'react-dom': ReactDOM,
  'styled-components': styled,
}

// @ts-expect-error
const requires = createRequires(resolve)
export const useRemoteComponent = createUseRemoteComponent({ requires, fetcher: getAppletData })
