import { Helmet } from "react-helmet-async";
import {
  Header,
  Title,
  HeaderContainer,
  ButtonContainer,
} from "./elements/Header";
import LogoutButton from "./elements/LogoutBtn";
import ExpensesForm from "./components/ExpensesForm";
import TotalBar from "./components/totalBar";
import CatIcon from "./assets/images/cat_icon.svg?react";
import ListIcon from "./assets/images/list_icon.svg?react";
import PiggyBank from "./assets/images/piggy_bank.svg?react";
import Money from "./assets/images/money.svg?react";
import useIsMobile from "./hooks/useIsMobile";
import BalanceBar from "./components/BalanceBar";
// import MobileMenu from "./components/MobileMenu";
import Button from "./elements/Button";

function App() {
  const isMobile = useIsMobile();

  return (
    <>
      <Helmet>
        <title>Add expenses</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>

      <div>
        <Header>
          <HeaderContainer>
            <ButtonContainer>
              <Button to="/categories">
                {isMobile ? (
                  <CatIcon style={{ width: "1.5rem", height: "1.5rem" }} />
                ) : (
                  <span>Categories</span>
                )}
              </Button>
              <Button to="/list">
                {isMobile ? (
                  <ListIcon style={{ width: "1.5rem", height: "1.5rem" }} />
                ) : (
                  <span>Expenses</span>
                )}
              </Button>
              <Button to="/money-box">
                {isMobile ? (
                  <PiggyBank style={{ width: "1.5rem", height: "1.5rem" }} />
                ) : (
                  <span>Piggy</span>
                )}
              </Button>
              <Button to="/budget-list">
                {isMobile ? (
                  <Money style={{ width: "1.5rem", height: "1.5rem" }} />
                ) : (
                  <span>Budget</span>
                )}
              </Button>
              <LogoutButton />
            </ButtonContainer>
          </HeaderContainer>
        </Header>
        <Title>Add expenses</Title>

        <ExpensesForm />
      </div>
      <BalanceBar />
      <TotalBar />
    </>
  );
}

export default App;
