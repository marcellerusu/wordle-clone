import { useState } from "react";
import HelpModal from "./components/HelpModal";
import Nav from "./components/Nav";
import Store from "./store";

function App() {
  const state = Store.fromState(useState());
  const [{ isHelpVisible }, { hideHelp }] = state;
  return (
    <Store.context.Provider value={state}>
      <Nav />
      {isHelpVisible && <HelpModal onClose={hideHelp} />}
    </Store.context.Provider>
  );
}

export default App;
