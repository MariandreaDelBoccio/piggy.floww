import { useLocation } from "react-router-dom"
import BaseContainer from "../../components/base/Container"
import useIsMobile from "../../hooks/useIsMobile"
import { FormContainer } from "../../elements/FormElements"
import theme from "../../theme"
import ExpensesForm from "./components/ExpensesForm"
import ExpensesList from "./components/ExpensesList"

const Expenses = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const showTitle = isMobile && !location.pathname.includes("edit")
  const title = showTitle ? "Add new expense" : "Expenses"
  
  return (
    <BaseContainer title={title}>
      <div className="flex flex-1" style={{ background: theme.grisClaro }}>
        {/* Form Section */}
        <FormContainer
          className={`${
            isMobile 
              ? "w-full flex items-center justify-center p-4 bg-white my-4 mx-4" 
              : "w-1/3 p-8 bg-white my-6 ml-6 mr-0"
          }`}
        >
          <div className="max-w-md mx-auto">
            <ExpensesForm />
          </div>
        </FormContainer>

        {/* List Section - Solo en desktop */}
        {!isMobile && (
          <FormContainer className="w-2/3 p-8 bg-white my-6 mx-6">
            <div className="max-w-4xl mx-auto">
              <ExpensesList />
            </div>
          </FormContainer>
        )}
      </div>
    </BaseContainer>
  )
}

export default Expenses;