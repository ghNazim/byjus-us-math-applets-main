export interface AlgebraicGridZoneProps {
  selected: boolean
  xMax?: number
  constantMax?: number
  zoneStatus: (status: Array<boolean>) => void
  xCoeffValue: number
  constantValue: number
  className?: string
}
