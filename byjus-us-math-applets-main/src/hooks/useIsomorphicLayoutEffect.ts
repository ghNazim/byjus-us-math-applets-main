import { useEffect, useLayoutEffect } from 'react'

import { isBrowser } from '@/utils/types'

export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect
