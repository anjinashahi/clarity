import React, { createContext, useState, useCallback, useEffect } from "react";
import { incomeAPI } from "../services/api";

export interface Income {
  _id: string;
  user: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface IncomeContextType {
  incomes: Income[];
  loading: boolean;
  error: string | null;
  fetchIncomes: () => Promise<void>;
  addIncome: (amount: number, category: string, date: string, description?: string) => Promise<void>;
  updateIncome: (id: string, amount: number, category: string, date: string, description?: string) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
}

export const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const IncomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await incomeAPI.getAll();
      setIncomes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addIncome = useCallback(
    async (amount: number, category: string, date: string, description?: string) => {
      try {
        const newIncome = await incomeAPI.add(amount, category, date, description);
        setIncomes([...incomes, newIncome]);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [incomes]
  );

  const updateIncome = useCallback(
    async (id: string, amount: number, category: string, date: string, description?: string) => {
      try {
        const updated = await incomeAPI.update(id, amount, category, date, description);
        setIncomes(incomes.map(i => i._id === id ? updated : i));
      } catch (err: any) {
        setError(err.message);
      }
    },
    [incomes]
  );

  const deleteIncome = useCallback(
    async (id: string) => {
      try {
        await incomeAPI.delete(id);
        setIncomes(incomes.filter(i => i._id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    },
    [incomes]
  );

  // Fetch incomes on mount if token exists
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchIncomes();
    }
  }, [fetchIncomes]);

  return (
    <IncomeContext.Provider
      value={{ incomes, loading, error, fetchIncomes, addIncome, updateIncome, deleteIncome }}
    >
      {children}
    </IncomeContext.Provider>
  );
};
