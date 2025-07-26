import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header, Title, HeaderContainer } from "../elements/Header";
import Button from "../elements/Button";
import { Form, Input, ButtonContainer } from "../elements/FormElements";
import login from "../../src/assets/images/login.svg";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Alert from "../elements/Alert";
import EyeOff from "../assets/images/eye_off.svg?react";
import EyeShow from "../assets/images/eye_show.svg?react";
import useIsMobile from "../hooks/useIsMobile";

const Svg = styled.img`
  width: fit-content;
  max-height: 8.25rem;
  margin: 0 auto;

  @media (max-width: 60rem) {
    /* 950px */
    width: auto;
  }
`;

const ShowPasswordBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #555;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

function Login() {
  const navigate = useNavigate();
  const [mail, changeMail] = useState("");
  const [password, changePassword] = useState("");
  const [alertStatus, changeAlertStatus] = useState(false);
  const [alert, changeAlert] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "email") {
      changeMail(e.target.value);
    } else {
      changePassword(e.target.value);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changeAlertStatus(false);
    changeAlert("");

    const regExp = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
    if (!regExp.test(mail) || mail === "" || password === "") {
      changeAlertStatus(true);
      changeAlert("We cant find this user.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, mail, password);
      navigate("/");
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
        <title>Login</title>
      </Helmet>

      <Header>
        <HeaderContainer>
          <Title>Login</Title>
          <div>
            <Button to="/sign-up">Sign up</Button>
          </div>
        </HeaderContainer>
      </Header>

      <Svg src={login} alt="" />

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
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />
          <ShowPasswordBtn type="button" onClick={toggleShowPassword}>
            {showPassword ? (
              <EyeOff
                style={isMobile ? { width: "2rem" } : { width: "3rem" }}
              />
            ) : (
              <EyeShow
                style={isMobile ? { width: "2rem" } : { width: "3rem" }}
              />
            )}
          </ShowPasswordBtn>
        </PasswordWrapper>

        <ButtonContainer>
          <Button as="button" to="/" $primary type="submit">
            Login
          </Button>
        </ButtonContainer>
      </Form>

      <Alert
        $type="error"
        $message={alert}
        $alertStatus={alertStatus}
        $changeAlertStatus={changeAlertStatus}
      />
    </>
  );
}

export default Login;
