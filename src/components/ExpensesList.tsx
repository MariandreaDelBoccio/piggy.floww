import { Helmet } from "react-helmet-async";
import { Header, Title } from "../elements/Header";
import BackBtn from "../elements/BackBtn";
import useGetExpenses from "../hooks/useGetExpenses";
import {
  List,
  ElementList,
  Category,
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
import useIsMobile from "../hooks/useIsMobile";
import theme from "../theme";

function ExpensesList() {
  const [expenses, getMoreExpenses, moreToLoad] = useGetExpenses();
  const isMobile = useIsMobile();

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
      {/* Helmet solo en mobile cuando es una ruta separada */}
      {isMobile && (
        <Helmet>
          <title>Expenses list</title>
          <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
        </Helmet>
      )}

      <div
        className={`border-${theme.grisClaro2} border-2 rounded-lg bg-white m-6`}
      >
        {/* Header y BackBtn solo en mobile */}
        {isMobile && (
          <Header>
            <BackBtn />
            <Title>Expenses list</Title>
          </Header>
        )}
        <List>
          {expenses.map((expense, index) => {
            return (
              <div key={expense.id}>
                {!sameDate(expenses, index, expense) && (
                  <Date>{formatDate(expense.date)}</Date>
                )}
                <ElementList key={expense.id}>
                  <div>
                    <Category>
                      <CategoryICon id={expense.category} />
                    </Category>

                    <div className="grid">
                      <span className="font-medium">{expense.description}</span>
                      <span className="font-light">
                        {expense.category.charAt(0).toUpperCase() +
                          expense.category.substring(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Value>{formatCurrency(Number(expense.quantity))}</Value>

                    <ButtonContainer className="flex">
                      <ActionButton as={Link} to={`/edit/${expense.id}`}>
                        <EditIcon />
                      </ActionButton>
                      <ActionButton
                        onClick={() => deleteExpense(expense.id as string)}
                      >
                        <DeleteIcon />
                      </ActionButton>
                    </ButtonContainer>
                  </div>
                </ElementList>
              </div>
            );
          })}

          {moreToLoad && (
            <ContainerButtonCentral>
              <LoadButton onClick={() => getMoreExpenses()}>
                Load more
              </LoadButton>
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
      </div>
    </>
  );
}

export default ExpensesList;
