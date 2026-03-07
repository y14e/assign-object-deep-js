export function objectAssignDeep(target, ...sources) {
  const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';
  const safeStructuredClone = (value) => {
    try {
      return structuredClone(value);
    } catch {
      return Array.isArray(value) ? [...value] : isPlainObject(value) ? objectAssignDeep({}, value) : value;
    }
  };
  sources.forEach((source) => {
    if (!source || typeof source !== 'object') {
      return;
    }
    Object.entries(source).forEach(([key, sourceValue]) => {
      const targetValue = target[key];
      target[key] = isPlainObject(sourceValue) && isPlainObject(targetValue) ? objectAssignDeep(targetValue, sourceValue) : safeStructuredClone(sourceValue);
    });
  });
  return target;
}
