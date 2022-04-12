import createStore from "./utils";

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
