type PlainObject = Record<string, unknown>;
type UnionToIntersection<U> = (U extends unknown ? (_: U) => unknown : never) extends (_: infer I) => unknown ? I : never;

export function mergeObjectDeep<T extends PlainObject, U extends PlainObject[]>(target: T, ...sources: U): T & UnionToIntersection<U[number]> {
  const isPlainObject = (object: unknown): object is PlainObject => Object.prototype.toString.call(object) === '[object Object]';
  const merge = (target: PlainObject, source: unknown, cache: WeakMap<object, PlainObject>): PlainObject => {
    if (!source || typeof source !== 'object') {
      return target;
    }
    if (cache.has(source)) {
      return cache.get(source)!;
    }
    cache.set(source, target);
    const structuredCloneSafe = (object: unknown): unknown => {
      try {
        return structuredClone(object);
      } catch {
        return Array.isArray(object) ? [...object] : isPlainObject(object) ? merge({}, object, cache) : object;
      }
    };
    Object.entries(source as PlainObject).forEach(([key, sourceValue]) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return;
      }
      const targetValue = target[key];
      target[key] = isPlainObject(sourceValue) && isPlainObject(targetValue) ? merge(targetValue, sourceValue, cache) : structuredCloneSafe(sourceValue);
    });
    return target;
  };
  const cache = new WeakMap<object, PlainObject>();
  sources.forEach((source) => merge(target, source, cache));
  return target as T & UnionToIntersection<U[number]>;
}
