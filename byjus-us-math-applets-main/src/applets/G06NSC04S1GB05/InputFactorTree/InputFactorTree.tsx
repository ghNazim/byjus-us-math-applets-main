import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import styled from 'styled-components'

import { getFactors, getPrimeFactors } from '@/utils/math'

import { Tree } from '../../../atoms/Tree'
import { TreeRef } from '../../../atoms/Tree/Tree.types'
import { InputFactorTreeProps, InputFactorTreeRef } from './InputFactorTree.types'

const ROOT_KEY = 'root'
const INPUT_KEY = 'input'
const DUMMY_KEY = 'dummy'

function constructVertices(root: number, input: Array<number>) {
  const vertices = new Map<string, [string, string] | []>()
  const valueMap = new Map<string, number>()
  const isExpandComplete = true

  function recurseConstruction(value: number, key: string) {
    valueMap.set(key, value)
    const factors = getFactors(value, false)

    if (factors.length > 0) {
      const current = input.find((factor) => factors.indexOf(factor) > -1)

      if (current != null) {
        const other = value / current
        const currentKey = `${key}-left`
        const otherKey = `${key}-right`
        vertices.set(key, [currentKey, otherKey])
        recurseConstruction(current, currentKey)
        recurseConstruction(other, otherKey)

        return
      }
    }

    vertices.set(key, [])
  }

  recurseConstruction(root, ROOT_KEY)

  return [vertices, valueMap, isExpandComplete] as const
}

const TextLabel = styled.div<{ colorChange: boolean; isFirstNode: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  padding: auto;
  color: ${(props) =>
    props.colorChange || props.isFirstNode
      ? props.isFirstNode
        ? '#AA5EE0'
        : '#FFE9D4'
      : '#CF8B04'};
  overflow: visible;
`

const DefaultInput: FC = () => <>&#128290;</>

export const InputFactorTree = forwardRef<InputFactorTreeRef, InputFactorTreeProps>(
  (
    { value, inputFactors = [], inputComponent: Input = DefaultInput, onComplete, className },
    ref,
  ) => {
    const [vertices, valueMap, isExpandComplete] = constructVertices(value, inputFactors)
    const treeRef = useRef<TreeRef>(null)

    useImperativeHandle(ref, () => ({
      isExpandComplete,
      expandedFactors:
        treeRef.current?.treeGraph.getLeafNodes().map((id) => valueMap.get(id as string) ?? -1) ??
        [],
      currentFactors: Array.from(valueMap.values()),
    }))

    useEffect(() => {
      onComplete?.(isExpandComplete)
    }, [isExpandComplete, onComplete])

    return (
      <Tree
        ref={treeRef}
        vertices={vertices}
        rootId={ROOT_KEY}
        nodeSize={25}
        levelSeparation={60}
        siblingSeparation={40}
        subtreeSeparation={40}
        customNode={({ x, y, r, id, graph }) => {
          const isLeaf = graph.isLeaf(id)
          const value = valueMap.get(id as string)
          const isAltColor =
            isLeaf && value != null && value !== -1 && getPrimeFactors(value).length === 0
          const isFirstNode = id == ROOT_KEY && value != null && getPrimeFactors(value).length !== 0

          return (
            <g>
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={
                  isAltColor || isFirstNode ? (isFirstNode ? '#EACCFF' : ' #FF8F1F') : '#FFDC73'
                }
                stroke={isFirstNode ? '#AA5EE0' : 'none'}
                strokeWidth={2}
              />
              <foreignObject
                width={2 * r}
                height={2 * r}
                x={x}
                y={y}
                transform={`translate(-${r},-${r})`}
                overflow="visible"
              >
                <TextLabel colorChange={isAltColor} isFirstNode={isFirstNode}>
                  {id === INPUT_KEY ? (
                    <Input parentNodeValue={valueMap.get(graph.parent(id) as string) ?? 1} />
                  ) : id === DUMMY_KEY ? (
                    ''
                  ) : (
                    value
                  )}
                </TextLabel>
              </foreignObject>
            </g>
          )
        }}
        className={className}
      />
    )
  },
)
