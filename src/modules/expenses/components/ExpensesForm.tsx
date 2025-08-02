import { useEffect, useState } from "react";
import { getUnixTime } from "date-fns";
import {  useNavigate } from "react-router-dom";
import { Form } from "../../../components/base/form/Form";
import { FilterContainer } from "../../../components/base/form/FilterContainer";
import type { ExpensesFormProps } from "../../../types/types";
import useAuth from "../../../context/useAuth";
import editExpense from "../../../firebase/editExpense";
import addExpense from "../../../firebase/addExpense";
import CategoriesSelect from "../../../components/base/categories/CategorySelector";
import { DatePicker } from "../../../components/base/form/DatePicker";
import { Input } from "../../../components/base/form/Input";
import { ButtonContainer } from "../../../components/base/button/ButtonContainer";
import { Button } from "../../../components/base/button/Button";
import { Alert } from "../../../components/base/Alert";

const ExpensesForm = ({ expense }: ExpensesFormProps) => {
  const [descInput, changeDescInput] = useState("");
  const [valueInput, changeValueInput] = useState("");
  const [category, changeCategory] = useState("home");
  const [selectedDate, changeSelectedDate] = useState<Date>(new Date());
  const [alertStatus, changeAlertStatus] = useState(false);
  const [alert, changeAlert] = useState("");
  const [alertType, changeAlertType] = useState<'success' | 'error' | 'warning' | 'info'>("error");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (expense) {
      if (expense.data().id === user?.uid) {
        changeCategory(expense.data().category);
        changeDescInput(expense.data().description);
        changeValueInput(expense.data().quantity);
        changeSelectedDate(expense.data().date);
      } else {
        navigate("/");
      }
    }
  }, [expense, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "description") {
      changeDescInput(e.target.value);
    } else {
      changeValueInput(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const quantity = parseFloat(valueInput).toFixed(2);

    if (descInput !== "" && valueInput !== "") {
      if (expense) {
        editExpense({
          id: expense.id,
          category,
          description: descInput,
          quantity,
          date: getUnixTime(selectedDate),
        }).then(() => {
          navigate("/list");
        });
      } else {
        addExpense({
          category,
          description: descInput,
          quantity,
          date: getUnixTime(selectedDate),
          id: user?.uid,
        })
          .then(() => {
            changeCategory("home");
            changeDescInput("");
            changeValueInput("");
            changeSelectedDate(new Date());

            changeAlertStatus(true);
            changeAlertType("success");
            changeAlert("Expense added successfully.");
          })
          .catch((error: { message: string }) => {
            changeAlertStatus(true);
            changeAlertType("error");
            changeAlert(error.message);
          });
      }
    } else {
      changeAlertStatus(true);
      changeAlertType("error");
      changeAlert("Please fill all the data.");
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FilterContainer>
          <label className="text-xs font-semibold pb-2" htmlFor="category">
            Select category
          </label>
          <CategoriesSelect
            category={category}
            changeCategory={changeCategory}
          />
          <label className="text-xs font-semibold pb-2" htmlFor="date">
            Select date
          </label>
          <DatePicker
            date={selectedDate}
            changeDate={(date) => {
              if (date) changeSelectedDate(date);
            }}
          />
        </FilterContainer>

        <div className="flex flex-col items-start w-full">
          <label className="text-xs font-semibold pb-2" htmlFor="description">
            Description
          </label>
          <Input
            type="text"
            name="description"
            id="description"
            value={descInput}
            onChange={handleChange}
            placeholder="Enter expense description..."
          />
          <label className="text-xs font-semibold pb-2 mt-8" htmlFor="value">
            Amount
          </label>
          <Input
            type="number"
            name="value"
            id="value"
            placeholder="0.00€"
            value={valueInput}
            onChange={handleChange}
            step="0.01"
            min="0"
          />
        </div>

        <ButtonContainer>
          <Button
            type="submit"
            width="20rem"
            variant="primary"
          >
            {expense ? "Edit" : "Add"}
          </Button>
        </ButtonContainer>

        <Alert
          type={alertType}
          message={alert}
          alertStatus={alertStatus}
          changeAlertStatus={changeAlertStatus}
        />
      </Form>
    </>
  );
};

export default ExpensesForm;