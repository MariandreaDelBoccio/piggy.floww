import { Helmet } from "react-helmet-async";
import { Header, Title } from "../elements/Header";
import BackBtn from "../elements/BackBtn";
import useGetExpenseByCat from "../hooks/useGetExpenseByCat";
import {
  ListCategories,
  ElementListCategories,
  Category,
  Value,
} from "../elements/ListElements";
import CategoryICon from "../elements/CategoryIcons";
import formatCurrency from "../functions/currencyConvertion";

function CategoryExpenses() {
  // Destructure the new return structure (if using extended version)
  const { expensesByCat: expenses, currentPeriod, userSettings } = useGetExpenseByCat();

  return (
    <>
      <Helmet>
        <title>Category expenses</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>

      <div className="bg-white m-6 border-2 rounded-lg">
        <Header>
          <BackBtn />
          <Title>Category expenses</Title>
        </Header>

        {/* Optional: Show current period info */}
        {currentPeriod && userSettings && (
          <div className="px-4 py-2 bg-gray-50 border-b">
            <p className="text-sm text-gray-600">
              Period: {currentPeriod.start.toLocaleDateString()} - {currentPeriod.end.toLocaleDateString()}
              {userSettings.monthStartDay !== 1 && (
                <span className="ml-2 text-xs">
                  (Custom cycle starting day {userSettings.monthStartDay})
                </span>
              )}
            </p>
          </div>
        )}

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
      </div>
    </>
  );
}

export default CategoryExpenses;