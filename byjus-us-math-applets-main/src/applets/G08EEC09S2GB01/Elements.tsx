import { HighLight, orangeBlock, purpleBlock } from '../G08EEC09S2GB01/Elements/Elements'

const pointText = (
  <HighLight box={true} colorBlock={purpleBlock}>
    point
  </HighLight>
)

const slopeText = (
  <HighLight box={true} colorBlock={orangeBlock}>
    slope
  </HighLight>
)

const riseText = (
  <HighLight box={true} colorBlock={orangeBlock}>
    rise
  </HighLight>
)

const runText = (
  <HighLight box={true} colorBlock={orangeBlock}>
    run
  </HighLight>
)

export const textHolder = [
  <>To plot the line, find the other point using {slopeText}</>,
  <>Enter the {pointText} value</>, //1 -- useless
  <>Let’s give it another shot!</>, //2 -- uselsess
  <>To plot the line, find the other point using {slopeText}</>, //3
  <>
    Enter the {riseText} and {runText} value
  </>, //4
  <>Let’s give it another shot!</>,
  <>Bravo! Now, let’s plot the line.</>,

  <>Find the given {pointText} on the graph and move your pointer.</>, //5
  <>Oops! The pointer isn’t at the {pointText}. Let&apos;s correct that</>,
  <>Perfect! Let’s now move to the second point. </>, //6
  <>
    Now, use {riseText} and {runText} to find second point and move your pointer.
  </>, //7
  <>
    Oops! That’s incorrect. Use {riseText} and {runText} to find second point.
  </>,
  <>Perfect! The second point is set correctly.</>,
  <>Now, generate line between these two points.</>,
  <>Brilliant work! You’ve successfully plotted the line.</>,
  <>Brilliant work! You’ve successfully plotted the line.</>,
]
