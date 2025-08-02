import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header, Title, HeaderContainer } from "../elements/Header";
import Button from "../elements/Button";
import { Form, Input, ButtonContainer } from "../elements/FormElements";
import signUp from "../../src/assets/images/signup.svg";
import styled from "styled-components";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Alert from "../elements/Alert";
import EyeOff from "../assets/images/eye_off.svg?react";
import EyeShow from "../assets/images/eye_show.svg?react";
import useIsMobile from "../hooks/useIsMobile";
import theme from "../theme";

const Svg = styled.img`
  margin: 1rem auto;
  max-height: 5.25rem;
  width: fit-content;
`;

const ShowPasswordBtn = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2; /* botón sobre input */
  background: none;
  border: none;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 20rem;

  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

function SignUp() {
  const navigate = useNavigate();
  const [mail, changeMail] = useState("");
  const [password, changePassword] = useState("");
  const [password2, changePassword2] = useState("");
  const [alertStatus, changeAlertStatus] = useState(false);
  const [alert, changeAlert] = useState("");
  const [alertType, changeAlertType] = useState("error");
  const [showFirstPassword, setShowFirstPassword] = useState(false);
  const [showLastPassword, setShowLastPassword] = useState(false);
  const isMobile = useIsMobile();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "email":
        changeMail(e.target.value);
        break;
      case "password":
        changePassword(e.target.value);
        break;
      case "password2":
        changePassword2(e.target.value);
        break;
      default:
        break;
    }
  };

  const toggleShowFirstPassword = () => {
    setShowFirstPassword(!showFirstPassword);
  };

  const toggleShowLastPassword = () => {
    setShowLastPassword(!showLastPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changeAlertStatus(false);
    changeAlert("");

    const regExp = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
    if (
      !regExp.test(mail) ||
      mail === "" ||
      password === "" ||
      password2 === "" ||
      password !== password2
    ) {
      changeAlertStatus(true);
      changeAlert("Please check the email and if passwords are equal.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, mail, password);
      changeAlertStatus(true);
      changeAlert("User successfully created.");
      changeAlertType("success");

      // Wait for the alert to show up
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (e: unknown) {
      changeAlertStatus(true);
      const error = e as { code: string; message: string };
      const errString = error.message
        .split("/")[1]
        .replace(")", "")
        .replace(/-/g, " ");
      changeAlert(errString.charAt(0).toUpperCase() + errString.substring(1));
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>

      <Header>
        <HeaderContainer>
          <Title>Sign Up</Title>
          <div className="flex justify-center">
            <Button
              to="/login"
              $color={theme.grisClaro2}
              $textColor={theme.colorSecundario}
            >
              Login
            </Button>
          </div>
        </HeaderContainer>
      </Header>

      <Svg src={signUp} alt="" />

      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={mail}
          onChange={handleChange}
        />
        <PasswordWrapper>
          <Input
            type={showFirstPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />
          <ShowPasswordBtn
            type="button"
            onClick={() => toggleShowFirstPassword()}
          >
            {showFirstPassword ? (
              <EyeOff
                style={{
                  width: isMobile ? "1.5rem" : "1.8rem",
                  height: isMobile ? "1.5rem" : "1.8rem",
                }}
              />
            ) : (
              <EyeShow
                  style={{
                  width: isMobile ? "1.5rem" : "1.8rem",
                  height: isMobile ? "1.5rem" : "1.8rem",
                }}
              />
            )}
          </ShowPasswordBtn>
        </PasswordWrapper>
        <PasswordWrapper>
          <Input
            type={showLastPassword ? "text" : "password"}
            name="password2"
            placeholder="Repeat password"
            value={password2}
            onChange={handleChange}
          />
          <ShowPasswordBtn
            type="button"
            onClick={() => toggleShowLastPassword()}
          >
            {showLastPassword ? (
              <EyeOff
                style={{
                  width: isMobile ? "1.5rem" : "1.8rem",
                  height: isMobile ? "1.5rem" : "1.8rem",
                }}
              />
            ) : (
              <EyeShow
                style={{
                  width: isMobile ? "1.5rem" : "1.8rem",
                  height: isMobile ? "1.5rem" : "1.8rem",
                }}
              />
            )}
          </ShowPasswordBtn>
        </PasswordWrapper>
        <ButtonContainer>
          <Button
            as="button"
            to="/"
            type="submit"
            $color={theme.colorSecundario}
            $width="20rem"
          >
            Sign Up
          </Button>
        </ButtonContainer>
      </Form>

      <Alert
        $type={alertType}
        $message={alert}
        $alertStatus={alertStatus}
        $changeAlertStatus={changeAlertStatus}
      />
    </>
  );
}

export default SignUp;
