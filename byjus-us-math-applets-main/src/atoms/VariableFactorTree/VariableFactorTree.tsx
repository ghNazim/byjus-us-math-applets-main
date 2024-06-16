import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import styled from 'styled-components'

import { getFactors, getPrimeFactors } from '@/utils/math'

import { Tree } from '../Tree'
import { TreeRef } from '../Tree/Tree.types'
import { VariableFactorTreeProps, VariableFactorTreeRef } from './VariableFactorTree.types'

const ROOT_KEY = 'root'
const INPUT_KEY = 'input'
const DUMMY_KEY = 'dummy'
const VARIABLE_KEY = 'x'

const MATCH_PATTERN = /(\d+)x/gm

function parseExpression(expression: string) {
  const match = expression.match(MATCH_PATTERN)
  let coefficient = 1
  let variable: string | null = null

  if (expression === 'x') {
    variable = 'x'
  } else if (match != null && match.length > 0) {
    variable = 'x'
    coefficient = parseInt(match[0])
  } else {
    coefficient = parseInt(expression)
  }

  return { coefficient, variable }
}

function constructVertices(expression: string, [hasX, ...input]: ['x', ...number[]] | []) {
  const { coefficient } = parseExpression(expression)
  const vertices = new Map<string, [string, string] | []>()
  const valueMap = new Map<string, number>()
  const inputFactors = [...input, -1]
  let isExpandComplete = true

  function recurseConstruction(coefficient: number, key: string) {
    valueMap.set(key, coefficient)
    const factors = coefficient > 0 ? getFactors(coefficient, false) : []

    if (factors.length > 0) {
      const current = inputFactors.shift()

      if (current != null) {
        if (current === -1) {
          vertices.set(key, [INPUT_KEY, DUMMY_KEY])
          recurseConstruction(-1, INPUT_KEY)
          recurseConstruction(-1, DUMMY_KEY)
          isExpandComplete = false
          return
        }

        if (factors.indexOf(current) > -1) {
          const other = coefficient / current
          const currentKey = `${key}-left`
          const otherKey = `${key}-right`
          vertices.set(key, [currentKey, otherKey])
          recurseConstruction(current, currentKey)
          recurseConstruction(other, otherKey)

          return
        }
      }
    }

    vertices.set(key, [])
  }

  if (hasX) {
    vertices.set(ROOT_KEY, [VARIABLE_KEY, `${ROOT_KEY}-right`])
    vertices.set(VARIABLE_KEY, [])
    valueMap.set(VARIABLE_KEY, -1)
    recurseConstruction(coefficient, `${ROOT_KEY}-right`)
  } else {
    vertices.set(ROOT_KEY, [INPUT_KEY, DUMMY_KEY])
    recurseConstruction(-1, INPUT_KEY)
    recurseConstruction(-1, DUMMY_KEY)
    isExpandComplete = false
  }
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

export const VariableFactorTree = forwardRef<VariableFactorTreeRef, VariableFactorTreeProps>(
  (
    { expression, inputFactors = [], inputComponent: Input = DefaultInput, onComplete, className },
    ref,
  ) => {
    const [vertices, valueMap, isExpandComplete] = constructVertices(expression, inputFactors)
    const treeRef = useRef<TreeRef>(null)

    useImperativeHandle(ref, () => ({
      isExpandComplete,
      // @ts-expect-error
      expandedFactors:
        treeRef.current?.treeGraph
          .getLeafNodes()
          .map((id) => (id === VARIABLE_KEY ? 'x' : valueMap.get(id as string) ?? -1)) ?? [],
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
            id === VARIABLE_KEY ||
            (isLeaf && value != null && value !== -1 && getPrimeFactors(value, false).length === 0)
          const isFirstNode = id == ROOT_KEY

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
                    ' '
                  ) : id === VARIABLE_KEY ? (
                    'x'
                  ) : id === ROOT_KEY ? (
                    expression
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
