export function mergeObjectDeep(target, ...sources) {
  const isPlainObject = (object) => Object.prototype.toString.call(object) === '[object Object]';
  const merge = (target, source, cache) => {
    if (!source || typeof source !== 'object') {
      return target;
    }
    if (cache.has(source)) {
      return cache.get(source);
    }
    cache.set(source, target);
    const structuredCloneSafe = (object) => {
      try {
        return structuredClone(object);
      } catch {
        return Array.isArray(object) ? [...object] : isPlainObject(object) ? merge({}, object, cache) : object;
      }
    };
    Object.entries(source).forEach(([key, sourceValue]) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return;
      }
      const targetValue = target[key];
      target[key] = isPlainObject(sourceValue) && isPlainObject(targetValue) ? merge(targetValue, sourceValue, cache) : structuredCloneSafe(sourceValue);
    });
    return target;
  };
  const cache = new WeakMap();
  sources.forEach((source) => merge(target, source, cache));
  return target;
}
