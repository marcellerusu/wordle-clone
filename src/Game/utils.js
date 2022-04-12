import { useContext, useEffect } from "react";
import Store from "../store/global";

export function useKeyDown(handlers, dependencies = []) {
  let [{ isHelpVisible, paused }] = useContext(Store.context);
  useEffect(() => {
    function onKeyDown(e) {
      if (paused) return;
      if (isHelpVisible) return;
      if (e.key in handlers) {
        handlers[e.key]();
      } else if (handlers.on && e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        handlers.on(e.key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isHelpVisible, paused, ...dependencies]);
}
