import React from "react";

function createStore(value, { computed, setters }) {
  const context = React.createContext(value);

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

  return { context, fromState };
}

const defaultState = {
  isHelpVisible: true,
  isMoreMenuVisible: false,
  paused: false,
};

export default createStore(defaultState, {
  setters: {
    showHelp(state) {
      return { ...state, isHelpVisible: true };
    },
    pause(state) {
      return { ...state, paused: true };
    },
    unpause(state) {
      return { ...state, paused: false };
    },
    hideHelp(state) {
      return { ...state, isHelpVisible: false };
    },
    showMoreMenu(state) {
      return { ...state, isMoreMenuVisible: true };
    },
    hideMoreMenu(state) {
      return { ...state, isMoreMenuVisible: false };
    },
  },
});
