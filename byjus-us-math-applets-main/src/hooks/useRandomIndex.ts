import { useRef } from 'react'

function shuffle<T>(array: T[]): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected an Array, got ${typeof array} instead.`)
  }

  const oldArray = [...array]
  let newArray = new Array<T>()

  while (oldArray.length) {
    const i = Math.floor(Math.random() * oldArray.length)
    newArray = newArray.concat(oldArray.splice(i, 1))
  }

  return newArray
}

export function useRandomIndex(length: number) {
  const prevIndices = useRef<Array<number>>([])

  const getIndex = () => {
    if (prevIndices.current.length <= 0) {
      prevIndices.current = new Array(length).fill(undefined).map((_, i) => i)
      prevIndices.current = shuffle(prevIndices.current)
    }

    return prevIndices.current.pop() ?? -1
  }

  return getIndex
}
