class ArrayLengthMismatch extends Error {}

const fp = {
  zip(first, second) {
    first = Array.from(first);
    second = Array.from(second);
    if (first.length !== second.length) throw new ArrayLengthMismatch();
    return first.map((item, i) => [item, second[i]]);
  },
};

class Any {}

class Else {
  constructor(value) {
    this.value = value;
  }
}

class Capture {
  constructor(key) {
    this.key = key;
  }
}

class OneOf {
  constructor(array) {
    this.array = array;
  }
}

function s(key) {
  return new Capture(key);
}

function matchCapture(captures, key, value) {
  if (captures.has(key)) {
    return captures.get(key) === value;
  }
  captures.set(key, value);
  return true;
}

function matchObject(pattern, value, captures) {
  return Object.keys(pattern).every((key) =>
    match(pattern[key], value[key], captures)
  );
}

function matchRegExp(pattern, value) {
  return pattern.test(value);
}

function matchOneOf(pattern, value) {
  return pattern.array.includes(value);
}

function match(pattern, value, captures = new Map()) {
  if (pattern instanceof Any) {
    return true;
  } else if (pattern instanceof Capture) {
    return matchCapture(captures, pattern.key, value);
  } else if (pattern instanceof OneOf) {
    return matchOneOf(pattern, value);
  } else if (pattern instanceof RegExp) {
    return matchRegExp(pattern, value);
  } else if (pattern instanceof Array) {
    return matchArray(pattern, value, captures);
  } else if (pattern.constructor === Object) {
    return matchObject(pattern, value, captures);
  } else {
    return pattern === value;
  }
}

// s.match(s.case(s("a"), { b: s("a") }).is(3));

function matchArray(pattern, value, captures = new Map()) {
  if (pattern.length !== value.length) return false;
  return fp
    .zip(pattern, value)
    .every(([pattern, value]) => match(pattern, value, captures));
}

s.match =
  (...cases) =>
  (...values) => {
    let match = cases.find((pattern) => {
      if (pattern instanceof Else) return true;
      return matchArray(
        pattern.slice(0, -1),
        values.slice(0, pattern.length - 1)
      );
    });
    if (!match) return;
    if (match instanceof Else) return match.value;
    return match.at(-1);
  };

s.defn =
  (...cases) =>
  (...args) =>
    s.match(...cases)(...args)?.(...args);

s.any = new Any();

s.else = (value) => new Else(value);

s.oneOf = (array) => new OneOf(array);

s.case = (...items) => {
  return {
    is: (value) => [...items, value],
  };
};

export default s;
