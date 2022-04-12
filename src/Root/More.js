import { useContext } from "react";
import styled from "styled-components";
import Store from "../store/global";
import Overlay from "./Overlay";

const Container = styled.div`
  box-shadow: 0 4px 23px 0 rgb(0 0 0 / 20%);
`;

const More = () => {
  const [, { hideMoreMenu }] = useContext(Store.context);
  return (
    <Overlay left onClose={hideMoreMenu}>
      <Container>test</Container>
    </Overlay>
  );
};

export default More;
