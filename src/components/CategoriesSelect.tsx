import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import theme from "../theme";
import Down from "../assets/images/down.svg?react";
import type { CategoriesSelectProps, Category } from "../types/types";
import CategoryICon from "../elements/CategoryIcons";

const SelectContainer = styled.div`
  background: ${theme.grisClaro};
  cursor: pointer;
  border-radius: 0.625rem; /* 10px */
  position: relative;
  height: 5rem; /* 80px */
  width: 20%;
  padding: 0px 1.25rem; /* 20px */
  font-size: 1.5rem; /* 24px */
  text-align: center;
  display: flex;
  align-items: center;
  transition: 0.5s ease all;
  margin-bottom: 1rem;
  &:hover {
    background: ${theme.grisClaro2};
  }

  @media (max-width: 60rem) {
    /* 950px */
    width: 100%;
  }
`;

const SelectedOption = styled.div`
  width: 100%;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: space-between;
  svg {
    width: 1.25rem; /* 20px */
    height: auto;
    margin-left: 1.25rem; /* 20px */
  }
`;

const Options = styled.div`
  background: ${theme.grisClaro};
  position: absolute;
  top: 5.62rem; /* 90px */
  left: 0;
  width: 60vw;
  border-radius: 0.625rem; /* 10px */
  max-height: 18.75rem; /* 300px */
  overflow-y: auto;
  z-index: 2;

  @media (max-width: 60rem) {
    /* 950px */
    width: 100%;
  }
`;

const Option = styled.div`
  padding: 1.25rem; /* 20px */
  display: flex;
  svg {
    width: 28px;
    height: auto;
    margin-right: 1.25rem; /* 20px */
  }
  &:hover {
    background: ${theme.grisClaro2};
  }
`;

const CategoriesSelect = ({
  category,
  changeCategory,
}: CategoriesSelectProps) => {
  const [showSelect, changeShowSelect] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    changeCategory(e.currentTarget.dataset.value || "");
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        changeShowSelect(false);
      }
    };

    if (showSelect) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showSelect]);

  const categories: Category[] = [
    { id: "food", text: "Food" },
    { id: "debt", text: "Debt" },
    { id: "home", text: "Home" },
    { id: "transport", text: "Transport" },
    { id: "clothes", text: "Clothes" },
    { id: "health", text: "Health" },
    { id: "shopping", text: "Shopping" },
    { id: "fun", text: "Fun" },
  ];

  return (
    <SelectContainer onClick={() => changeShowSelect(!showSelect)}>
      <SelectedOption>
        {category} <Down />
      </SelectedOption>

      {showSelect && (
        <Options>
          {categories.map((category) => {
            return (
              <Option
                key={category.id}
                data-value={category.id}
                onClick={handleClick}
              >
                <CategoryICon id={category.id} />
                {category.text}
              </Option>
            );
          })}
        </Options>
      )}
    </SelectContainer>
  );
};

export default CategoriesSelect;
