import styled from "styled-components";
import { Link } from "react-router-dom";
import type { ButtonProps } from "../types/types";

const buttonColor = (props: ButtonProps) => {
  if (props.$primary) {
    return "#5B69E2";
  } else if (props.$color) {
    return props.$color;
  } else if (props.$flat) {
    return "";
  }

  return "#000";
};

const Button = styled(Link)<ButtonProps>`
  background: ${(props) => buttonColor(props)};
  width: ${(props) => (props.$hasIcon ? "fit-content" : "auto")}; /* 250px */
  border: none;
  border-radius: 0.625rem; /* 10px */
  color: ${(props) => (props.$textColor ? props.$textColor : "#fff")};
  font-family: "Work Sans", sans-serif;
  height: 2.75rem; /* 60px */
  padding: 1.25rem 1.87rem; /* 20px 30px */
  font-size: 1.25rem; /* 20px */
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  outline: none;
  margin: 5px;

  svg {
    height: ${(props) => (props.$bigIcon ? "100%" : "0.75rem;")}; /* 12px */
    fill: white;
  }
`;

export default Button;
