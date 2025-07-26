import { useState } from "react";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import PlusIcon from "../assets/images/plus.svg?react";

import {
  FilterContainer,
  Form,
  Input,
  ButtonContainer,
} from "../elements/FormElements";
import { Helmet } from "react-helmet-async";
import { Header, Title } from "../elements/Header";
import BackBtn from "../elements/BackBtn";
import Button from "../elements/Button";
import { Description } from "../elements/ListElements";

import CategoriesSelect from "./CategoriesSelect";
import DatePicker from "./DatePicker";

export default function HuchaForm() {
  const [goal, setGoal] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [category, setCategory] = useState("home");
  const [deadline, setDeadline] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  const newDocRef = doc(collection(db, "huchas"));
  const newDocId = newDocRef.id;

  await setDoc(newDocRef, {
    id: newDocId,        
    name: category,
    goal,
    description,
    color,
    deadline: Timestamp.fromDate(deadline),
    userId: user.uid,
    createdAt: Timestamp.now(),
  });

  navigate("/money-box");
};

  return (
    <>
      <Helmet>
        <title>Add Hucha</title>
        <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      </Helmet>
      <Header>
        <BackBtn route="/money-box" />
        <Title>Add Hucha</Title>
      </Header>
      <Form onSubmit={handleSubmit}>
        <FilterContainer>
          <CategoriesSelect category={category} changeCategory={setCategory} />
          <div style={{ textAlign: "center"}}>
            <strong>Deadline</strong>
            <DatePicker
              date={deadline}
              changeDate={(date) => {
                if (date) setDeadline(date);
              }}
            />
          </div>
        </FilterContainer>
        <FilterContainer>
          <div style={{ flex: 1 }}>
            <Input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
              placeholder="0.00€"
            />
          </div>
        </FilterContainer>

        <div style={{ flex: 1, marginRight: "1rem" }}>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Description"
          />
        </div>

        <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
          <Description>Pick a color</Description>
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{
              width: "3rem",
              height: "3rem",
              padding: "3px",
              borderRadius: "100px",
              borderBottom: "white",
              background: "white",
            }}
          />
        </div>
        <ButtonContainer>
          <Button as="button" to="#" $primary $hasIcon type="submit">
            Save
            <PlusIcon />
          </Button>
        </ButtonContainer>
      </Form>
    </>
  );
}
