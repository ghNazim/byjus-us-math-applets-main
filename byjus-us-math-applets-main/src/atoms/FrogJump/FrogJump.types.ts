export interface Position {
  top: number
  left: number
}

export interface FrogJumpRef {
  jumpTo(target: Position, from?: Position): void
}

export interface FrogJumpProps {
  duration?: number
  height?: number
  onJumpComplete?: () => void
  className?: string
}
