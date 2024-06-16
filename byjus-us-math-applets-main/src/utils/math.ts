export function approxeq(v1: number, v2: number, epsilon = 0.001) {
  return Math.abs(v1 - v2) <= epsilon
}

export function clampValue(val: number, min: number, max: number) {
  return Math.max(min, Math.min(val, max))
}

export function getProgress(value: number, min: number, max: number) {
  return Math.max(value - min, 0) / (max - min)
}

export function getValueFromProgress(ratio: number, min: number, max: number) {
  const range = max - min
  return range * ratio + min
}

export function lerp(a: number, b: number, alpha: number) {
  return a + alpha * (b - a)
}

export function degToRad(degrees: number) {
  return degrees * (Math.PI / 180)
}
export function radToDeg(radians: number) {
  return radians * (180 / Math.PI)
}

export function clampPrecision(n: string, p: number) {
  const [, d] = n.split('.')
  if (d && d.length > p) return parseFloat(n).toFixed(p)
  return n
}

/**
 * Finds the closest number in the list for the given value.
 * @param list Array of numbers in ascending order.
 * @param value The number to search for.
 * @returns The number in the list closest to value.
 */
export function findClosestNumber(list: number[], value: number) {
  let low = 0
  let high = list.length - 1
  let closest = null

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const current = list[mid]

    if (closest === null || Math.abs(current - value) < Math.abs(closest - value)) {
      closest = current
    }

    if (current < value) {
      low = mid + 1
    } else if (current > value) {
      high = mid - 1
    } else {
      return current
    }
  }

  return closest
}

export function mix(value1: number, weight1: number, value2: number, weight2: number) {
  return (value1 * weight1 + value2 * weight2) / (weight1 + weight2)
}

export function range(n: number): Array<number>
export function range(n: number, start: number): Array<number>
export function range(n: number, start: number, step: number): Array<number>
export function range(n: number, start = 0, step = 1) {
  const arr = new Array<number>()
  if (step === 0) return arr
  for (let i = start; i < n; i += step) {
    arr.push(i)
  }
  arr.push(n)
  return arr
}

export function getFactors(n: number, includeOneAndSelf = true) {
  const maxFactorNum = Math.floor(Math.sqrt(n))
  const factors = new Array<number>()
  let count = 0 //count of factors found < maxFactorNum.

  for (let i = includeOneAndSelf ? 1 : 2; i <= maxFactorNum; i++) {
    //inserting new elements in the middle using splice
    if (n % i === 0) {
      factors.splice(count, 0, i)
      const otherFactor = n / i //the other factor
      if (i != otherFactor) {
        //insert these factors in the front of the array
        factors.splice(-count, 0, otherFactor)
      }
      count++
    }
  }

  if (factors.length === 0) return factors

  //swapping first and last elements
  const lastIndex = factors.length - 1
  const temp = factors[lastIndex]
  factors[lastIndex] = factors[0]
  factors[0] = temp

  return factors
}

export function getPrimeFactors(n: number, includeOneAndSelf = false) {
  const factors = getFactors(n, includeOneAndSelf)

  return factors.filter((i) => getFactors(i, false).length === 0)
}

export const expandedPrimeFactors = (n: number): number[] => {
  const factors: number[] = []
  let divisor = 2

  while (n >= 2) {
    if (n % divisor === 0) {
      factors.push(divisor)
      n = n / divisor
    } else {
      divisor++
    }
  }

  return factors
}

export function getGreatestCommonDivisor(a: number, b: number): number {
  return b ? getGreatestCommonDivisor(b, a % b) : a
}

export function simplifyFraction(numerator: number, denominator: number): [number, number] {
  const gcd = getGreatestCommonDivisor(numerator, denominator)
  return [numerator / gcd, denominator / gcd]
}

export function sum(arr: number[], start = 0, end = arr.length) {
  let total = 0
  for (let i = start; i < end; i++) {
    total += arr[i]
  }
  return total
}

export function cumsum(arr: number[]) {
  const cumsum = new Array<number>(arr.length)
  let total = 0
  for (let i = 0; i < arr.length; i++) {
    total += arr[i]
    cumsum[i] = total
  }
  return cumsum
}
