import { Helmet } from "react-helmet-async";
import { Header, Title } from "../elements/Header";
import BackBtn from "../elements/BackBtn";
import TotalBar from "./totalBar";
import useGetExpenses from "../hooks/useGetExpenses";
import {
  List,
  ElementList,
  Category,
  Description,
  Value,
  Date,
  ButtonContainer,
  ActionButton,
  LoadButton,
  ContainerButtonCentral,
  ContainerSubtitle,
  Subtitle,
} from "../elements/ListElements";
import CategoryICon from "../elements/CategoryIcons";
import formatCurrency from "../functions/currencyConvertion";
import DeleteIcon from "../assets/images/borrar.svg?react";
import EditIcon from "../assets/images/editar.svg?react";
import { Link } from "react-router-dom";
import Button from "../elements/Button";
import type { FbStorageExpenses } from "../types/types";
import deleteExpense from "../firebase/deleteExpense";
import { formatDate } from "../hooks/useFormatDate";
import BalanceBar from "./BalanceBar";

function ExpensesList() {
  const [expenses, getMoreExpenses, moreToLoad] = useGetExpenses();

  const sameDate = (
    expenses: FbStorageExpenses[],
    index: number,
    expense: FbStorageExpenses,
  ) => {
    if (index !== 0) {
      const actualDate = formatDate(expense.date);
      const lastDayExpense = formatDate(expenses[index - 1].date);

      if (actualDate === lastDayExpense) return true;
    }
  };

  return (
    <>
      <Helmet>
        <title>Expenses list</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>
      <Header>
        <BackBtn />
        <Title>Expenses list</Title>
      </Header>

      <List>
        {expenses.map((expense, index) => {
          return (
            <div key={expense.id}>
              {!sameDate(expenses, index, expense) && (
                <Date>{formatDate(expense.date)}</Date>
              )}
              <ElementList key={expense.id}>
                <Category>
                  <CategoryICon id={expense.category} />
                  {expense.category}
                </Category>

                <Description>{expense.description}</Description>
                <Value>{formatCurrency(Number(expense.quantity))}</Value>

                <ButtonContainer>
                  <ActionButton as={Link} to={`/edit/${expense.id}`}>
                    <EditIcon />
                  </ActionButton>
                  <ActionButton
                    onClick={() => deleteExpense(expense.id as string)}
                  >
                    <DeleteIcon />
                  </ActionButton>
                </ButtonContainer>
              </ElementList>
            </div>
          );
        })}

        {moreToLoad && (
          <ContainerButtonCentral>
            <LoadButton onClick={() => getMoreExpenses()}>Load more</LoadButton>
          </ContainerButtonCentral>
        )}

        {!expenses.length && (
          <ContainerSubtitle>
            <Subtitle>There are no more expenses to show</Subtitle>
            <Button as={Link} to="/">
              Add expenses
            </Button>
          </ContainerSubtitle>
        )}
      </List>
    
      <BalanceBar />
      <TotalBar />
    </>
  );
}

export default ExpensesList;
