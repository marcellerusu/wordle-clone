import { useState } from "react";
import HelpModal from "./components/HelpModal";
import Nav from "./components/Nav";
import More from "./components/More";
import Store from "./store";
import Game from "./components/Game";

function App() {
  const state = Store.fromState(useState());
  const [{ isHelpVisible, isMoreMenuVisible }, { hideHelp }] = state;
  return (
    <Store.context.Provider value={state}>
      <Nav />
      <Game />
      {isHelpVisible && <HelpModal onClose={hideHelp} />}
      {isMoreMenuVisible && <More />}
    </Store.context.Provider>
  );
}

export default App;
