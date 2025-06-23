import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that works like useEffect but skips the first render
 * @param {Function} effect - Effect callback to run
 * @param {Array} dependencies - Dependencies array
 */
export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

/**
 * Custom hook to work with arrays with optimized methods
 * @param {Array} initialArray - Initial array value
 * @returns {Array} - Array with helper methods
 */
export function useArray(initialArray = []) {
  const [array, setArray] = useState(initialArray);

  const push = (element) => {
    setArray((a) => [...a, element]);
  };

  const remove = (index) => {
    setArray((a) => a.filter((_, i) => i !== index));
  };

  const update = (index, newElement) => {
    setArray((a) => [
      ...a.slice(0, index),
      newElement,
      ...a.slice(index + 1),
    ]);
  };

  const filter = (callback) => {
    setArray((a) => a.filter(callback));
  };

  const clear = () => {
    setArray([]);
  };

  return { array, set: setArray, push, remove, update, filter, clear };
}

/**
 * Custom hook for handling refs with a callback when elements are connected/disconnected
 * @param {Function} callback - Callback to run when ref changes
 * @returns {React.RefObject} - Ref object
 */
export function useCallbackRef(callback) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && callback) {
      callback(ref.current);
    }

    return () => {
      if (ref.current && callback) {
        callback(null);
      }
    };
  }, [callback]);

  return ref;
}
