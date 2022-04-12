import React, { useContext, useEffect, useState } from "react";
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
  &[data-state="shaking"] {
    animation: shake 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
  transform: translate3d(0, 0, 0);
  display: flex;
  margin-top: 0.5em;
`;

function useKeyDown(handlers, dependencies = []) {
  let [{ isHelpVisible, paused }] = useContext(Store.context);
  useEffect(() => {
    function onKeyDown(e) {
      if (paused) return;
      if (isHelpVisible) return;
      if (e.key in handlers) {
        handlers[e.key]();
      } else if (handlers.on && e.key.length === 1) {
        handlers.on(e.key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isHelpVisible, paused, ...dependencies]);
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
  useEffect(() => {
    let isFullWord = word?.length === 5;
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

let ROW_STATES = {
  true: "shaking",
  false: "default",
};

function Row({ word, rowIndex, flipped }) {
  let [isShaking, setIsShaking] = useState(false);
  let match = useCheck(word, flipped);
  useKeyDown(
    {
      Enter() {
        setIsShaking(word?.length < 5 && word?.length > 0);
        setTimeout(() => setIsShaking(false), 200);
      },
    },
    [word]
  );

  return (
    <RowContainer data-state={ROW_STATES[isShaking]}>
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

function combineCssStates(states) {
  let state = "";
  for (let key in states) {
    if (!states[key]) continue;
    state += key + " ";
  }
  return state.trim();
}

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

    let guessed = guesses
      .slice(0, -1)
      .some((guess) => guess.toUpperCase().includes(key));

    let pressing = key === pressedKey;

    return combineCssStates({ pressing, guessed });
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

let MainContainer = styled.div`
  height: 100%;
`;

function Game() {
  let [guesses, setGuesses] = useState([""]);

  useKeyDown({
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
    on(letter) {
      setGuesses((guesses) => {
        let currWord = guesses.at(-1);
        if (currWord.length === 5) {
          return guesses;
        }
        return [...guesses.slice(0, -1), currWord + letter];
      });
    },
  });

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
      <Keyboard guesses={guesses} />
    </MainContainer>
  );
}

export default Game;
