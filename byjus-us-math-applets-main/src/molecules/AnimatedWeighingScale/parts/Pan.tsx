import type { SVGProps } from 'react'
export const Pan = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={199} height={87} fill="none" {...props}>
    <path
      fill="#747273"
      d="M179.407 31.81H18.621c-7.81 0-14.207-19.218-14.207-27.029h189.192c0 7.81-6.388 27.029-14.208 27.029h.009Z"
    />
    <path
      fill="#9C9A9B"
      d="M1.894 4.782h194.238a1.899 1.899 0 0 0 1.894-1.894 1.899 1.899 0 0 0-1.894-1.894H1.894A1.899 1.899 0 0 0 0 2.888C0 3.93.852 4.782 1.894 4.782Z"
    />
    <path
      fill="#000"
      d="M193.188 8.995c.271-1.595.425-3.036.425-4.214H4.422c0 1.178.145 2.619.426 4.214h188.349-.009Z"
      opacity={0.1}
    />
    <path fill="#B6B5B5" d="M95.582 86.166h19.027V31.801H95.582v54.365Z" />
    <path fill="#000" d="M95.582 36.331h19.027v-4.53H95.582v4.53Z" opacity={0.1} />
    <path fill="#58595B" d="M101.617 79.679a3.48 3.48 0 1 0 3.48-3.48 3.48 3.48 0 0 0-3.48 3.48Z" />
  </svg>
)
