import { css } from 'styled-components'

export const styleReset = css`
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;

  .katex {
    font-family: 'Nunito', sans-serif;
    font-size: 1em;
    .mathdefault,
    .mathnormal,
    .mord {
      font-family: 'Nunito', sans-serif;
      font-weight: 500;
    }

    .mathbf {
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
    }

    .katex-html {
      overflow-wrap: normal;
    }

    .mord {
      display: inline-block;
    }
  }
  * {
    box-sizing: border-box;
  }
`
