import styled from "styled-components";

const Modal = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(100% / 2);
  max-width: 500px;
  min-width: 500px;
  height: fit-content;
`;

const ModalContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: ${({ left }) => (left ? "start" : "center")};
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Overlay = ({ left, children, onClose }) => {
  return (
    <ModalContainer tabIndex="-1" onClick={onClose}>
      <Modal left>{children}</Modal>
    </ModalContainer>
  );
};

export default Overlay;
