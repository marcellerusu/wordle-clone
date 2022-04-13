export const zip = (first, second) => {
  first = Array.from(first);
  second = Array.from(second);
  if (first.length !== second.length)
    throw new Error("zip must be same length");
  return first.map((x, i) => [x, second[i]]);
};
