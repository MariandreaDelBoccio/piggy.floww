import { Listbox, ListboxOption } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import CategoryIcon from "./CategoryIcon";
import type { CategoriesSelectProps, Category } from "../../../types/types";

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

const CategoriesSelect = ({ category, changeCategory }: CategoriesSelectProps) => {
  const selected = categories.find((c) => c.id === category) || categories[0];

  return (
    <div className="relative w-80 mb-4 text-lg sm:w-full">
      <Listbox value={selected.id} onChange={changeCategory}>
        <Listbox.Button className="w-full h-12 px-5 py-2 rounded-lg border border-gray-300 bg-white flex justify-between items-center hover:bg-gray-100 transition-all">
          <span className="uppercase">{selected.text}</span>
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 mt-2 w-full max-h-72 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
          {categories.map((cat) => (
            <ListboxOption
              key={cat.id}
              value={cat.id}
              className={({ active }) =>
                `cursor-pointer px-5 py-3 flex items-center ${
                  active ? "bg-gray-100" : ""
                }`
              }
            >
              <CategoryIcon id={cat.id} className="w-7 h-7 mr-4 flex-shrink-0" />
              <span>{cat.text}</span>
            </ListboxOption>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export default CategoriesSelect;
