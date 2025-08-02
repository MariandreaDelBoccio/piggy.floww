import styled from "styled-components";

const Header = styled.div`
  width: auto;
  padding: 1.5rem; /* 40px */
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 60rem) {
    /* 950px */
    justify-content: start;
  }
`;

const Title = styled.h1`
  font-weight: normal;
  font-size: 2.5rem; /* 40px */
  text-align: center;
  margin-top: 2rem;

  @media (max-width: 60rem) {
    /* 950px */
    font-size: 2rem; /* 32px */
    margin-top: 0;
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 60rem) {
    /* 950px */
    display: flex;
    flex-direction: column-reverse;
    align-items: center;

    & > div {
      display: flex;
      margin-bottom: 1.25rem; /* 20px */
      justify-content: end;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 60rem) {
    /* 950px */
   width: 70vw;
   flex-wrap: wrap;
   justify-content: center!important;
  }
`;

export { Header, Title, HeaderContainer, ButtonContainer };
