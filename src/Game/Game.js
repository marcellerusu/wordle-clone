import React, { useState } from "react";
import styled from "styled-components";
import GameTile from "./GameTile";
import WORD_OF_THE_DAY from "../store/words";
import Keyboard from "./Keyboard";
import { useKeyDown } from "./utils";
import * as fp from "../fp";
import s from "../schema";

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

let STATES = {
  NOTHING: "empty",
  GUESS: "guess",
  CORRECT: "correct",
  WRONG_LOCATION: "wrong-location",
  WRONG: "incorrect",
};

function GuessedRow({ word, rowIndex }) {
  let match = fp
    .zip(WORD_OF_THE_DAY, word)
    .map(
      s.match([
        s.case([s("letter"), s("letter")], STATES.CORRECT),
        s.case([s.any, s.oneOf(WORD_OF_THE_DAY)], STATES.WRONG_LOCATION),
        s.case(s.else, STATES.WRONG),
      ])
    );

  return (
    <RowContainer>
      {[...word].map((letter, i) => (
        <GameTile
          data-state={match[i]}
          large
          key={`worlde-guessed-game-tile-${rowIndex}-${i}-${letter}`}
        >
          {letter}
        </GameTile>
      ))}
    </RowContainer>
  );
}

let INCOMPLETE_ROW_STATES = {
  true: "shaking",
  false: "default",
};

function IncompleteRow({ word, rowIndex }) {
  word = word.padEnd(5);
  let [isShaking, setIsShaking] = useState(false);
  let match = [...word].map(
    s.match([
      [/[a-z]/, STATES.GUESS],
      [" ", STATES.NOTHING],
    ])
  );

  useKeyDown(
    {
      Enter() {
        let trimmedWord = word.trim();
        setIsShaking(trimmedWord.length < 5 && trimmedWord.length > 0);
        setTimeout(() => setIsShaking(false), 200);
      },
    },
    [word]
  );

  return (
    <RowContainer data-state={INCOMPLETE_ROW_STATES[isShaking]}>
      {[...word].map((letter, i) => (
        <GameTile
          data-state={match[i]}
          large
          key={`worlde-game-tile-${rowIndex}-${i}-${letter}`}
        >
          {letter}
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
      letter = letter.toUpperCase();
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
        {Array.from({ length: 6 }).map((_, i) =>
          i < guesses.length - 1 ? (
            <GuessedRow
              key={`worlde-guessed-row-${i}`}
              word={(guesses[i] || "").toLowerCase()}
              rowIndex={i}
            />
          ) : (
            <IncompleteRow
              key={`worlde-incomplete-row-${i}`}
              word={(guesses[i] || "").toLowerCase()}
              rowIndex={i}
            />
          )
        )}
      </Container>
      <Keyboard guesses={guesses} />
    </MainContainer>
  );
}

export default Game;
