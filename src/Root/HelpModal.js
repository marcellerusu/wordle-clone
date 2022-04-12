import styled from "styled-components";
import { useState } from "react";
import Overlay from "./Overlay";
import CloseIcon from "../icons/Close";
import GameTile from "../Game/GameTile";

const Modal = styled.article`
  box-shadow: 0 4px 23px 0 rgb(0 0 0 / 20%);
  background: white;
  width: 100%;
  border-radius: 8px;
  padding: 1em;

  &[data-state="opening"] {
    animation-name: slide-in;
    animation-duration: 200ms;
  }

  &[data-state="closing"] {
    animation-name: slide-out;
    animation-duration: 200ms;
  }

  @keyframes slide-in {
    0% {
      transform: translate(0, 200%);
    }
    100% {
      transform: translate(0, 0%);
    }
  }

  @keyframes slide-out {
    0% {
      transform: translate(0, 0%);
    }
    100% {
      transform: translate(0, 200%);
    }
  }
`;

const Row = styled.div`
  display: flex;
`;

const HelpModal = ({ onClose }) => {
  const [openingState, setOpeningState] = useState("opening");

  const handleClose = (e) => {
    e.stopPropagation();
    setOpeningState("closing");
    setTimeout(onClose, 100);
  };

  return (
    <Overlay onClose={handleClose}>
      <Modal onClick={handleClose} data-state={openingState}>
        <CloseIcon />
        <p>
          Guess the <strong>WORDLE</strong> in six tries.
        </p>
        <p>
          Each game must be a valid five-letter word. Hit the enter button to
          submit.
        </p>
        <p>
          After each guess, the color of the tiles will change to show how close
          your guess was to the word.
        </p>
        <hr />
        <p>
          <strong>Examples</strong>
        </p>
        <Row>
          <GameTile data-state="correct">W</GameTile>
          <GameTile data-state="empty">E</GameTile>
          <GameTile data-state="empty">A</GameTile>
          <GameTile data-state="empty">R</GameTile>
          <GameTile data-state="empty">Y</GameTile>
        </Row>
        <p>
          The letter <strong>W</strong> is in the word and in the correct spot.
        </p>
        <Row>
          <GameTile data-state="empty">P</GameTile>
          <GameTile data-state="wrong-location">I</GameTile>
          <GameTile data-state="empty">L</GameTile>
          <GameTile data-state="empty">L</GameTile>
          <GameTile data-state="empty">S</GameTile>
        </Row>
        <p>
          The letter <strong>I</strong> is in the word but in the wrong spot.
        </p>
        <Row>
          <GameTile data-state="empty">V</GameTile>
          <GameTile data-state="empty">A</GameTile>
          <GameTile data-state="incorrect">G</GameTile>
          <GameTile data-state="empty">U</GameTile>
          <GameTile data-state="empty">E</GameTile>
        </Row>
        <p>
          The letter <strong>U</strong> is not in the word in any spot.
        </p>
        <hr />
        <strong>A new WORDLE will be available each day!</strong>
      </Modal>
    </Overlay>
  );
};

export default HelpModal;
