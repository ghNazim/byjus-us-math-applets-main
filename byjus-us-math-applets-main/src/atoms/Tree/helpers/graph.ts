/**
 * Class that represents a Tree graph.
 */

import { getWithDefault } from '@/utils/map'

export interface Position {
  x: number
  y: number
  prelim: number
  mod: number
}

// Nodes can be represented by numbers or strings, they just need
// to be unique
export type GraphNode = number | string | null

export class Graph {
  vertexMap: Map<GraphNode, Array<GraphNode>>
  parentMap: Map<GraphNode, GraphNode>
  positionMap: Map<GraphNode, Position>
  leftNeighborMap: Map<GraphNode, GraphNode | null>
  prevNodeMap: Map<GraphNode, GraphNode | null>
  nodeSizeMap: Map<GraphNode, number>
  xTopAdjustment = 0
  yTopAdjustment = 0

  constructor(
    vertexMap: Map<GraphNode, Array<GraphNode>>,
    nodeSizeMap: Map<GraphNode, number>,
    rootNodePosition: [GraphNode, Position],
  ) {
    this.vertexMap = vertexMap
    this.nodeSizeMap = nodeSizeMap
    // TODO: Can we defer this to the first traversal? Props not
    this.parentMap = this.createParentMap()
    this.positionMap = new Map([rootNodePosition])
    this.leftNeighborMap = new Map()
    this.prevNodeMap = new Map()
  }

  // Create mapping of child id to parent id
  createParentMap(): Map<GraphNode, GraphNode> {
    const parentMap: Map<GraphNode, GraphNode> = new Map()
    this.vertexMap.forEach((children, parent) => {
      if (!children) return
      children.forEach((child) => {
        parentMap.set(child, parent)
      })
    })
    return parentMap
  }

  // Whether or node the tree has a node
  hasNode(node: GraphNode): boolean {
    return this.vertexMap.get(node) !== undefined
  }

  // Return whether the node is a leaf
  isLeaf(node: GraphNode): boolean {
    return getWithDefault(this.vertexMap, node, [])?.length === 0
  }

  // Parent of the node
  parent(node: GraphNode): GraphNode {
    return getWithDefault(this.parentMap, node)
  }

  // Prelim position value of the node
  prelim(node: GraphNode): number {
    const pos = this.positionMap.get(node)
    return pos ? pos.prelim : 0
  }

  // The current node's x-coordinate
  xCoord(node: GraphNode): number {
    const pos = this.positionMap.get(node)
    return pos ? pos.x : 0
  }

  // The current node's y-coordinate
  yCoord(node: GraphNode): number {
    const pos = this.positionMap.get(node)
    return pos ? pos.y : 0
  }

  getCoordinates(node: GraphNode): [number, number] {
    return [this.xCoord(node), this.yCoord(node)]
  }

  // The current node's modifier value
  modifier(node: GraphNode): number {
    const pos = this.positionMap.get(node)
    return pos ? pos.mod : 0
  }

  // The current node's leftmost offspring
  firstChild(node: GraphNode): GraphNode {
    const children = getWithDefault(this.vertexMap, node, [])
    return children.length > 0 ? children[0] : null
  }

  // Get the prevNode for a given level
  prevNode(level: GraphNode): GraphNode {
    return getWithDefault(this.prevNodeMap, level)
  }

  hasLeftSibling(node: GraphNode): boolean {
    return this.leftSibling(node) !== null
  }

  hasRightSibling(node: GraphNode): boolean {
    return this.rightSibling(node) !== null
  }

  // The current node's closest sibling node on the left.
  leftSibling(node: GraphNode) {
    const siblings = this.getSiblings(node)
    const nodeIndex = siblings.indexOf(node)
    return nodeIndex > 0 ? siblings[nodeIndex - 1] : null
  }

  // Array of all left siblings
  leftSiblings(node: GraphNode): Array<GraphNode> {
    const siblings = this.getSiblings(node)
    return siblings.filter((curr, index) => index < siblings.indexOf(node))
  }

  // The current node's closest sibling node on the right
  rightSibling(node: GraphNode): GraphNode {
    const siblings = this.getSiblings(node)
    const nodeIndex = siblings.indexOf(node)
    return siblings.length - 1 > nodeIndex ? siblings[nodeIndex + 1] : null
  }

  // The current node's nearest neighbor to the left, at the same level
  leftNeighbor(node: GraphNode) {
    return getWithDefault(this.leftNeighborMap, node)
  }

  // Get siblings of a node
  getSiblings(node: GraphNode): Array<GraphNode> {
    const parent = getWithDefault(this.parentMap, node)
    return getWithDefault(this.vertexMap, parent, [])
  }

  getLeafNodes() {
    return [...this.vertexMap.keys()].filter((n) => this.isLeaf(n))
  }

  /**
   * Function to update the position map, adding the default
   * values for the position attributes if they do not already
   * exist in the map
   */
  updatePositionValue(key: GraphNode, attributes: Partial<Position>) {
    this.positionMap.set(key, {
      x: 0,
      y: 0,
      prelim: 0,
      mod: 0,
      ...this.positionMap.get(key),
      ...attributes,
    })
  }

  /**
   * Return the mean node size of n nodes
   */
  meanNodeSize(nodes: Array<GraphNode>): number {
    if (!nodes || nodes.length === 0) throw new Error('Cannot compute mean of input')
    return (
      nodes.map((node) => getWithDefault(this.nodeSizeMap, node, 0)).reduce((a, b) => a + b) /
      nodes.length
    )
  }
}
