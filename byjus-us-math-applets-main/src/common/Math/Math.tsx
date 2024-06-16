import 'katex/dist/katex.min.css'

import KaTeX from 'katex'
import React, { useMemo } from 'react'

import { MathProps } from './Math.types'

export const Math: React.FC<MathProps> = ({
  children,
  displayMode = false,
  throwOnError = false,
  errorColor = '#cc0000',
}) => {
  const { html, error } = useMemo(() => {
    try {
      const html = KaTeX.renderToString(children, {
        displayMode,
        errorColor,
        throwOnError,
        trust: true,
      })

      return { html, error: undefined }
    } catch (error) {
      if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
        return { error }
      }

      throw error
    }
  }, [children, displayMode, errorColor, throwOnError])

  return (
    <>
      {displayMode ? (
        <div
          data-testid="Math"
          dangerouslySetInnerHTML={{ __html: error ? `${error.message}` : html }}
        />
      ) : (
        <span
          data-testid="Math"
          dangerouslySetInnerHTML={{ __html: error ? `${error.message}` : html }}
        />
      )}
    </>
  )
}
