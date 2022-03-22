import { useContext } from "react";
import styled from "styled-components";
import Gear from "../icons/Gear";
import Hamburger from "../icons/Hamburger";
import QuestionMark from "../icons/QuestionMark";
import Scores from "../icons/Scores";
import { colors } from "../utils";
import Store from "../store";
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  border-bottom: 1px solid ${colors.lightGrey};
`;

const Group = styled.div`
  svg:nth-child(2) {
    margin-left: 10px;
  }
  * {
    cursor: pointer;
  }
  display: flex;
`;

const Title = styled.h1`
  margin: 0;
  font-family: "nyt-karnakcondensed";
`;

const Nav = () => {
  const [, { showHelp }] = useContext(Store.context);
  return (
    <NavContainer>
      <Group>
        <Hamburger />
        <QuestionMark onClick={showHelp} />
      </Group>
      <Group>
        <Title>Wordle</Title>
      </Group>
      <Group>
        <Scores />
        <Gear />
      </Group>
    </NavContainer>
  );
};

export default Nav;
