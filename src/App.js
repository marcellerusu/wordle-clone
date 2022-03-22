import { useState } from "react";
import HelpModal from "./components/HelpModal";
function App() {
  const [showHelp, setShowHelp] = useState(true);
  return (
    <div>
      Test
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;
