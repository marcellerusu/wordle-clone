import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GameTile from "./GameTile";
import WORDS from "../words.json";
import Keyboard from "./Keyboard";
import { useKeyDown } from "./utils";

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
