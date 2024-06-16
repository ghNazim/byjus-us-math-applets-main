import { FC, forwardRef, useImperativeHandle } from 'react'
import styled from 'styled-components'

import { Graph } from './helpers/graph'
import positionTree from './helpers/position'
import { ConnectorProps, NodeProps, TreeProps, TreeRef } from './Tree.types'

const DefaultConnector: FC<ConnectorProps> = ({
  startX,
  startY,
  endX,
  endY,
  strokeColor: lineColor,
}) => {
  return (
    <line
      x1={startX}
      y1={startY}
      x2={endX}
      y2={endY}
      stroke={lineColor ? lineColor : '#CF8B04'}
      strokeWidth={2}
      strokeDashoffset={1}
    />
  )
}

const TextLabel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 6px;
  line-height: 6px;
  text-align: center;
  padding: auto;
  color: #fff;
  pointer-events: none;
`

const DefaultNode: FC<NodeProps> = ({ x, y, r, id }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="rgb(15, 98, 189)" />
    <foreignObject width={2 * r} height={2 * r} x={x} y={y} transform={`translate(-${r},-${r})`}>
      <TextLabel>{id}</TextLabel>
    </foreignObject>
  </g>
)

export const Tree = forwardRef<TreeRef, TreeProps>(
  (
    {
      width = 700,
      height = 700,
      rootId = 0,
      nodeSize = 6,
      rootPosition = { x: width / 2, y: nodeSize + 2, prelim: 0, mod: 0 },
      vertices,
      levelSeparation = 20,
      maxDepth = Infinity,
      siblingSeparation = 15,
      subtreeSeparation = 15,
      onError,
      customNode: TreeNode = DefaultNode,
      customConnector: Connector = DefaultConnector,
      strokeColor,
      className,
    },
    ref,
  ) => {
    /**
     * Map of each node to its size
     */
    const nodeSizeMap = new Map([...vertices.keys()].map((node) => [node, nodeSize]))

    /**
     * Here we create the Graph object and call our position alg,
     * which determines the final x and y positions of the nodes. We return
     * null if we cannot fit the nodes into the viewing box
     */

    const treeGraph = new Graph(vertices, nodeSizeMap, [rootId, rootPosition])

    useImperativeHandle(ref, () => ({
      treeGraph,
    }))

    const isValid = positionTree(treeGraph, rootId, {
      width,
      height,
      levelSeparation,
      maxDepth,
      siblingSeparation,
      subtreeSeparation,
    })
    if (!isValid && onError) {
      onError('Tree could not be rendered in the viewing rect')
      return null
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={className}>
        {[...vertices.entries()].map(([node, childNodes]) => {
          const [startX, startY] = treeGraph.getCoordinates(node)
          return (
            <>
              {childNodes.map((childNode) => {
                const [endX, endY] = treeGraph.getCoordinates(childNode)
                return (
                  <Connector
                    {...{ startId: node, startX, startY, endId: childNode, endX, endY }}
                    key={`${node}-${childNode}`}
                    strokeColor={strokeColor}
                  />
                )
              })}
              <TreeNode key={node} x={startX} y={startY} r={nodeSize} graph={treeGraph} id={node} />
            </>
          )
        })}
      </svg>
    )
  },
)
