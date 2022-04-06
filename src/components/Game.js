import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Store from "../store";
import GameTile from "./GameTile";
import WORDS from "../words.json";
import BackSpace from "../icons/BackSpace";

let Container = styled.div`
  margin-top: 4em;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

let RowContainer = styled.div`
  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
  animation: ${({ shake }) =>
    shake ? "shake 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both" : "unset"};
  transform: translate3d(0, 0, 0);
  display: flex;
  margin-top: 0.5em;
`;

function useKeyDown(handlers, fallbackHandler) {
  let [{ isHelpVisible, paused }] = useContext(Store.context);
  useEffect(() => {
    function onKeyDown(e) {
      if (paused) return;
      if (isHelpVisible) return;
      if (e.key in handlers) {
        handlers[e.key]();
      } else if (fallbackHandler) {
        fallbackHandler(e.key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isHelpVisible, paused]);
}

let oneDay = 1000 * 60 * 60 * 24;

let WORD_OF_THE_DAY = [
  ...WORDS[Math.floor(new Date().getTime() / oneDay) - 19084],
];

let STATES = {
  NOTHING: "empty",
  GUESS: "guess",
  CORRECT: "correct",
  WRONG_LOCATION: "wrong-location",
  WRONG: "incorrect",
};

let emptyCheckState = Array.from({ length: 5 }, () => STATES.NOTHING);

function useCheck(word, flipped) {
  let [match, setMatch] = useState(emptyCheckState);
  word = word?.toLowerCase();
  let isFullWord = word?.length === 5;
  useEffect(() => {
    if (!isFullWord || !flipped) {
      setMatch(
        Array.from({ length: 5 }, (_, i) =>
          word?.[i] ? STATES.GUESS : STATES.NOTHING
        )
      );
      return;
    }
    setMatch(
      WORD_OF_THE_DAY.map((letter, index) => {
        if (word[index] === letter) {
          return STATES.CORRECT;
        } else if (WORD_OF_THE_DAY.includes(word[index])) {
          return STATES.WRONG_LOCATION;
        }
        return STATES.WRONG;
      })
    );
  }, [word, flipped]);
  return match;
}

function Row({ word, rowIndex, flipped }) {
  let [shake, setShake] = useState(false);
  let match = useCheck(word, flipped);
  useKeyDown({
    Enter() {
      setShake(true);
      setTimeout(() => setShake(false), 200);
    },
  });
  return (
    <RowContainer shake={shake && word?.length < 5 && word?.length > 0}>
      {Array.from({ length: 5 }, (_, i) => (
        <GameTile
          data-state={match[i]}
          large
          key={`worlde-game-tile-${rowIndex}-${i}-${word?.[i]}`}
        >
          {word?.[i] || ""}
        </GameTile>
      ))}
    </RowContainer>
  );
}

let KeyRow = styled.div`
  display: flex;
`;

function getKey(children) {
  let [child] = React.Children.toArray(children);
  if (typeof child === "string") {
    return child;
  } else {
    return "BACK";
  }
}

let Key = styled.div`
  background: ${({ pressedKey, children }) =>
    pressedKey === getKey(children) ? "#d3d6da99" : "#d3d6da"};
  text-align: center;
  transition: all 20ms linear;
  transform: ${({ pressedKey, children }) =>
    pressedKey === getKey(children) ? "scale(1.1)" : "scale(1)"};
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

function Keyboard() {
  let [pressedKey, setKey] = useState(null);
  function unsetKey() {
    setTimeout(() => setKey(null), 200);
  }
  useKeyDown(
    {
      Backspace() {
        setKey("BACK");
        unsetKey();
      },
      Enter() {
        setKey("ENTER");
        unsetKey();
      },
    },
    (key) => {
      setKey(key.toUpperCase());
      unsetKey();
    }
  );

  return (
    <KeyboardContainer>
      {KEYS.map((row, i) => (
        <KeyRow key={`keyboard-row-${i}`}>
          {row.map((key) => (
            <Key
              onClick={() => {
                if (key === "ENTER") key = "Enter";
                if (typeof key !== "string") key = "Backspace";
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { keyCode: key })
                );
              }}
              pressedKey={pressedKey}
              key={key}
            >
              {key}
            </Key>
          ))}
        </KeyRow>
      ))}
    </KeyboardContainer>
  );
}

let MainContainer = styled.div`
  height: 100%;
`;

function Game() {
  let [guesses, setGuesses] = useState([""]);

  useKeyDown(
    {
      Enter() {
        setGuesses((guesses) => {
          if (!guesses.at(-1)) return guesses;
          if (guesses.at(-1).length < 5) return guesses;
          return [...guesses, ""];
        });
      },
      Backspace() {
        setGuesses((guesses) => {
          let [prevWords, currWord] = [guesses.slice(0, -1), guesses.at(-1)];
          return [...prevWords, currWord.slice(0, -1)];
        });
      },
    },
    (letter) => {
      setGuesses((guesses) => {
        let currWord = guesses.at(-1);
        if (currWord.length === 5) {
          return guesses;
        }
        return [...guesses.slice(0, -1), currWord + letter];
      });
    }
  );

  return (
    <MainContainer>
      <Container>
        {Array.from({ length: 6 }).map((_, i) => (
          <Row
            key={`worlde-guess-row-${i}`}
            word={guesses[i]}
            rowIndex={i}
            flipped={i < guesses.length - 1}
          />
        ))}
      </Container>
      <Keyboard />
    </MainContainer>
  );
}

export default Game;
