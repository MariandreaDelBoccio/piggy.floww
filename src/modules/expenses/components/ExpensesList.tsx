import { Helmet } from "react-helmet-async";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import useGetExpenses from "../../../hooks/useGetExpenses";
import useIsMobile from "../../../hooks/useIsMobile";
import type { FbStorageExpenses } from "../../../types/types";
import deleteExpense from "../../../firebase/deleteExpense";
import { List } from "../../../components/base/list/List";
import { ElementList } from "../../../components/base/list/ElementsList";
import { Category } from "../../../components/base/list/Category";
import CategoryIcon from "../../../components/base/categories/CategoryIcon";
import { Value } from "../../../components/base/list/Value";
import { ButtonContainer } from "../../../components/base/button/ButtonContainer";
import { ActionButton } from "../../../components/base/button/ActionButton";
import { ContainerButtonCentral } from "../../../components/base/button/ContainerButtonCentral";
import { LoadButton } from "../../../components/base/button/LoadButton";
import { ContainerSubtitle } from "../../../components/base/list/ContainerSubtitle";
import { Subtitle } from "../../../components/base/list/Subtitle";
import { Button } from "../../../components/base/button/Button";
import { formatDate } from "../../../hooks/useFormatDate";
import formatCurrency from "../../../functions/currencyConvertion";

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

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
    } catch (error) {
      console.error("Error deleting expense:", error);
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

      <div className="border-2 border-gray-300 rounded-lg bg-white m-6">
        
        <List>
          {expenses.map((expense, index) => {
            return (
              <div key={expense.id}>
                {!sameDate(expenses, index, expense) && (
                  <Date>{formatDate(expense.date)}</Date>
                )}
                
                <ElementList>
                  <div className="flex items-center">
                    <Category>
                      <CategoryIcon id={expense.category} className="w-6 h-6 text-gray-600" />
                    </Category>

                    <div className="grid">
                      <span className="font-medium text-gray-900">
                        {expense.description}
                      </span>
                      <span className="font-light text-gray-500 text-sm">
                        {expense.category.charAt(0).toUpperCase() + expense.category.substring(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Value>{formatCurrency(Number(expense.quantity))}</Value>

                    <ButtonContainer>
                      <ActionButton 
                        as={Link} 
                        to={`/edit/${expense.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </ActionButton>
                      
                      <ActionButton
                        onClick={() => handleDeleteExpense(expense.id as string)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <TrashIcon className="w-5 h-5" />
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
              <Button 
                variant="primary"
                className="mt-4"
              >
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