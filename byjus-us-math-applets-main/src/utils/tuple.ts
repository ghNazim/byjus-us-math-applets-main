export type Prepend<Tuple extends any[], Addend> = [Addend, ...Tuple]

export type Repeat<T, Count extends number, Holder extends T[] = []> =
  // If the count is never the tuple is also never.
  Count extends never
    ? never
    : // If the Count is number - it is basically an array.
    number extends Count
    ? T[]
    : // It is possible for Count to be a union
    Holder['length'] extends Count
    ? Count extends Holder['length']
      ? Holder
      : // Count is a union
      Count extends Holder['length'] | infer Rest
      ? Rest extends number
        ? Repeat<T, Holder['length']> | Repeat<T, Rest>
        : never
      : never
    : // Count is not Holder['length']
      Repeat<T, Count, Prepend<Holder, T>>
