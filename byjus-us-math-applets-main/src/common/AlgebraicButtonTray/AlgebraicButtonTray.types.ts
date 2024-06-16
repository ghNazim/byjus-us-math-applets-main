export interface AlgebraicButtonTrayProps {
  buttonDisableStatus: Array<boolean>
  buttonDisplayStatus?: Array<boolean>
  onXClick?: (value: number) => void
  onOneClick?: (value: number) => void
}
