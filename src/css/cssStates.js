export default {
  define(states) {
    let state = "";
    for (let key in states) {
      if (!states[key]) continue;
      state += key + " ";
    }
    return state.trim();
  },
};
