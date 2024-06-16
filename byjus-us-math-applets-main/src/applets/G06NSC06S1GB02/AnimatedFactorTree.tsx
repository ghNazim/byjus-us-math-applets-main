import { FC, useMemo, useState } from 'react'
import styled from 'styled-components'

import { FactorTree } from '@/atoms/FactorTree'
import { FactorTreeProps, FactorTreeThemeType } from '@/atoms/FactorTree/FactorTree.types'
import { useInterval } from '@/hooks/useInterval'
import { expandedPrimeFactors, getPrimeFactors } from '@/utils/math'

const FacorTreeStyled = styled(FactorTree)`
  /* position: relative; */
  /* border: 1px solid black; */
  width: 100%;
  height: 100%;
  padding: 0;
  transform: translateX(-10%);
  /* scale: 1.3; */
`

const NullComp = () => null

export const AnimatedFactorTree: FC<
  Pick<FactorTreeProps, 'value'> & { themeProps?: FactorTreeThemeType }
> = ({ value, themeProps }) => {
  const primeFactors = useMemo(() => expandedPrimeFactors(value), [value])
  const [input, setInput] = useState<Array<number>>([])
  const [isComplete, setComplete] = useState(false)

  useInterval(
    () => {
      setInput((curr) => {
        return primeFactors.slice(0, curr.length + 1)
      })
    },
    isComplete ? null : 250,
  )

  return (
    <>
      <FacorTreeStyled
        value={value}
        inputComponentLeft={NullComp}
        inputComponentRight={NullComp}
        inputFactors={input}
        onComplete={setComplete}
        width={460}
        height={500}
        themeProps={themeProps}
      />
    </>
  )
}
