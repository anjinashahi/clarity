import { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { IncomeContext } from "../context/IncomeContext";

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within ExpenseProvider");
  }
  return context;
};

export const useIncome = () => {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error("useIncome must be used within IncomeProvider");
  }
  return context;
};
