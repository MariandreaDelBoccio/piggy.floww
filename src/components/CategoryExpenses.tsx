import { Helmet } from "react-helmet-async";
import { Header, Title } from "../elements/Header";
import BackBtn from "../elements/BackBtn";
import TotalBar from "./totalBar";
import useGetExpenseByCat from "../hooks/useGetExpenseByCat";
import {
  ListCategories,
  ElementListCategories,
  Category,
  Value,
} from "../elements/ListElements";
import CategoryICon from "../elements/CategoryIcons";
import formatCurrency from "../functions/currencyConvertion";
import BalanceBar from "./BalanceBar";

function CategoryExpenses() {
  const expenses = useGetExpenseByCat();

  return (
    <>
      <Helmet>
        <title>Category expenses</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>
      <Header>
        <BackBtn />
        <Title>Category expenses</Title>
      </Header>

      <ListCategories>
        {expenses.map((expense, index) => {
          return (
            <ElementListCategories key={index}>
              <Category>
                <CategoryICon id={expense.category} />
                {expense.category}
              </Category>
              <Value>{formatCurrency(expense.quantity)}</Value>
            </ElementListCategories>
          );
        })}
      </ListCategories>

      <BalanceBar />
      <TotalBar />
    </>
  );
}

export default CategoryExpenses;
