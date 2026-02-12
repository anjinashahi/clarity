import { useState, useCallback } from "react";
import { recurringExpenseAPI } from "../services/api";

export const useRecurringExpense = () => {
  const [recurringExpenses, setRecurringExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecurringExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recurringExpenseAPI.getAll();
      setRecurringExpenses(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch recurring expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecurringExpense = useCallback(
    async (amount: number, category: string, frequency: string, startDate: string, description?: string) => {
      try {
        const newExpense = await recurringExpenseAPI.add(amount, category, frequency, startDate, description);
        setRecurringExpenses([...recurringExpenses, newExpense]);
        return newExpense;
      } catch (err: any) {
        throw err;
      }
    },
    [recurringExpenses]
  );

  const updateRecurringExpense = useCallback(
    async (id: string, amount: number, category: string, frequency: string, startDate: string, description?: string, isActive?: boolean) => {
      try {
        const updated = await recurringExpenseAPI.update(id, amount, category, frequency, startDate, description, isActive);
        setRecurringExpenses(
          recurringExpenses.map((expense) => (expense._id === id ? updated : expense))
        );
        return updated;
      } catch (err: any) {
        throw err;
      }
    },
    [recurringExpenses]
  );

  const deleteRecurringExpense = useCallback(
    async (id: string) => {
      try {
        await recurringExpenseAPI.delete(id);
        setRecurringExpenses(recurringExpenses.filter((expense) => expense._id !== id));
      } catch (err: any) {
        throw err;
      }
    },
    [recurringExpenses]
  );

  return {
    recurringExpenses,
    loading,
    error,
    fetchRecurringExpenses,
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
  };
};
