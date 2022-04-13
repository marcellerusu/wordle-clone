class Any {
  constructor(letter) {
    this.letter = letter;
  }
}

class OneOf {
  constructor(array) {
    this.array = array;
  }
}

function s(key) {
  return new Any(key);
}

function matchIndividual(expr, test) {
  if (expr instanceof Any) {
    return true;
  } else if (expr instanceof OneOf) {
    return expr.array.includes(test);
  } else if (expr instanceof RegExp) {
    return expr.test(test);
  } else {
    return expr === test;
  }
}

s.match = (cases) => (test) =>
  cases.find(([expr]) => {
    if (expr instanceof Array) {
      let captures = new Map();
      let i = 0;
      for (let sub of expr) {
        if (sub instanceof Any) {
          if (captures.has(sub.letter) && captures.get(sub.letter) !== test[i])
            return false;
          captures.set(sub.letter, test[i]);
        }
        if (!matchIndividual(sub, test[i])) return false;
        i++;
      }
      return true;
    } else {
      return matchIndividual(expr, test);
    }
  })?.[1];

s.any = new Any();

s.else = new Any();

s.oneOf = (array) => new OneOf(array);

s.case = (array) => array;

export default s;
