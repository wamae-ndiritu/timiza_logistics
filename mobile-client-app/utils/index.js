export function hasEmptyValue(obj) {
  return Object.values(obj).some(
    (value) => value === "" || value === null || value === undefined
  );
}
