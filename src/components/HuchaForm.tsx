import { useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

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

import CategoriesSelect from "./CategoriesSelect";
import DatePicker from "./DatePicker";
import theme from "../theme";

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

    const q = query(collection(db, "huchas"), where("userId", "==", user.uid));

    const newDocRef = doc(collection(db, "huchas"));
    const newDocId = newDocRef.id;

    const snapshot = await getDocs(q);
    const nextPriority = snapshot.size + 1; // Simple: siguiente número

    await setDoc(newDocRef, {
      id: newDocId,
      name: category,
      goal,
      description,
      color,
      deadline: Timestamp.fromDate(deadline),
      priority: nextPriority,
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

      <div
        className={`border-${theme.grisClaro2} border-2 rounded-lg bg-white m-6`}
      >
        <Header>
          <BackBtn route="/money-box" />
          <Title>Add Hucha</Title>
        </Header>
        <Form onSubmit={handleSubmit}>
          <FilterContainer>
            <label className="text-xs font-semibold pb-2" htmlFor="category">
              Select category
            </label>
            <CategoriesSelect
              category={category}
              changeCategory={setCategory}
            />
            <div className="grid">
              <label className="text-xs font-semibold pb-2" htmlFor="deadline">
                Deadline
              </label>
              <DatePicker
                date={deadline}
                changeDate={(date) => {
                  if (date) setDeadline(date);
                }}
              />
            </div>
          </FilterContainer>
          <FilterContainer>
            <div className="grid">
              <label className="text-xs font-semibold pb-2" htmlFor="amount">
                Amount
              </label>
              <Input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
                placeholder="0.00€"
              />
            </div>
          </FilterContainer>

          <div className="grid">
            <label className="text-xs font-semibold pb-2" htmlFor="description">
              Description
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid mt-6 ml-10 w-full">
            <label className="text-xs font-semibold pb-2" htmlFor="color">
              Pick a color
            </label>
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
            <Button as="button" to="#" type="submit" $width="20rem">
              Save
            </Button>
          </ButtonContainer>
        </Form>
      </div>
    </>
  );
}
