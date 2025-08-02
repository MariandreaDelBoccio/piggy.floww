import { Helmet } from "react-helmet-async";
import ExpensesForm from "./components/ExpensesForm";
import ExpensesList from "./components/ExpensesList";
import useIsMobile from "./hooks/useIsMobile";
import theme from "./theme";
import { FormContainer } from "./elements/FormElements";

function App() {
  const isMobile = useIsMobile();

  return (
    <>
      <Helmet>
        <title>Expenses</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>

      <div className="flex" style={{ height: "90vh"}}>
        {/* Main Content */}
        <div className="flex-1 flex flex-col mt-xs lg:mt-0">
          {/* Content */}
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
          {/* End Content */}

          {/* Bottom bar */}
          <div className="bg-white border-t border-gray-200 px-6">
            <div className="max-w-4xl mx-auto space-y-4"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;