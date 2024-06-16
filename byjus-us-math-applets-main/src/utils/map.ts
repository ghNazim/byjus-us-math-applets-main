/**
 * Map.get but with a default value
 */
export function getWithDefault<K, V>(map: Map<K, V>, key: K): V | null
export function getWithDefault<K, V>(map: Map<K, V>, key: K, defaultValue: V): V
export function getWithDefault<K, V>(map: Map<K, V>, key: K, defaultValue?: V) {
  const ret = map.get(key)
  return ret === undefined ? defaultValue : ret
}
