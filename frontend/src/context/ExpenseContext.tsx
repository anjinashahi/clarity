import React, { createContext, useState, useCallback, useEffect } from "react";
import { expenseAPI } from "../services/api";

export interface Expense {
  _id: string;
  user: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  addExpense: (amount: number, category: string, date: string, description?: string) => Promise<void>;
  updateExpense: (id: string, amount: number, category: string, date: string, description?: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseAPI.getAll();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = useCallback(
    async (amount: number, category: string, date: string, description?: string) => {
      try {
        const newExpense = await expenseAPI.add(amount, category, date, description);
        setExpenses([...expenses, newExpense]);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [expenses]
  );

  const updateExpense = useCallback(
    async (id: string, amount: number, category: string, date: string, description?: string) => {
      try {
        const updated = await expenseAPI.update(id, amount, category, date, description);
        setExpenses(expenses.map(e => e._id === id ? updated : e));
      } catch (err: any) {
        setError(err.message);
      }
    },
    [expenses]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      try {
        await expenseAPI.delete(id);
        setExpenses(expenses.filter(e => e._id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    },
    [expenses]
  );

  // Fetch expenses on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchExpenses();
    } else {
      console.warn("No token found - user may not be logged in");
      setError("Please login to view expenses");
    }
  }, [fetchExpenses]);

  return (
    <ExpenseContext.Provider
      value={{ expenses, loading, error, fetchExpenses, addExpense, updateExpense, deleteExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
