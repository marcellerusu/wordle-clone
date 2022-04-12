import { useState } from "react";
import styled from "styled-components";
import BackSpace from "../icons/BackSpace";
import { useKeyDown } from "./utils";
import css from "../css/cssStates";

let KeyRow = styled.div`
  display: flex;
`;

let Key = styled.div`
  transition: all 20ms linear;
  &[data-state~="pressing"] {
    transform: scale(1.1);
  }
  &[data-state~="guessed"] {
    background: #4f4f4f;
    color: white;
  }
  background: #d3d6da;
  text-align: center;
  font-weight: bolder;
  display: flex;
  align-items: center;
  height: 1.5em;
  margin: 4px;
  padding: 1em;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #d3d6da99;
  }
`;

let KeyboardContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
`;

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", <BackSpace />],
];

function Keyboard({ guesses }) {
  let [pressedKey, setKey] = useState(null);

  function setKeyTemporarily(key) {
    setKey(key);
    setTimeout(() => setKey(null), 200);
  }

  useKeyDown({
    Backspace() {
      setKeyTemporarily("BACK");
    },
    Enter() {
      setKeyTemporarily("ENTER");
    },
    on(key) {
      setKeyTemporarily(key.toUpperCase());
    },
  });

  function keyState(key) {
    if (typeof key !== "string") key = "BACK";

    return css.define({
      pressing: key === pressedKey,
      guessed: guesses.slice(0, -1).some((guess) => guess.includes(key)),
    });
  }

  return (
    <KeyboardContainer>
      {KEYS.map((row, i) => (
        <KeyRow key={`keyboard-row-${i}`}>
          {row.map((key) => (
            <Key data-state={keyState(key)} key={key}>
              {key}
            </Key>
          ))}
        </KeyRow>
      ))}
    </KeyboardContainer>
  );
}

export default Keyboard;
