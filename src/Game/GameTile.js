import styled from "styled-components";
import colors from "../constants/colors";

const size = {
  large: 60,
  small: 40,
  fontLrg: 45,
  fontSm: 33,
};

const GameTile = styled.div`
  /* Root styling start */
  font-weight: bolder;
  font-family: "Helvetica Neue";
  text-align: center;
  &:not(:first-child) {
    margin-left: 5px;
  }
  width: ${({ large }) => (large ? size.large : size.small)}px;
  height: ${({ large }) => (large ? size.large : size.small)}px;
  font-size: ${({ large }) => (large ? size.fontLrg : size.fontSm)}px;
  margin: 0;
  /* Root styling end */
  /* Animation start */
  @keyframes rotate {
    0% {
      background: white;
      border: 2px solid #878a8c;
      transform: rotateX(-180deg);
    }
    100% {
      transform: rotateX(0deg);
    }
  }

  @keyframes expand {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  &[data-state="guess"] {
    animation-name: expand;
    animation-duration: 200ms;
    border: 2px solid #878a8c;
  }
  &[data-state="correct"] {
    animation-name: rotate;
    animation-duration: 1s;
    background: rgb(${colors.green});
  }
  &[data-state="wrong-location"] {
    animation-name: rotate;
    animation-duration: 1s;
    background: rgb(${colors.yellow});
  }
  &[data-state="incorrect"] {
    animation-name: rotate;
    animation-duration: 1s;
    background: rgb(${colors.grey});
  }
  /* Animation end */
  &:not([data-state="empty"], [data-state="guess"]) {
    color: white;
    border: 2px solid #00000000;
  }
  &[data-state="empty"] {
    border: 2px solid #878a8c;
  }
`;

export default GameTile;
