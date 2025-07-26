import { useEffect, useState } from "react";
import {
  Input,
  ButtonContainer,
  BigInput,
  FilterContainer,
  Form,
} from "../elements/FormElements";
import Button from "../elements/Button";
import CategoriesSelect from "./CategoriesSelect";
import DatePicker from "./DatePicker";
import addExpense from "../firebase/addExpense";
import { getUnixTime } from "date-fns";
import useAuth from "../context/useAuth";
import Alert from "../elements/Alert";
import { useNavigate } from "react-router-dom";
import type { ExpensesFormProps } from "../types/types";
import editExpense from "../firebase/editExpense";

const ExpensesForm = ({ expense }: ExpensesFormProps) => {
  const [descInput, changeDescInput] = useState("");
  const [valueInput, changeValueInput] = useState("");
  const [category, changeCategory] = useState("home");
  const [selectedDate, changeSelectedDate] = useState<Date>(new Date());
  const [alertStatus, changeAlertStatus] = useState(false);
  const [alert, changeAlert] = useState("");
  const [alertType, changeAlertType] = useState("error");
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

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
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
      changeAlert("Please fill all the data.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FilterContainer>
        <CategoriesSelect category={category} changeCategory={changeCategory} />
        <DatePicker
          date={selectedDate}
          changeDate={(date) => {
            if (date) changeSelectedDate(date);
          }}
        />
      </FilterContainer>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Input
          type="text"
          name="description"
          id="description"
          placeholder="Description"
          value={descInput}
          onChange={handleChange}
        />
        <BigInput
          type="number"
          name="value"
          id="value"
          placeholder="0.00€"
          value={valueInput}
          onChange={handleChange}
          style={{ border: "none" }}
        />
      </div>
      <ButtonContainer>
        <Button as="button" to="#" $primary $hasIcon type="submit">
          {expense ? "Edit" : "Add"}
        </Button>
      </ButtonContainer>

      <Alert
        $type={alertType}
        $message={alert}
        $alertStatus={alertStatus}
        $changeAlertStatus={changeAlertStatus}
      />
    </Form>
  );
};

export default ExpensesForm;
