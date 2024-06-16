import type { SVGProps } from 'react'
export const BarPivot = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} fill="none" {...props}>
    <circle cx={18} cy={18} r={18} fill="#918F90" />
    <circle cx={18} cy={18} r={6} fill="#58595B" />
  </svg>
)
