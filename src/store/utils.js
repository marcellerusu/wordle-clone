import React from "react";

function createStore(value, { computed, setters }) {
  const context = React.createContext(value);

  const Provider = context.Provider;

  const fromState = ([state = value, setState]) => {
    const computedAndSetters = {};
    for (const key in computed) {
      computedAndSetters[key] = computed[key](state);
    }
    for (const key in setters) {
      computedAndSetters[key] = (...args) =>
        setState(setters[key](state, ...args));
    }
    return [state, computedAndSetters];
  };

  return { context, Provider, fromState };
}

export default createStore;
