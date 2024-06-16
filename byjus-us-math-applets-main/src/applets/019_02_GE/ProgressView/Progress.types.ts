export interface ProgressProps {
  noOfPages: number
  activePageNo: number
  onChange?: (newPageNo: number) => void
}
