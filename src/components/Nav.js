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
  margin-top: -0.25em;
  margin-bottom: -1em;
  font-size: 2.5em;
  font-family: "nyt-karnakcondensed";
`;

const Nav = () => {
  const [, { showHelp, showMoreMenu }] = useContext(Store.context);
  return (
    <NavContainer>
      <Group>
        <Hamburger onClick={showMoreMenu} />
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
