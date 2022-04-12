import { useState } from "react";
import HelpModal from "./Root/HelpModal";
import Nav from "./Root/Nav";
import More from "./Root/More";
import GlobalStore from "./store/global";
import Game from "./Game/Game";

function App() {
  const state = GlobalStore.fromState(useState());
  const [{ isHelpVisible, isMoreMenuVisible }, { hideHelp }] = state;
  return (
    <GlobalStore.Provider value={state}>
      <Nav />
      <Game />
      {isHelpVisible && <HelpModal onClose={hideHelp} />}
      {isMoreMenuVisible && <More />}
    </GlobalStore.Provider>
  );
}

export default App;
