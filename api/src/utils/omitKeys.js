export default (object, keys) =>
  Object.entries(object).reduce(
    (acc, [key, value]) =>
      !keys.includes(key) ? { ...acc, [key]: value } : acc,
    {}
  );
