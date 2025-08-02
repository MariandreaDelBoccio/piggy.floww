import styled from "styled-components";
import theme from "../theme";

const FormContainer = styled.div`
  border: 1px solid ${theme.grisClaro2};
  border-radius: 0.625rem;
`

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 1.87rem; /* 30px */
  align-items: flex-start;

  @media (max-width: 60rem) {
    /* 950px */
    flex-direction: column;

    & > * {
      width: 100%;
      margin-bottom: 0.62rem; /* 10px */
    }
  }
`;

const Form = styled.form`
  padding: 0 2.5rem; /* 40px */
  align-items: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  input {
    text-align: center;
    padding: 1rem 0;
    font-family: "Work Sans", sans-serif;
    &::placeholder {
      color: rgba(0, 0, 0, 0.2);
    }
  }

  @media (max-width: 60rem) {
    /* 950px */
    justify-content: start;
    margin-top: 2rem;
  }
`;

const Input = styled.input`
  font-size: 1rem; 
  border: 1px solid ${theme.grisClaro2};
  border-radius: 0.625rem;
  width: 20rem;
  height: 3rem;

  @media (max-width: 60rem) {
    /* 950px */
    font-size: 2.2rem; /* 24px */
    width: 100%;
  }
`;

const BigInput = styled.input`
  font-size: 4.37rem; /* 70px */
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 2.5rem 0; /* 40px */
`;

export { FilterContainer, Form, Input, BigInput, ButtonContainer, FormContainer };
