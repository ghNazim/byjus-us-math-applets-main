import { ComponentType } from 'react'

import { Graph, GraphNode, Position } from './helpers/graph'
import { Options } from './helpers/position'

export interface NodeProps {
  x: number
  y: number
  r: number
  id: GraphNode
  graph: Graph
}

export interface ConnectorProps {
  startId: GraphNode
  startX: number
  startY: number
  endId: GraphNode
  endX: number
  endY: number
  strokeColor?: string
}

export interface TreeRef {
  treeGraph: Graph
}

export interface TreeProps extends Partial<Options> {
  /** The element that you wish to display at the root of the tree */
  rootId?: GraphNode
  /**
   * The position of the root node.
   */
  rootPosition?: Position
  /**
   * The data structure of vertices
   */
  vertices: Map<GraphNode, Array<GraphNode>>
  /**
   * Used in tandem with the vertices prop to pass in the node size that
   * will be used for each node
   */
  nodeSize?: number
  /**
   * Function that is called when there is an error. Returns an error
   * message that explains what went wrong
   */
  onError?: (message: string) => void
  /**
   * Function to render a node in the graph
   */
  customNode?: ComponentType<NodeProps>
  customConnector?: ComponentType<ConnectorProps>
  className?: string
  strokeColor?: string
}
