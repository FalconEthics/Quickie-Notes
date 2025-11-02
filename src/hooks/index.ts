import { useEffect, useRef, useState, DependencyList, EffectCallback } from 'react'

/**
 * Custom hook that works like useEffect but skips the first render
 */
export function useUpdateEffect(effect: EffectCallback, dependencies: DependencyList = []) {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

/**
 * Custom hook to work with arrays with optimized methods
 */
export function useArray<T>(initialArray: T[] = []) {
  const [array, setArray] = useState<T[]>(initialArray)

  const push = (element: T) => {
    setArray((a) => [...a, element])
  }

  const remove = (index: number) => {
    setArray((a) => a.filter((_, i) => i !== index))
  }

  const update = (index: number, newElement: T) => {
    setArray((a) => [
      ...a.slice(0, index),
      newElement,
      ...a.slice(index + 1),
    ])
  }

  const filter = (callback: (value: T, index: number, array: T[]) => boolean) => {
    setArray((a) => a.filter(callback))
  }

  const clear = () => {
    setArray([])
  }

  return { array, set: setArray, push, remove, update, filter, clear }
}

/**
 * Custom hook for handling refs with a callback when elements are connected/disconnected
 */
export function useCallbackRef<T extends HTMLElement>(callback: (element: T | null) => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (ref.current && callback) {
      callback(ref.current)
    }

    return () => {
      if (callback) {
        callback(null)
      }
    }
  }, [callback])

  return ref
}
