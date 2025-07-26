import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ExpensesList from "../ExpensesList";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

// 🔁 Mock del hook
vi.mock("../hooks/useGetExpenses", () => ({
  default: vi.fn(),
}));

// 🔁 Mock de deleteExpense
vi.mock("../../firebase/deleteExpense", () => ({
  default: vi.fn(),
}));

// Mock useGetExpenses
vi.mock('../../hooks/useGetExpenses');

import useGetExpenses from "../../hooks/useGetExpenses";
import deleteExpense from "../../firebase/deleteExpense";
import type { FbStorageExpenses } from "../../types/types";

const mockUseGetExpenses = useGetExpenses as unknown as ReturnType<typeof vi.fn>;
const mockExpenses: FbStorageExpenses[] = [];

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </HelmetProvider>
  );
}

describe("ExpensesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza mensaje si no hay gastos", () => {
    mockUseGetExpenses.mockReturnValue([mockExpenses, vi.fn(), false]);

    renderWithProviders(<ExpensesList />);

    expect(screen.getByText(/there are no more expenses to show/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /add expenses/i })).toBeInTheDocument();
  });

  it("renderiza gastos si existen", () => {
    const mockExpenses = [
      {
        id: "1",
        category: "Food",
        description: "Lunch",
        quantity: 12.5,
        date: 1719446400, // 2024-07-27
      },
    ];
    mockUseGetExpenses.mockReturnValue([mockExpenses, vi.fn(), false]);

    renderWithProviders(<ExpensesList />);

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.getByText("12,50 €")).toBeInTheDocument();
    expect(screen.queryByText(/there are no more expenses/i)).not.toBeInTheDocument();
  });

  it("llama a deleteExpense cuando se hace click en el botón", () => {
    const mockExpenses = [
      {
        id: "1",
        category: "Transport",
        description: "Bus",
        quantity: 2,
        date: 1719446400,
      },
    ];
    mockUseGetExpenses.mockReturnValue([mockExpenses, vi.fn(), false]);

    renderWithProviders(<ExpensesList />);

    const deleteBtn = screen.getByRole("button", { name: "" }); 
    fireEvent.click(deleteBtn);

    expect(deleteExpense).toHaveBeenCalledWith("1");
  });

  it("muestra botón 'Load more' si hay más por cargar", () => {
    const getMore = vi.fn();
    const mockExpenses = [
      {
        id: "1",
        category: "Tech",
        description: "Mouse",
        quantity: 25,
        date: 1719446400,
      },
    ];
    mockUseGetExpenses.mockReturnValue([mockExpenses, getMore, true]);

    renderWithProviders(<ExpensesList />);

    const loadMoreBtn = screen.getByRole("button", { name: /load more/i });
    expect(loadMoreBtn).toBeInTheDocument();

    fireEvent.click(loadMoreBtn);
    expect(getMore).toHaveBeenCalled();
  });
});
