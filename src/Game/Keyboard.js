import { useState } from "react";
import styled from "styled-components";
import BackSpace from "../icons/BackSpace";
import { useKeyDown } from "./utils";
import WORD_OF_THE_DAY from "../store/words";
import css from "../css/cssStates";
import colors from "../constants/colors";

let KeyRow = styled.div`
  display: flex;
`;

let Key = styled.div`
  transition: all 20ms linear;
  &[data-state~="pressing"] {
    --key-background: ${colors.lightGrey};
    transform: scale(1.1);
  }
  &[data-state~="guessed"] {
    --key-background: ${colors.grey};
    color: white;
  }
  &[data-state~="wrong-location"] {
    --key-background: ${colors.yellow};
  }
  &[data-state=""] {
    --key-background: ${colors.lightGrey};
  }
  background: rgb(var(--key-background));
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
    background: rgba(var(--key-background), 50%);
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

  function setKeyTemporarilyTo(key) {
    setKey(key);
    setTimeout(() => setKey(null), 200);
  }

  useKeyDown({
    Backspace() {
      setKeyTemporarilyTo("BACK");
    },
    Enter() {
      setKeyTemporarilyTo("ENTER");
    },
    on(key) {
      setKeyTemporarilyTo(key.toUpperCase());
    },
  });

  function keyState(key) {
    if (typeof key !== "string") key = "BACK";
    let pressing = key === pressedKey;
    let guessed = guesses.slice(0, -1).some((guess) => guess.includes(key));
    let wrongLocation =
      guessed && WORD_OF_THE_DAY.map((l) => l.toUpperCase()).includes(key);

    return css.define({
      pressing,
      guessed,
      "wrong-location": wrongLocation,
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
