export function assignObjectDeep(target, ...sources) {
  const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';
  const structuredCloneSafe = (value) => {
    try {
      return structuredClone(value);
    } catch {
      return Array.isArray(value) ? [...value] : isPlainObject(value) ? assignObjectDeep({}, value) : value;
    }
  };
  sources.forEach((source) => {
    if (!source || typeof source !== 'object') {
      return;
    }
    Object.entries(source).forEach(([key, sourceValue]) => {
      const targetValue = target[key];
      target[key] = isPlainObject(sourceValue) && isPlainObject(targetValue) ? assignObjectDeep(targetValue, sourceValue) : structuredCloneSafe(sourceValue);
    });
  });
  return target;
}
