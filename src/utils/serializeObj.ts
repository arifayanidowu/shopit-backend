export const serializeObj = (obj: object) => {
  const newObj = JSON.parse(JSON.stringify(obj), (key, value) => {
    if (value === 'null') {
      return null;
    } else if (value === 'true' || value === 'false') {
      return value === 'true';
    } else {
      return value;
    }
  });
  return newObj;
};
