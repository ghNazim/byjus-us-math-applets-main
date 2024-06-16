import { animated, useChain, useSpring, useSpringRef } from '@react-spring/web'
import { FC } from 'react'

import { Cell, CellText, Row, VLine } from './ExponentTable.styles'
import { InteractiveRowProps } from './ExponentTable.types'

export const InteractiveRow: FC<InteractiveRowProps> = ({
  simplify = false,
  isActive = false,
  isLastColumnActive = false,
  valueCell: ValueCell,
  expandedCell: ExpandedCell,
  finalCell: FinalCell,
  ...values
}) => {
  const showExpandSpring = useSpringRef()
  const expandSpring = useSpringRef()
  const showFinalSpring = useSpringRef()

  const showExpandStyle = useSpring({
    ref: showExpandSpring,
    from: { opacity: 0 },
    to: { opacity: 1 },
  })
  const showFinalStyle = useSpring({
    ref: showFinalSpring,
    from: { opacity: 0 },
    to: { opacity: 1 },
  })

  useChain(simplify ? [showExpandSpring, expandSpring, showFinalSpring] : [])

  return (
    <Row isActive={isActive}>
      <Cell>
        <ValueCell {...values} />
      </Cell>
      <VLine />
      <Cell>
        {simplify && (
          <animated.div style={showExpandStyle}>
            <ExpandedCell {...values} springRef={expandSpring} />
          </animated.div>
        )}
      </Cell>
      <VLine />
      <Cell isActive={isLastColumnActive}>
        {simplify && (
          <animated.div style={showFinalStyle}>
            <CellText>
              <FinalCell {...values} showFull={isLastColumnActive} />
            </CellText>
          </animated.div>
        )}
      </Cell>
    </Row>
  )
}
