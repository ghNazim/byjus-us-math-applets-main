import { FC, forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { getFactors, getPrimeFactors } from '@/utils/math'
import { isNumber } from '@/utils/types'

import { Tree } from '../Tree'
import { NodeProps, TreeRef } from '../Tree/Tree.types'
import {
  FactorTreeProps,
  FactorTreeRef,
  FactorTreeThemeType,
  InputComponent,
} from './FactorTree.types'

const ROOT_KEY = 'root'
const LEFT_KEY = 'input-left'
const RIGHT_KEY = 'input-right'

function constructVertices(root: number, input: Array<number | [number, 'left' | 'right']>) {
  const vertices = new Map<string, [string, string] | []>()
  const valueMap = new Map<string, number>()
  const inputFactors = [...input, -1]
  let isExpandComplete = true

  function setInputNodes(key: string) {
    vertices.set(key, [LEFT_KEY, RIGHT_KEY])
    recurseConstruction(-1, LEFT_KEY)
    recurseConstruction(-1, RIGHT_KEY)
    isExpandComplete = false
  }

  function setDisplayNodes(value: number, key: string, current: number, dir: 'left' | 'right') {
    const other = value / current
    const currentKey = `${key}-${dir}`
    const otherKey = `${key}-${dir === 'left' ? 'right' : 'left'}`
    vertices.set(key, [currentKey, otherKey])
    if (dir === 'left') {
      recurseConstruction(current, currentKey)
      recurseConstruction(other, otherKey)
    } else {
      recurseConstruction(other, otherKey)
      recurseConstruction(current, currentKey)
    }
  }

  function recurseConstruction(value: number, key: string) {
    valueMap.set(key, value)
    const factors = value > 0 ? getFactors(value, false) : []

    if (factors.length > 0) {
      const currentIp = inputFactors.shift()
      if (currentIp != null) {
        let current: number
        let dir: 'left' | 'right'

        if (isNumber(currentIp)) {
          current = currentIp
          dir = 'left'
        } else {
          current = currentIp[0]
          dir = currentIp[1]
        }

        if (current === -1) {
          setInputNodes(key)
          return
        }

        if (factors.indexOf(current) > -1) {
          setDisplayNodes(value, key, current, dir)
          return
        }
      }
    }

    vertices.set(key, [])
  }

  recurseConstruction(root, ROOT_KEY)

  return [vertices, valueMap, isExpandComplete] as const
}

const defaultTheme: FactorTreeThemeType = {
  firstNodeBgColor: '#EACCFF',
  firstNodeColor: '#AA5EE0',
  firstNodeStrokeColor: '#AA5EE0',
  leftNodeBgColor: '#FF8F1F',
  leftNodeColor: '#FFE9D4',
  rightNodeColor: '#CF8B04',
  rightNodeBgColor: '#FFDC73',
}
const TextLabel = styled.div<{
  colorChange: boolean
  isFirstNode: boolean
  firstNodeColor: string
  leftNodeColor: string
  rightNodeColor: string
}>`
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
        ? props.firstNodeColor
        : props.leftNodeColor
      : props.rightNodeColor};
  overflow: visible;
`

const DefaultInput: FC = () => <>&#128290;</>
const DefaultDummy: FC = () => null

function getCustomNode(
  valueMap: Map<string, number>,
  InputLeft: InputComponent,
  InputRight: InputComponent,
  Theme: FactorTreeThemeType,
) {
  return ({ x, y, r, id, graph }: NodeProps) => {
    const isLeaf = graph.isLeaf(id)
    const value = valueMap.get(id as string)
    const isAltColor =
      isLeaf && value != null && value !== -1 && getPrimeFactors(value, false).length === 0
    const isFirstNode =
      id == ROOT_KEY && value != null && getPrimeFactors(value, false).length !== 0
    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r={r}
          fill={
            isAltColor || isFirstNode
              ? isFirstNode
                ? `${Theme.firstNodeBgColor}`
                : `${Theme.leftNodeBgColor}`
              : `${Theme.rightNodeBgColor}`
          }
          stroke={
            isAltColor || isFirstNode
              ? isFirstNode
                ? `${Theme.firstNodeStrokeColor}`
                : `${Theme.leftNodeStrokeColor ? Theme.leftNodeStrokeColor : 'none'}`
              : `${Theme.rightNodeStrokeColor ? Theme.rightNodeStrokeColor : 'none'}`
          }
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
          <TextLabel
            key={id}
            colorChange={isAltColor}
            isFirstNode={isFirstNode}
            firstNodeColor={Theme.firstNodeColor}
            leftNodeColor={Theme.leftNodeColor}
            rightNodeColor={Theme.rightNodeColor}
          >
            {id === LEFT_KEY ? (
              <InputLeft parentNodeValue={valueMap.get(graph.parent(id) as string) ?? 1} />
            ) : id === RIGHT_KEY ? (
              <InputRight parentNodeValue={valueMap.get(graph.parent(id) as string) ?? 1} />
            ) : (
              value
            )}
          </TextLabel>
        </foreignObject>
      </g>
    )
  }
}
function getExpandedFactors(treeRef: TreeRef, valueMap: Map<string, number>) {
  const leafNodes = treeRef.treeGraph.getLeafNodes()
  const factors: Array<number> = []

  for (const id of leafNodes) {
    if (id === LEFT_KEY) {
      const parent = treeRef.treeGraph.parent(id) as string
      factors.push(valueMap.get(parent) ?? -1)
    } else if (id === RIGHT_KEY) {
      continue
    } else {
      factors.push(valueMap.get(id as string) ?? -1)
    }
  }

  return factors
}

export const FactorTree = forwardRef<FactorTreeRef, FactorTreeProps>(
  (
    {
      value,
      inputFactors = [],
      inputComponentLeft = DefaultInput,
      inputComponentRight = DefaultDummy,
      onComplete,
      className,
      themeProps = defaultTheme,
      ...args
    },
    ref,
  ) => {
    const [vertices, valueMap, isExpandComplete] = useMemo(
      () => constructVertices(value, inputFactors),
      [inputFactors, value],
    )
    const treeRef = useRef<TreeRef>(null)

    useImperativeHandle(ref, () => ({
      isExpandComplete,
      expandedFactors: treeRef.current != null ? getExpandedFactors(treeRef.current, valueMap) : [],
      currentFactors: Array.from(valueMap.values()),
    }))

    useEffect(() => {
      onComplete?.(isExpandComplete)
    }, [isExpandComplete, onComplete])

    const customNode = useMemo(
      () => getCustomNode(valueMap, inputComponentLeft, inputComponentRight, themeProps),
      [inputComponentLeft, inputComponentRight, valueMap, themeProps],
    )

    return (
      <Tree
        ref={treeRef}
        vertices={vertices}
        rootId={ROOT_KEY}
        nodeSize={25}
        levelSeparation={60}
        siblingSeparation={40}
        subtreeSeparation={40}
        customNode={customNode}
        className={className}
        strokeColor={themeProps?.strokeColor}
        {...args}
      />
    )
  },
)
