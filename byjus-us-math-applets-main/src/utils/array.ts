export function* interleave<T>(...args: Array<Array<T>>) {
  const its = args.map((x) => x[Symbol.iterator]())
  let done
  do {
    done = true
    for (const it of its) {
      const next = it.next()
      if (!next.done) {
        yield next.value
        done = false
      }
    }
  } while (!done)
}

export function shuffle<T>(arr: Array<T>) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const x = result[i]
    result[i] = result[j]
    result[j] = x
  }
  return result
}

export function equal<T>(a: Array<T>, b: Array<T>) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}
